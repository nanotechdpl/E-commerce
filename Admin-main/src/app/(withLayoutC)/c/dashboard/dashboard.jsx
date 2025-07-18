"use client";
import Hero from "@/components/Dashboard/Hero";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/signin"); // Redirect to login page if no token
    }
  }, [router]);

  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      <Hero />
    </div>
  );
}
