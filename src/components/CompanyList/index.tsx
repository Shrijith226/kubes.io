import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input, Select } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";

const formSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  shortName: z.string().min(4, "Short name must be at least 4 characters long"),
  discountPercentage: z.string().min(1, "Discount percentage is required"),
});

interface AddCompanyProps {
  setToggleAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddCompany({ setToggleAdd }: AddCompanyProps) {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<string>("");
  const [existingCompanyName, setExistingCompanyName] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const checkExistingCompanyName = async () => {
      const companyName = form.getValues("companyName");

      if (companyName) {
        const q = query(
          collection(db, "companies"),
          where("companyName", "==", companyName)
        );
        const querySnapshot = await getDocs(q);
        setExistingCompanyName(!querySnapshot.empty);
      }
    };

    checkExistingCompanyName();
  }, [form.getValues("companyName")]);

  // Disable submit button if any field is empty or if company name already exists
  const isSubmitDisabled =
    !form.formState.isValid || existingCompanyName;

  // Create a company
  const createCompany = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    const data = form.getValues();

    // Check if company name already exists
    if (existingCompanyName) {
      setError("Company name already exists");
      setIsLoading(false);
      return;
    }

    try {
      // Increment CompanyCounter and use it as companyID
      const counterRef = doc(db, "counters", "CompanyCounter");
      const counterDoc = await getDoc(counterRef);
      const currentCounterValue = counterDoc.exists()
        ? counterDoc.data()?.value
        : 0;
      const updatedCounterValue = currentCounterValue + 1;
      const updatedCounter = { value: updatedCounterValue };
      const companyID = `COMPANY${String(updatedCounterValue).padStart(4, "0")}`;

      // Generate dailyCode
      const randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
      const shortNamePrefix = data.shortName.substring(0, 4);
      const dailyCode = `${shortNamePrefix}${randomSixDigitNumber}`;

      const companyData = {
        ...data,
        companyID,
        dailyCode,
        createDate: new Date().toISOString(),
        isActive: true,
      };

      await addDoc(collection(db, "companies"), companyData);

      setError("");
      setIsLoading(false);
      setIsSuccess("Company added successfully");
      window.location.reload();

      // Update CompanyCounter
      await setDoc(counterRef, updatedCounter);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = error.code;
        if (errorCode === "permission-denied") {
          setError("You do not have permission to perform this operation");
        } else if (errorCode === "unavailable") {
          setError("The service is currently unavailable, try again later");
        } else {
          setError("Something went wrong");
        }
        console.error("Error adding document: ", error.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => setToggleAdd(false)}
      className="fixed top-0 left-0 h-screen bg-white bg-opacity-5 backdrop-blur w-full flex justify-center items-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ ease: "easeInOut", delay: 0.3 }}
        className="bg-white border-4 border-main shadow-sm h-fit w-[90vw] md:w-[30vw] px-8 md:px-12 py-8 rounded-xl relative overflow-hidden"
      >
        <h1 className="text-center text-main uppercase text-xl font-bold mb-4">
          Add a Company
        </h1>

        <Form {...form}>
          <form className="text-xs relative">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Company Name"
                      className={existingCompanyName ? "border-red-600" : ""}
                    />
                  </FormControl>
                  {existingCompanyName && (
                    <FormMessage className="text-red-600">
                      Company name already exists
                    </FormMessage>
                  )}
                  {form.formState.errors.companyName && (
                    <FormMessage className="text-red-600">
                      {form.formState.errors.companyName.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

<FormField
              control={form.control}
              name="shortName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      placeholder="Short Name"
                    />
                  </FormControl>
                  {form.formState.errors.shortName && (
                    <FormMessage className="text-red-600">
                      Short name must be at least 4 characters long
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="">Select Discount Percentage</option>
                      {Array.from({ length: 41 }, (_, i) => (
                        <option key={`option-${i}`} value={`${i}%`}>
                          {`${i}%`}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  {form.formState.errors.discountPercentage && (
<FormMessage className="text-red-600">
{form.formState.errors.discountPercentage.message}
</FormMessage>
)}
</FormItem>
)}
/>
<div className="flex justify-start items-center gap-4">
          <Button
            onClick={createCompany}
            type="submit"
            className={`bg-black text-white border border-black w-fit h-10 rounded-2xl hover:bg-white hover:text-black transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2 ${
              isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitDisabled}
          >
            <IoAddCircleOutline className="text-xl" />
            {isLoading ? "Loading..." : "Submit"}
          </Button>

          <Button
            type="button"
            onClick={() => setToggleAdd(false)}
            className="bg-red-600 text-white border border-red-600 w-fit h-10 rounded-2xl hover:bg-white hover:text-red-600 transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2"
          >
            <FaTimes />
            Cancel
          </Button>
        </div>

        {error && <div className="text-red-600 mt-4">*{error}</div>}
        {isSuccess && <div className="text-main mt-4">{isSuccess}</div>}
      </form>
    </Form>
  </motion.div>
</div>
  )
};