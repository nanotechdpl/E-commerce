"use client";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { CAUVNavItem, CNavItem } from "@/constants/navItems";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

import { useDispatch } from "react-redux";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isUserRoute =
    pathname.includes("c/allUsers") &&
    (pathname.includes("/profile") ||
      pathname.includes("/orders") ||
      pathname.includes("/settings") ||
      pathname.includes("/payments"));



  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeSidebarItems={isUserRoute ? CAUVNavItem : CNavItem}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#CCCCFF]">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="bg-[#CCCCFF]">{children}</main>
      </div>
    </div>
  );
}
