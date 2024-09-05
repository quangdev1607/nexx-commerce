"use client";

import {
  LogIn,
  LogOut,
  Settings,
  TruckIcon,
  User,
  UserPlus,
} from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";

export const UserButton = ({ user }: Session) => {
  const router = useRouter();

  return (
    <DropdownMenuContent className="w-64 p-6" align="end">
      {user ? (
        <div className="flex flex-col items-center gap-1 rounded-lg bg-primary/10 p-4">
          {user.image && (
            <Image
              src={user.image}
              alt={user.name!}
              className="size-9 rounded-full"
              width={36}
              height={36}
            />
          )}
          <p className="text-xs font-bold">{user.name}</p>
          <span className="text-xs font-medium text-secondary-foreground">
            {user.email}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-primary/10 p-4">
          <User className="size-7" />
          <span className="text-sm font-medium text-secondary-foreground">
            Guest
          </span>
        </div>
      )}
      <ModeToggle />

      <DropdownMenuSeparator className="m-2" />
      {user ? (
        <>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/orders")}
            className="group cursor-pointer py-2 font-medium"
          >
            <TruckIcon
              size={14}
              className="mr-3 transition-all duration-300 ease-in-out group-hover:translate-x-1"
            />{" "}
            My orders
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/settings")}
            className="group cursor-pointer py-2 font-medium"
          >
            <Settings
              size={14}
              className="mr-3 transition-all duration-300 ease-in-out group-hover:translate-x-1"
            />{" "}
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => signOut()}
            className="group cursor-pointer py-2 font-medium focus:bg-destructive/30"
          >
            <LogOut
              size={14}
              className="mr-3 transition-all duration-300 ease-in-out group-hover:translate-x-1"
            />
            Sign out
          </DropdownMenuItem>
        </>
      ) : (
        <>
          <DropdownMenuItem
            onClick={() => router.push("/auth/login")}
            className="group flex cursor-pointer items-center gap-4"
          >
            <LogIn
              className="transition-all duration-300 ease-in-out group-hover:translate-x-1"
              size={14}
            />
            <span>Login</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/auth/register")}
            className="group flex cursor-pointer items-center gap-4"
          >
            <UserPlus
              className="transition-all duration-300 ease-in-out group-hover:translate-x-1"
              size={14}
            />
            <span>Register</span>
          </DropdownMenuItem>
        </>
      )}
    </DropdownMenuContent>
  );
};
