"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { disgest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex min-h-56 w-full flex-col items-center justify-center gap-2 bg-background">
      <h1>{error.message}</h1>
      <button className="border border-white/50 p-2" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
