"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export const BackButton = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => {
  return (
    <Button asChild variant={"link"} className="w-full font-medium">
      <Link aria-label={label} href={href}>
        {label}
      </Link>
    </Button>
  );
};
