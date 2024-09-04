"use client";
import { Input } from "@/components/ui/input";
import * as React from "react";

import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
        />
        <span className="absolute right-1 top-[7px] cursor-pointer select-none">
          {showPassword ? (
            <EyeIcon onClick={() => setShowPassword(false)} />
          ) : (
            <EyeOffIcon onClick={() => setShowPassword(true)} />
          )}
        </span>
      </div>
    );
  },
);
PasswordInput.displayName = "Input";

export { PasswordInput };
