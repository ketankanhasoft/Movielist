"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  let router = useRouter();

  useEffect(() => {
    router.push("/movies");
  }, []);

  return <div>You will be redirect to movies page shortly.</div>;
}
