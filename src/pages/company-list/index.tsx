"use client";
import Link from "next/link";
import { useState, useEffect} from "react";
import { AnimatePresence } from "framer-motion";
import AddCompany from "@/components/CompanyList/index";
import { useAuth } from "@/providers/AuthContextProvider";
import { IoIosAddCircle } from "react-icons/io";
import { GoPeople } from "react-icons/go";
import { IoArrowUpSharp, IoArrowDownSharp } from "react-icons/io5";
import DataTable from "@/components/Tables/company";
import { GoVerified } from "react-icons/go";
import { PiDesktopLight } from "react-icons/pi";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; 
import { PiBuildingsThin } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

//   Icons
import { CiSearch } from "react-icons/ci";
// New CompanyCount component
const CompanyCount = ({ count }: { count: number }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="sm:text-xs md:text-lg whitespace-nowrap">
        {count}
      </div>
    </div>
  );
};

// Import your Firebase configuration

export default function Company() {
  const user = useAuth();
  const [toggleAdd, setToggleAdd] = useState<boolean>(false);
  const [companyCount, setCompanyCount] = useState<number>(0);

  async function fetchCompanyCountFromBackend(): Promise<number> {
    try {
      // Query the Firestore collection 'companies'
      const querySnapshot = await getDocs(collection(db, 'companies'));
      // Get the number of documents in the collection
      const count = querySnapshot.size;
      return count;
    } catch (error) {
      console.error('Error fetching company count:', error);
      throw error;
    }
  }

  useEffect(() => {
    const fetchCompanyCount = async () => {
      try {
        const companyCountData = await fetchCompanyCountFromBackend();
        setCompanyCount(companyCountData);
      } catch (error) {
        console.error('Error fetching company count:', error);
      }
    };

    fetchCompanyCount();
  }, []);
  const pathname = usePathname();
  return (
    <section className="md:px-16 py-2 bg-[#FAFBFF] h-screen overflow-y-scroll">
      {user ? (
        <div className="text-black rounded-3xl p-4">
          {/* Analytics */}
          <section className="h-10 flex items-center justify-between sm:px-4 md:px-16 md:pt-2 ">
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
    </section>
          
         
   <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4 ">
<div className="space-x-2 bg-white rounded-md">
  <div className="flex justify-center p-2">
  <PiBuildingsThin className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
  </div>
  <div>
  <h1 className="text-center">Total companies</h1>
  <CompanyCount count={companyCount} />
  </div>
</div>
<div className="space-x-2 bg-white rounded-md">
  <div className="flex justify-center p-2">
  <GoVerified className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
  </div>
  <div>
  <h1 className="text-center">Total Customers</h1>
  <h1>count</h1>
  </div>
</div>
<div className="space-x-2 bg-white rounded-md">
  <div className="flex justify-center p-2">
  <PiDesktopLight className="text-main md:text-4xl w-10 h-10 sm:text-2xl" />
  </div>
  <div>
  <h1 className="text-center">Active companies</h1>

  <h1>counts</h1>
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

          {/* Company Count Label */}
         


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
  );
}
