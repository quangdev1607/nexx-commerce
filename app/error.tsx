"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { disgest?: string }; reset: () => void }) {
    useEffect(() => {
        console.log(error);
    }, [error]);

    return (
        <div className="min-h-56 w-full flex items-center flex-col justify-center gap-2">
            <h1>{error.message}</h1>
            <button className="p-2 border border-white/50" onClick={() => reset()}>
                Try again
            </button>
        </div>
    );
}
