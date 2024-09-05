"use client";

import { UploadButton } from "@/app/api/uploadthing/upload";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Switch } from "@/components/ui/switch";
import { SettingsSchema } from "@/formSchema";
import { settingsAction } from "@/server/actions/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { Session } from "next-auth";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type SettingsFormProps = {
  session: Session;
};

export const SettingsCard = (session: SettingsFormProps) => {
  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: session.session.user?.name || undefined,
      email: session.session.user?.email || undefined,
      image: session.session.user?.image || undefined,
      isTwoFactorEnabled: session.session.user.isTwoFactorEnabled || undefined,
    },
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const { execute, status } = useAction(settingsAction, {
    onSuccess: (result) => {
      if (result.data?.success) setSuccess(result.data.success);
      if (result.data?.error) setError(result.data.error);
    },
    onError: (error) => {
      setError("Something went wrong");
    },
  });

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
    setSuccess("");
    setError("");
    console.log(values);
    execute(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your settings</CardTitle>
        <CardDescription>Update your account settings</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={status === "executing"}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This name will be viewed by other people
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="image"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <div className="flex items-center gap-4">
                    {!form.getValues("image") && (
                      <div className="font-bold">
                        {session.session.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {form.getValues("image") && (
                      <Image
                        src={form.getValues("image")!}
                        width={42}
                        height={42}
                        className="rounded-full"
                        alt="user image"
                      />
                    )}
                    <UploadButton
                      className="ut:button:transition-all scale-75 ut-button:bg-primary ut-button:ring-primary ut-button:duration-500 hover:ut-button:bg-primary/100 ut-allowed-content:hidden ut-label:hidden ut-label:bg-red-50"
                      endpoint="avatarUploader"
                      onUploadBegin={() => {
                        setAvatarUploading(true);
                      }}
                      onUploadError={(error) => {
                        form.setError("image", {
                          type: "validate",
                          message: error.message,
                        });
                        setAvatarUploading(false);
                        return;
                      }}
                      onClientUploadComplete={(res) => {
                        form.setValue("image", res[0].url!);
                        setAvatarUploading(false);
                        return;
                      }}
                      content={{
                        button({ isUploading }) {
                          if (isUploading) {
                            return (
                              <span className="font-medium text-primary-foreground">
                                Uploading...
                              </span>
                            );
                          }

                          return (
                            <span className="font-medium text-primary-foreground">
                              Change Avatar
                            </span>
                          );
                        },
                      }}
                    />
                  </div>
                  <FormControl>
                    <Input
                      disabled={status === "executing"}
                      type="hidden"
                      placeholder="User image"
                      {...field}
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
                      disabled={
                        status === "executing" || session?.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="newPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      disabled={
                        status === "executing" || session?.session.user.isOAuth
                      }
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="isTwoFactorEnabled"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two factor authentication for your account
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={
                        status === "executing" ||
                        session.session.user.isOAuth === true
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSuccess message={success} />
            <FormError message={error} />
            {status === "executing" || avatarUploading ? (
              <Button
                className="w-full max-w-[200px]"
                disabled
                type="submit"
                size={"lg"}
              >
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </Button>
            ) : (
              <>
                <Button
                  type="submit"
                  className="mt-2 w-full max-w-[200px] text-base"
                >
                  Update your settings
                </Button>
              </>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
