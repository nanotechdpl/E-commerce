"use client";
import React from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-[#CCCCFF]">
          <main className="bg-[#CCCCFF]">{children}</main>
        </div>
      </div>
    </>
  );
}
