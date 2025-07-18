"use client";

import Loader from "@/components/common/Loader";
import { useEffect } from "react";

import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  
      router.push("/auth");
    }, 3000);
  }, [router]);
  return (
    <div className="w-full p-4 md:p-6 2xl:p-10">
      <Loader />
    </div>
  );
};

export default Logout;
