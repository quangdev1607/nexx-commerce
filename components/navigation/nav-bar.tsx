import { auth } from "@/server/auth";
import { User } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback } from "../ui/avatar";

import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Logo } from "./Logo";

import { UserButton } from "./user-button";

export const Navbar = async () => {
  const session = await auth();

  return (
    <header className="py-8">
      <nav>
        <ul className="flex items-center justify-between gap-4 md:gap-8">
          <li className="flex flex-1 list-none">
            <Logo />
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
              <UserButton expires={session?.expires!} user={session?.user} />
            </DropdownMenu>
          </li>
        </ul>
      </nav>
    </header>
  );
};
