"use client";
import DataTable from "@/components/Tables";
import React from "react";

const Page = () => {
  return (
    <div className="mx-5 mt-10">
      <div className="bg-white p-5 shadow-md rounded-xl">
        <div className="flex justify-between mx-20">
          <div className="flex items-center">
            <label className="font-bold text-lg">Company Name :</label>
            <label className="ml-2">Kube</label>
          </div>
          <div className="flex items-center">
            <label className="font-bold text-lg">Short Name :</label>
            <label className="ml-2">Kube</label>
          </div>
        </div>
        <div className="flex justify-between mx-20 mt-6">
          <div className="flex items-center">
            <label className="font-bold text-lg">Discount :</label>
            <label className="ml-2">20%</label>
          </div>
          <div className="flex items-center">
            <label className="font-bold text-lg">Daily Code :</label>
            <label className="ml-2">0785</label>
          </div>
        </div>
        <div className="flex justify-between mx-20 mt-6">
          <div className="flex items-center">
            <label className="font-bold text-lg">Created Date :</label>
            <label className="ml-2">01.05.2024</label>
          </div>
          <div className="flex items-center">
            <label className="font-bold text-lg">Is Active :</label>
            <label className="ml-2">True</label>
          </div>
        </div>
      </div>
      <div className="mt-24 mb-5">
        <DataTable />
      </div>
    </div>
  );
};

export default Page;
