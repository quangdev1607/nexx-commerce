"use client";

import { LoginSchema } from "@/formSchema";
import { cn } from "@/lib/utils";
import { emailLogin } from "@/server/actions/email-login";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { PasswordInput } from "../ui/password-input";
import { AuthCard } from "./auth-card";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
export const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "This email is already used with different provider"
      : "";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  const { execute, status } = useAction(emailLogin, {
    onSuccess(result) {
      if (result.data?.error) setError(result.data.error);
      if (result.data?.success) setSuccess(result.data.success);
      if (result.data?.twoFactor) setShowTwoFactor(true);
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Welcome back!"
      backButtonHref="/auth/register"
      backButtonLabel="Create a new account"
      showSocials={showTwoFactor ? false : true}
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center justify-center gap-2">
                    <FormLabel>
                      Please check your email to get the two factor code
                    </FormLabel>
                    <FormControl>
                      <InputOTP
                        disabled={status === "executing"}
                        {...field}
                        maxLength={6}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormSuccess message={success} />
            <FormError message={error || urlError} />

            {status === "executing" ? (
              <Button className="w-full" disabled type="submit" size={"lg"}>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <>
                {success ? (
                  <Button disabled className="mt-2 w-full bg-primary text-base">
                    {showTwoFactor ? <span>Verify</span> : <span>Login</span>}
                  </Button>
                ) : (
                  <Button type="submit" className="mt-2 w-full text-base">
                    {showTwoFactor ? "Verify" : "Login"}
                  </Button>
                )}
              </>
            )}
            {!showTwoFactor && (
              <Link
                className="text-center text-sm font-normal hover:underline"
                href={"/auth/reset"}
              >
                Forgot password
              </Link>
            )}
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
