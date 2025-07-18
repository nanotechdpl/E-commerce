"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  children,
  to,
  className,
  active,
}: {
  children: React.ReactNode;
  to: string;
  className?: string;
  active?: string;
}) {
  const pathname = usePathname();
  console.log(pathname.includes(to));

  return (
    <Link
      href={to}
      className={`${className} ${pathname.includes(to) ? active : ""}`}
    >
      {children}
    </Link>
  );
}
