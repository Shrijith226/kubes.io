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
import Data from "@/components/datatable/viewcompanytable";

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
              <div className="flex place-content-end">
                <label className="border-2 rounded-xl border-gray-300">

                  <input className=" rounded-xl border-gray-300 focus:outline-none ml-2" type="search" />
                </label>
              </div>
            </div>


            {/* Tables & Data */}
            <div className="bg-white overflow-x-auto w-full mt-10 p-4">

              <div className='flex flex-col md:flex-row  md:gap-20 ml-2 mr-2 mt-6'>
                <div className='md:w-1/2'>
                  <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-7'>
                    <h1 className='text-black text-lg'>Company Name</h1>
                    <label className='border-2 border-black p-1 h-6 w-full md:w-48 text-black text-sm flex items-center'>Company Name</label>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-7'>
                    <h1 className='text-black text-lg'>Discount</h1>
                    <label className='border-2 border-black p-1 h-6 w-full md:w-48 text-black text-sm flex items-center'>Discount</label>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-7'>
                    <h1 className='text-black text-lg'>Created Date</h1>
                    <label className='border-2 border-black p-1 h-6 w-full md:w-48 text-black text-sm flex items-center'>Created Date</label>
                  </div>
                </div>
                <div className='md:w-1/2'>
                  <div className='flex flex-col md:flex-row justify-between  pb-3 md:gap-8'>
                    <h1 className='text-black text-lg'>Short Name</h1>
                    <label className='border-2 border-black p-1 h-6 w-full md:w-48 text-black text-sm flex items-center'>Short Name</label>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between  pb-3 md:gap-8'>
                    <h1 className='text-black text-lg'>Daily Code</h1>
                    <label className='border-2 border-black p-1 h-6 w-full md:w-48 text-black text-sm flex items-center'>Daily code</label>
                  </div>
                  <div className='flex flex-col md:flex-row justify-between pb-3 md:gap-8'>
                    <h1 className='text-black text-lg'>Is Active</h1>
                    <label className='border-2 border-black p-1 h-6 w-full md:w-48 text-black text-sm flex items-center'>Is Active</label>
                  </div>
                </div>
              </div>
              {/* Data Table */}
              <div className="mt-8 sm:mb-12 md:mb-0">
                <Data />
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
