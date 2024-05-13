"use client";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/company-list");
  }, [router]);

  return (
    <div className="h-screen flex justify-center items-center">
      please wait... This page will redirect to customer page.
    </div>
  );
}