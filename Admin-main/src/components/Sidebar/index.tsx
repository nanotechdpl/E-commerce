"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navItem } from "@/types/navItem";
import { Menu } from "lucide-react";


interface SidebarProps {
  activeSidebarItems: navItem[];
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({
  activeSidebarItems,
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [storedSidebarExpanded] = useState(true);
  const pathname = usePathname();
  const isCTabActive = pathname.includes("/c/");
  const isUserRoute =
    pathname.includes("/c/allUsers") &&
    (pathname.includes("/profile") ||
      pathname.includes("/orders") ||
      pathname.includes("/settings") ||
      pathname.includes("/payments"));

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const [sidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : true
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  const getRouteForUser = (url: string) => {
    const parts = pathname.split("/");

    // Filter out empty strings (caused by leading slash)
    const nonEmptyParts = parts.filter((part: string) => part !== "");

    nonEmptyParts.forEach((part: any, index: number) => {
      console.log(`Part ${index + 1}: ${part}`);
    });
    return `/c/allUsers/${nonEmptyParts[2]}${url}`;
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-40 flex h-screen w-55 flex-col overflow-y-hidden bg-[#fff] duration-300 ease-linear  lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-2 py-2 lg:justify-center">
        <div>
          <Link href="/c/dashboard">
            <Image
              width={isCTabActive ? 80 : 60}
              height={isCTabActive ? 48 : 32}
              src={"/images/logo/admin.png"}
              alt="Logo"
              priority
            />
          </Link>
        </div>
        <div className="ml-20 lg:hidden">
          <Menu
            onClick={() => setSidebarOpen(!sidebarOpen)}
            size={isCTabActive ? 32 : 24}
          />
        </div>
      </div>

      <div className="flex lg:justify-center lg:ml-2 ml-5">
        <p>{user?.username || "Dr Jasen"}</p>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar mt-3 flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="px-4">
          {/* <!-- Menu Group --> */}
          <div>
            {/* <h3 className="text-sm font-semibold text-bodydark2">
              MENU
            </h3> */}

            <ul className="mb-0 flex flex-col text-black">
              {activeSidebarItems.map((item) => {
                return (
                  <Link
                    key={item.id}
                    href={isUserRoute ? getRouteForUser(item.url) : item.url}
                    // className={`hover:bg-slatedark group relative flex items-center gap-0 rounded-sm py-1 font-medium text-black duration-300 ease-in-out  ${pathname == item.url && "bg-[#ffb200] text-white rounded-lg"
                    //   }`}
                    className={`hover:bg-slatedark group relative flex items-center gap-0 rounded-[10px] py-3 text-base duration-300 ease-in-out ${pathname == item.url ||
                        pathname === getRouteForUser(item.url)
                        ? "bg-[#ffb200] text-black py-2 px-3  font-bold"
                        : " font-normal "
                      }`}
                  >
                    <div
                      className={`flex items-center justify-center gap-2 p-1 `}
                    // className={`flex items-center justify-center gap-2 p-1 ${
                    //   item.title.toLowerCase() === "logout" && "transform rotate-180"
                    // }`}
                    >
                      {item.icon && <div className="flex items-center justify-center w-6 h-6 flex-shrink-0 ">
                        {item.icon}
                      </div>}
                      {item.title}
                    </div>
                  </Link>
                );
              })}
            </ul>
          </div>

          {/* <!-- Others Group --> */}
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
