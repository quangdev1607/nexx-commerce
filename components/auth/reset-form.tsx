"use client";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { AuthCard } from "./auth-card";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

import { ResetSchema } from "@/formSchema";
import { reset } from "@/server/actions/reset";
import { Loader2Icon } from "lucide-react";

export function ResetForm() {
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { execute, status } = useAction(reset, {
    onSuccess(result) {
      if (result.data?.success) setSuccess(result.data.success);
      if (result.data?.error) setError(result.data.error);
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    execute(values);
  };

  return (
    <AuthCard
      cardTitle="Forgot your password? "
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
      showSocials
    >
      <div>
        <Form {...form}>
          <form
            className="flex flex-col gap-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        disabled={status === "executing"}
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription />
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
                    <Button
                      disabled
                      className="mt-2 w-full bg-primary text-base"
                    >
                      <span>Reset password</span>
                    </Button>
                  ) : (
                    <Button type="submit" className="mt-2 w-full text-base">
                      Reset password
                    </Button>
                  )}
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </AuthCard>
  );
}
