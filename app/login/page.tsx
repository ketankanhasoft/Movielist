"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// component for Login
export default function Login() {
  let router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/movies");
    }
  }, []);

  // return component
  return (
    <div className="flex justify-center items-center h-screen bg-gray-800 text-white">
      <div className="text-center">
        <p className="text-3xl font-bold mb-8">Welcome!</p>
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
          onClick={() => signIn("github")}
        >
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
