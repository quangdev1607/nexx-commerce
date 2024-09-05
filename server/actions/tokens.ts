"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  emailTokens,
  passwordResetTokens,
  twoFactorTokens,
  users,
} from "../db/schema";

import crypto from "crypto";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
    });
    console.log(verificationToken);
    return verificationToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 900 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  return verificationToken;
};

const getVerificationToken = async (token: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, token),
    });
    console.log(verificationToken);
    return verificationToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const newVerification = async (token: string) => {
  const existedToken = await getVerificationToken(token);
  if (!existedToken) return { error: "Token not found" };
  const hasExpired = new Date(existedToken.expires) < new Date();

  if (hasExpired) return { error: "Token has expired" };

  const existedUser = await db.query.users.findFirst({
    where: eq(users.email, existedToken.email),
  });

  if (!existedUser) return { error: "Email does not exist" };

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existedToken.email,
    })
    .where(eq(users.id, existedUser.id));

  await db.delete(emailTokens).where(eq(emailTokens.id, existedToken.id));

  return { success: "Email verified! Please login to continue" };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getPasswordResetByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    return passwordResetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 900 * 1000);
    const existedToken = await getPasswordResetByEmail(email);

    if (existedToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existedToken.id));
    }

    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return passwordResetToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });
    return twoFactorToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    const expires = new Date(new Date().getTime() + 300 * 1000);

    const existedToken = await getTwoFactorTokenByEmail(email);
    if (existedToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, existedToken.id));
    }

    const twoFactorToken = await db
      .insert(twoFactorTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return twoFactorToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};
