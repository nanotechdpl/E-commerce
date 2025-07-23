"use client";
import { FC } from "react";

import { CNavItem } from "@/constants/navItems";
import Image from "next/image";
import Link from "next/link";
import LogoC from "../../../../public/images/logo/admin.png";
import { useSidebarContext } from "@/types/providers/SidebarProvider";

const Sidebar: FC = () => {
  const { openSidebar } = useSidebarContext();

  return (
    <nav className="relative  mr-8 h-full bg-indigo-950  ">
      <div
        className={`sm:none duration-175 linear  fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all  md:!z-50 lg:!z-50 xl:!z-0 
        ${openSidebar ? "translate-x-0" : "-translate-x-96"}`}
      ></div>

      <div className="fixed  h-full  bg-indigo-950">
        <Link href={"/"}>
          <div className="mb-3 flex justify-center w-fit pt-2">
            <Image
              src={LogoC}
              alt="logo"
              width={64}
              height={64}
              className="-ml-1 h-16 w-16 cursor-pointer text-white"
            />
          </div>
        </Link>

        {CNavItem.map((item, index) => {
          return (
            <Link
              key={item.id}
              href={item.url}
              className={`text-gray-900 border-gray-700 m-1  ml-4 flex  cursor-pointer  flex-col items-start rounded-full hover:bg-indigo-800`}
            >
              <div className={`flex items-center justify-center p-1 `}>
                <p className="ml-2 h-4 w-4 text-white" />
                <span className={`p-2 text-left text-sm text-white `}>
                  {item.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Sidebar;
