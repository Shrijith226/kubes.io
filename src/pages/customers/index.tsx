"use client";
import { useEffect, useState } from "react";
import DataTable from "@/components/Tables/Customers";
import { AnimatePresence } from "framer-motion";
import AddCustomer from "@/components/AddCustomers";
import { useCustomers } from "@/providers/CountProvider";
import { useAuth } from "@/providers/AuthContextProvider";

// Icons
import { CiSearch } from "react-icons/ci";
import { GoVerified } from "react-icons/go";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { IoIosAddCircle } from "react-icons/io";
import { PiDesktopLight } from "react-icons/pi";
import { MdOutlinePeopleAlt } from "react-icons/md";
import Head from "next/head";

export default function Customer() {
  const user = useAuth();
  const pathname = usePathname();
  const { customerCount, companyCount } = useCustomers();
  const [isLoading, setIsLoading] = useState(true);
  const [toggleAdd, setToggleAdd] = useState<boolean>(false);

  useEffect(() => {
    window.onload = () => {
      setIsLoading(false);
    };
  }, []);
  return (
    <>
      <Head>
        <title>KUBE | Customers</title>
      </Head>

      <section className=" bg-[#FAFBFF] h-screen w-full overflow-y-scroll">
        {user && user.userDetails?.role === "Admin" ? (
          <div className="text-black rounded-3xl p-4">
            <div className="h-10 sm:px-4 md:pt-2 ">
              {pathname && (
                <div className="capitalize font-bold tracking-wide sm:text-sm md:text-base">
                  {pathname.replace("/", " ")}
                </div>
              )}
            </div>

            {/* Analytics & Count */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 ">
              <div className="space-x-2 bg-white rounded-md">
                <div className="flex justify-center p-2">
                  <MdOutlinePeopleAlt className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-center">Total customers</h1>
                  <p className="text-center text-lg font-medium">
                    {customerCount}
                  </p>
                </div>
              </div>
              <div className="space-x-2 bg-white rounded-md">
                <div className="flex justify-center p-2">
                  <GoVerified className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-center"></h1>
                  <h1>count</h1>
                </div>
              </div>
              <div className="space-x-2 bg-white rounded-md">
                <div className="flex justify-center p-2">
                  <PiDesktopLight className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-center">Active companies</h1>

                  <p className="text-center text-lg font-medium">
                    {companyCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Tables & Data */}
            <div className="bg-white overflow-x-auto w-full mt-10 p-4">
              <div className="flex justify-end items-center">
                <div
                  onClick={() => setToggleAdd(true)}
                  className="flex justify-center items-center gap-2 bg-white text-main text-lg font-bold px-4 py-2 rounded-full cursor-pointer"
                >
                  <h1 className="sm:text-xs md:text-base whitespace-nowrap">
                    Add customer
                  </h1>
                  <IoIosAddCircle className="text-2xl" />
                </div>
              </div>

              {/* Data Table */}
              <div className="mt-8 sm:mb-12 md:mb-0">
                <DataTable />
              </div>
            </div>

            <AnimatePresence>
              {toggleAdd && <AddCustomer setToggleAdd={setToggleAdd} />}
            </AnimatePresence>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center gap-4 h-[90vh]">
            <h1>Loading...</h1>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4 h-[90vh]">
            <h1>Access Denied</h1>
          </div>
        )}
      </section>
    </>
  );
}
