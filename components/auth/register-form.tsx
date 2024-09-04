"use client";

import { RegisterSchema } from "@/formSchema";
import { cn } from "@/lib/utils";
import { emailRegister } from "@/server/actions/email-register";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
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
import { PasswordInput } from "../ui/password-input";
import { AuthCard } from "./auth-card";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
export const RegisterForm = () => {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(emailRegister, {
    onSuccess(result) {
      if (result.data?.error) setError(result.data.error);
      if (result.data?.success) setSuccess(result.data.success);
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    execute(values);
  };
  return (
    <AuthCard
      showSocials
      cardTitle="Create your new account 🥳"
      backButtonHref="/auth/login"
      backButtonLabel="Already have an account?"
    >
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
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
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="passwordConfirm"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />

            {status === "executing" ? (
              <Button className="w-full" disabled type="submit" size={"lg"}>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <>
                {success ? (
                  <Button disabled className="mt-2 w-full bg-primary text-base">
                    <span>Register</span>
                  </Button>
                ) : (
                  <Button type="submit" className="mt-2 w-full text-base">
                    Register
                  </Button>
                )}
              </>
            )}
          </form>
        </Form>
      </div>
    </AuthCard>
  );
};
