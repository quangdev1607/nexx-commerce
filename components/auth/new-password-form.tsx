"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { AuthCard } from "./auth-card";

import Link from "next/link";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { NewPasswordSchema } from "@/formSchema";
import { newPassword } from "@/server/actions/new-password";
import { Loader2Icon } from "lucide-react";
import { PasswordInput } from "../ui/password-input";

export const NewPasswordForm = () => {
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(newPassword, {
    onSuccess(result) {
      // if (result.data?.error) setError(data.error)
      if (result.data?.success) {
        setSuccess(result.data.success);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    execute({ password: values.password, token });
  };

  return (
    <AuthCard
      cardTitle="Enter a new password"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        {...field}
                        disabled={status === "executing"}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormSuccess message={success} />
              <FormError message={error} />
            </div>
            {status === "executing" ? (
              <Button className="w-full" disabled type="submit" size={"lg"}>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <>
                {success ? (
                  <Button disabled className="mt-2 w-full bg-primary text-base">
                    <span>Confirm</span>
                  </Button>
                ) : (
                  <Button type="submit" className="mt-2 w-full text-base">
                    Confirm
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
