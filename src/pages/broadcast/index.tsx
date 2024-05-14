import BirthdayTable from "@/components/Tables/broadcastBirthday";
import SpecialTable from "@/components/Tables/broadcastSpecial";
import { Input } from "@/components/ui/input";
import Head from "next/head";
import { usePathname } from "next/navigation";
import { CiSearch } from "react-icons/ci";

export default function Broadcast() {
  const pathname = usePathname();

  return (
    <>
      <Head>
        <title>KUBE | Broadcast</title>
      </Head>

      <section className=" bg-[#FAFBFF] h-screen w-full overflow-y-scroll">
        <div className="text-black rounded-3xl p-4">
          {/* TopBar */}
          <div className="h-10 flex items-center justify-between sm:px-4 md:pt-2 ">
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
                  className="absolute top-2.5 sm:top-2.5 md:top-3 right-2 text-xl"
                >
                  <CiSearch className="sm:text-sm md:text-base" />
                </label>
              </div>
            </div>
          </div>

          {/* Tables & Data */}
          <BirthdayTable />
          <SpecialTable />
        </div>
      </section>
    </>
  );
}
