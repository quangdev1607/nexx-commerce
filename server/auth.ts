// @ts-nocheck

import { LoginSchema } from "@/formSchema";
import { db } from "@/server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import { accounts, userAddress, users } from "./db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  trustHost: true,
  secret: process.env.AUTH_SECRET!,
  session: { strategy: "jwt" },

  callbacks: {
    async session({ session, token }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role as string;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
        session.user.isAddress = token.isAddress as boolean;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existedUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
        with: {
          userAddress: true,
        },
      });
      if (!existedUser) return token;
      const existedAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existedUser.id),
      });

      token.isOAuth = !!existedAccount;
      token.name = existedUser.name;
      token.email = existedUser.email;
      token.role = existedUser.role;
      token.isTwoFactorEnabled = existedUser.twoFactorEnabled;
      token.image = existedUser.image;
      token.isAddress = !!existedUser.userAddress?.id;

      return token;
    },
  },
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    github({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await db.query.users.findFirst({
            where: eq(users.email, email),
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
        }
        return null;
      },
    }),
  ],
});
