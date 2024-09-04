"use client";
import { newVerification } from "@/server/actions/tokens";
import { Loader2Icon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AuthCard } from "./auth-card";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";

export const EmailVerificationForm = () => {
  const token = useSearchParams().get("token");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleVerification = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Token not found");
      return;
    }

    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
      }
    });
  }, []);

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    <AuthCard
      cardTitle="Verify your account!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="flex w-full flex-col items-center justify-center">
        <p>
          {!success && !error ? (
            <>
              <span>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Verifying email...
              </span>
            </>
          ) : null}
          <FormSuccess message={success} />
          <FormError message={error} />
        </p>
      </div>
    </AuthCard>
  );
};
