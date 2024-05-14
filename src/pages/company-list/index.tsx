"use client";
import { useState } from "react";
import { GoVerified } from "react-icons/go";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { IoIosAddCircle } from "react-icons/io";
import DataTable from "@/components/Tables/company";
import AddCompany from "@/components/CompanyList/index";
import { useCustomers } from "@/providers/CountProvider";
import { useAuth } from "@/providers/AuthContextProvider";

// Icons
import { CiSearch } from "react-icons/ci";
import { PiBuildingsThin, PiDesktopLight } from "react-icons/pi";
import Head from "next/head";

export default function Company() {
  const user = useAuth();
  const { companyCount, customerCount, activeCompanyCount } = useCustomers();
  const [toggleAdd, setToggleAdd] = useState<boolean>(false);

  const pathname = usePathname();
  return (
    <>
      <Head>
        <title>KUBE | Company List</title>
      </Head>

      <section className="md:px-16 py-2 bg-[#FAFBFF] h-screen overflow-y-scroll">
        {user ? (
          <div className="text-black rounded-3xl p-4">
            <section className="h-10 sm:px-4 md:px-16 md:pt-2 ">
              {pathname && (
                <div className="capitalize font-bold tracking-wide sm:text-sm md:text-base">
                  {pathname.replace("/", " ")}
                </div>
              )}
            </section>

            {/* Analytics & Counts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 ">
              <div className="space-x-2 bg-white rounded-md">
                <div className="flex justify-center p-2">
                  <PiBuildingsThin className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-center">Total companies</h1>
                  <p className="text-center text-lg font-medium">
                    {companyCount}
                  </p>
                </div>
              </div>
              <div className="space-x-2 bg-white rounded-md">
                <div className="flex justify-center p-2">
                  <GoVerified className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-center">Total Customers</h1>
                  <p className="text-center text-lg font-medium">
                    {customerCount}
                  </p>
                </div>
              </div>
              <div className="space-x-2 bg-white rounded-md">
                <div className="flex justify-center p-2">
                  <PiDesktopLight className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
                </div>
                <div>
                  <h1 className="text-center">Active companies</h1>
                  <p className="text-center text-lg font-medium">
                    {activeCompanyCount}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Company Button */}
            <div className="flex justify-end items-center mt-6">
              <div
                onClick={() => setToggleAdd(true)}
                className="flex justify-end items-center gap-2 bg-white text-main text-lg font-bold px-4 py-2 rounded-full cursor-pointer"
              >
                <h1 className="sm:text-xs md:text-base whitespace-nowrap">
                  Add Company
                </h1>
                <IoIosAddCircle className="text-2xl" />
              </div>
            </div>

            {/* Tables & Data */}
            <div className="bg-white p-0 sm:p-4 md:p-8 mt-8 rounded-3xl">
              {/* Data Table */}
              <div className="mt-8 sm:mb-12 md:mb-0">
                <DataTable />
              </div>
            </div>

            {/* Add Company Modal */}
            <AnimatePresence>
              {toggleAdd && <AddCompany setToggleAdd={setToggleAdd} />}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-4 h-screen">
            <h1>Loading...</h1>
          </div>
        )}
      </section>
    </>
  );
}
