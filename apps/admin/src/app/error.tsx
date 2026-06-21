"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an external service or console
    console.error("Global Error Boundary caught an error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-8 bg-white shadow-xl rounded-2xl max-w-lg text-center border border-gray-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6 font-mono text-sm break-words bg-gray-50 p-4 rounded-lg">
          {error.message || "An unknown error occurred."}
        </p>
        <button
          onClick={() => reset()}
          className="bg-wine hover:bg-wine/90 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
