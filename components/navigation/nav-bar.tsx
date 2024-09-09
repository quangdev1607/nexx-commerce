import { auth } from "@/server/auth";
import { User } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "../ui/avatar";

import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";

import { db } from "@/server/db";
import { userAddress } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CartDrawer } from "../cart/cart-drawer";
import { UserButton } from "./user-button";

export const Navbar = async () => {
  const session = await auth();
  const userAddressData = await db.query.userAddress.findFirst({
    where: eq(userAddress?.userId, session?.user.id as string),
  });

  return (
    <header className="py-8">
      <nav>
        <ul className="flex items-center justify-between gap-4 md:gap-8">
          <li className="flex flex-1 list-none">
            <Link href={"/"}>
              <Image
                src={"/logo/logo-darkmode.svg"}
                alt="logo"
                width={100}
                height={100}
                className="hidden dark:block"
              />
            </Link>
            <Link href={"/"}>
              <Image
                src={"/logo/logo-light-mode.svg"}
                alt="logo"
                width={100}
                height={100}
                className="dark:hidden"
              />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer session={session!} userAddress={userAddressData} />
          </li>
          <li className="flex list-none items-center justify-center">
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="outline-none">
                {session?.user ? (
                  <Avatar className="size-11">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name!}
                        fill={true}
                      />
                    )}
                    {!session.user.image && (
                      <AvatarFallback className="bg-primary/25">
                        <div className="font-bold">
                          {session.user.name?.charAt(0).toUpperCase()}
                        </div>
                      </AvatarFallback>
                    )}
                  </Avatar>
                ) : (
                  <div className="rounded-full bg-primary/20 p-1.5">
                    <User className="size-9" />
                  </div>
                )}
              </DropdownMenuTrigger>
              <UserButton expires={session?.expires!} user={session?.user!} />
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
};
