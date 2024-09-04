"use client";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Droplet } from "lucide-react";

import { useTheme } from "next-themes";
export const ModeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="group mt-2 flex cursor-pointer items-center gap-4">
        <Droplet
          className="transition-all duration-300 ease-in-out group-hover:translate-x-1"
          size={14}
        />
        <span>Themes</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem
            className="cursor-pointer justify-between"
            onClick={() => setTheme("light")}
          >
            <span>Light</span>
            {theme === "light" && <Check className="mr-2 h-4 w-4" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer justify-between"
            onClick={() => setTheme("dark")}
          >
            <span>Dark</span>
            {theme === "dark" && <Check className="mr-2 h-4 w-4" />}
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
