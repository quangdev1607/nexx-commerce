"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export const Logo = () => {
  const { theme } = useTheme();

  return (
    <Link href={"/"} aria-label="nexx commerce logo">
      {theme === "dark" ? (
        <Image
          src={"/logo/logo-darkmode.svg"}
          alt="logo"
          width={100}
          height={100}
        />
      ) : (
        <Image
          src={"/logo/logo-light-mode.svg"}
          alt="logo"
          width={100}
          height={100}
        />
      )}
    </Link>
  );
};
