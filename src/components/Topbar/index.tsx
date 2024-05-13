"use client";
import { Input } from "../ui/input";
import { usePathname } from "next/navigation";

//   Icons
import { CiSearch } from "react-icons/ci";

export default function Index() {
  const pathname = usePathname();

  return (
    <section className="h-10 flex items-center justify-between sm:px-4 md:px-16 md:pt-8">
      {pathname && (
        <div className="capitalize font-bold tracking-wide sm:text-sm md:text-base">
          {pathname.replace("/", " ")}
        </div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <div>
          <Input
            id="searchBar"
            placeholder="search..."
            className="bg-white sm:w-32 md:w-96 p-4 border rounded-xl sm:h-7 md:h-10"
          />
          <label
            htmlFor="searchBar"
            className="absolute sm:top-2.5 md:top-3 right-2 text-xl"
          >
            <CiSearch className="sm:text-sm md:text-base" />
          </label>
        </div>
      </div>
    </section>
  );
}
