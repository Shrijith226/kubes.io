"use client";
import Link from "next/link";
import { menuItems } from "@/lib/constants";
import { usePathname } from "next/navigation";

export default function Index() {
  const pathname = usePathname();

  return (
    <nav className="sm:fixed md:hidden bottom-0 left-0 h-12 w-screen py-1 px-4 z-[99] flex justify-between items-center bg-red-400">
      {menuItems.map((mobileMenu, mobileMenusKey) => {
        const isActive = pathname === mobileMenu.href;

        return (
          <Link
            key={mobileMenusKey}
            href={mobileMenu.href}
            title={mobileMenu.menu}
            className={`${isActive ? "bg-white rounded-full" : "bg-transparent"} h-full flex justify-center items-center w-full`}
          >
            <mobileMenu.icon
              className={`${isActive ? "text-main" : "text-white"} text-2xl`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
