import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  CommandItem,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "../ui/command";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

// Icons
import { FaTimes } from "react-icons/fa";
import { IoAddCircleOutline } from "react-icons/io5";

// Firebase
import { db } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";

const formSchema = z.object({
  dob: z.string(),
  lastName: z.string(),
  location: z.string(),
  firstName: z.string(),
  companyName: z.string(),
  phoneNumber: z.string(),
  specialDiscount: z.string(),
  birthdayDiscount: z.string(),
  emailId: z.string().email({
    message: "Invalid email address.",
  }),
});

interface AddCustomerProps {
  setToggleAdd: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Index({ setToggleAdd }: AddCustomerProps) {
  const [date, setDate] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [isEmailId, setIsEmailId] = useState<string>("");
  const [isFirstName, setIsFirstName] = useState<string>("");
  const [isLastName, setIsLastName] = useState<string>("");
  const [isCompanyName, setIsCompanyName] = useState<string>("");
  const [isPhoneNumber, setIsPhoneNumber] = useState<string>("");
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [isSpecialDiscount, setIsSpecialDiscount] = useState<string>("");
  const [isBirthdayDiscount, setIsBirthdayDiscount] = useState<string>("");

  // Error Handling
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Counters for UniqueID
  async function initializeCounter() {
    const counterRef = doc(db, "counters", "customerCounter");
    const counterSnap = await getDoc(counterRef);

    if (!counterSnap.exists()) {
      await setDoc(counterRef, { count: 0 });
    }
  }

  // Create a new customer
  const createCustomer = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    // Initialize the counter if it doesn't exist
    await initializeCounter();

    const counterRef = doc(db, "counters", "customerCounter");
    let index;
    try {
      await runTransaction(db, async (transaction) => {
        const counterSnap = await transaction.get(counterRef);

        if (!counterSnap.exists()) {
          throw "Counter document does not exist!";
        }

        index = (counterSnap.data().count || 0) + 1;
        transaction.update(counterRef, { count: index });
      });
    } catch (err) {
      console.log("Transaction failed: ", err);
      setIsLoading(false);
      return;
    }

    const uniqueID = "KUBES" + String(index).padStart(4, "0");
    const DOB = `${date}-${month}`;

    const data = {
      dob: DOB,
      emailID: isEmailId,
      firstName: isFirstName,
      lastName: isLastName,
      companyName: isCompanyName,
      phoneNumber: isPhoneNumber,
      uniqueID: uniqueID,
      birthdayDiscount: isBirthdayDiscount,
      specialDiscount: isSpecialDiscount,
      isActive: "True",
      createdDate: serverTimestamp(),
    };

    if (
      !data.dob ||
      !data.emailID ||
      !data.phoneNumber ||
      !data.companyName ||
      !data.firstName ||
      !data.lastName ||
      !data.birthdayDiscount ||
      !data.specialDiscount
    ) {
      setIsLoading(false);
      return;
    }

    // Check if email is in the correct format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.emailID)) {
      setError("Invalid email format");
      setIsLoading(false);
      return;
    }

    // Check if first name is in the correct format
    const firstNameRegex = /^[a-zA-Z\s]{4,}$/;
    if (!firstNameRegex.test(data.firstName)) {
      setError("First name must be at least 4 alphabetic characters");
      setIsLoading(false);
      return;
    }

    // Check if first name is in the correct format
    const lastNameRegex = /^[a-zA-Z\s]{1,}$/;
    if (!lastNameRegex.test(data.lastName)) {
      setError("Last name must be at least 1 alphabetic characters");
      setIsLoading(false);
      return;
    }

    try {
      // To prevent redundant email & phone number
      const emailQuerySnapshot = await getDocs(
        query(collection(db, "customers"), where("emailID", "==", data.emailID))
      );

      const phoneQuerySnapshot = await getDocs(
        query(
          collection(db, "customers"),
          where("phoneNumber", "==", data.phoneNumber)
        )
      );

      if (!emailQuerySnapshot.empty) {
        setIsSuccess("");
        setError("Email already exists");
        return;
      }

      if (!phoneQuerySnapshot.empty) {
        setIsSuccess("");
        setError("Phone number already exists");
        return;
      }

      // Main Function
      const docRef = await addDoc(collection(db, "customers"), data);

      if (docRef) {
        setError("");
        setIsLoading(false);
        setIsSuccess("Customer added successfully");
        window.location.reload();
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        const errorCode = (error as any).code;
        if (errorCode === "permission-denied") {
          setError("You do not have permission to perform this operation");
        } else if (errorCode === "unavailable") {
          setError("The service is currently unavailable, try again later");
        } else {
          setError("Something went wrong");
        }
        console.error("Error adding document: ", error.message);
      }
    } finally {
      setIsSuccess("");
      setIsLoading(false);
    }
  };

  // Fetch company name
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, "companies"));
      setCompanyNames(data.docs.map((doc) => doc.data().companyName));
    };

    fetchData();
  }, []);

  return (
    <div
      onClick={() => setToggleAdd(false)}
      className="fixed top-0 left-0 h-screen bg-transparent w-full flex justify-center items-center"
    >
      <motion.div
        onClick={(e: { stopPropagation: () => any; }) => e.stopPropagation()}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ ease: "easeInOut", delay: 0.3 }}
        className="bg-white border-4 border-main shadow-sm h-fit w-[30vw] px-12 py-8 rounded-xl relative overflow-hidden"
      >
        <h1 className="text-center text-main uppercase text-xl font-bold">
          Add a customer
        </h1>

        {/* Form */}
        <Form {...form}>
          <form className="text-xs relative">
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Company Name <span className=" text-main">*</span>
                  </FormLabel>
                  <br />
                  <FormControl className="mt-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className={`${
                            isCompanyName ? "text-black" : "text-gray-200"
                          } border-b border-gray-200 w-full justify-start`}
                        >
                          {isCompanyName || "Select Company"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white">
                        <Command>
                          <CommandInput />
                          <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup
                              heading="Suggestions"
                              className="h-32 overflow-y-scroll"
                            >
                              {companyNames.map((company, companyIndex) => (
                                <CommandItem
                                  key={companyIndex}
                                  value={company}
                                  onSelect={(value: string) => {
                                    setIsCompanyName(value);
                                    field.onChange(value);
                                  }}
                                >
                                  {company}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-main">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="first name"
                      type="text"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsFirstName(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className=" text-main">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="full name"
                      type="text"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const lastName = e.target.value;
                        if (!/^[a-zA-Z\s]{1,}$/.test(lastName)) {
                          setError(
                            "Full name must be at least 1 alphabetic characters"
                          );
                        } else {
                          setIsLastName(lastName);
                          setError("");
                          field.onChange(e);
                        }
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Id */}
            <FormField
              control={form.control}
              name="emailId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email Id <span className="text-main">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email ID"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setIsEmailId(e.target.value);
                        field.onChange(e);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DOB */}
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DOB</FormLabel>
                  <FormControl>
                    <div className="flex justify-between gap-4 items-center">
                      {/* Date */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={`${
                              date ? "text-black" : "text-gray-200"
                            } border-b border-gray-200 w-full justify-start`}
                          >
                            {date || "Select Date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white">
                          <Command>
                            <CommandInput />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup
                                heading="Date"
                                className="h-32 overflow-y-scroll"
                              >
                                {Array.from(
                                  { length: 31 },
                                  (_, i) => i + 1
                                ).map((day) => (
                                  <CommandItem
                                    key={day}
                                    value={day.toString()}
                                    onSelect={(value: string) => {
                                      setDate(value);
                                      field.onChange(value);
                                    }}
                                  >
                                    {day < 10 ? `0${day}` : day}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {/* Month */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            className={`${
                              month ? "text-black" : "text-gray-200"
                            } border-b border-gray-200 w-full justify-start`}
                          >
                            {month || "Select Month"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 bg-white">
                          <Command>
                            <CommandInput />
                            <CommandList>
                              <CommandEmpty>No results found.</CommandEmpty>
                              <CommandGroup
                                heading="Months"
                                className="h-32 overflow-y-scroll"
                              >
                                {Array.from(
                                  { length: 12 },
                                  (_, i) => i + 1
                                ).map((month) => {
                                  const monthShort = new Date(
                                    0,
                                    month - 1
                                  ).toLocaleString("default", {
                                    month: "short",
                                  });
                                  return (
                                    <CommandItem
                                      key={month}
                                      value={monthShort}
                                      onSelect={(value: string) => {
                                        setMonth(value);
                                        field.onChange(value);
                                      }}
                                    >
                                      {monthShort}
                                    </CommandItem>
                                  );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Phone Number <span className=" text-main">*</span>
                  </FormLabel>

                  <div className="flex justify-start items-center gap-2 mt-2">
                    <p className="border rounded-full p-2">+65</p>
                    <div>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="phone number"
                          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.target.value = e.target.value
                              .replace(/[^0-9]/g, "")
                              .slice(0, 8);
                          }}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const phoneNumber = e.target.value;
                            const isValid = /^\d{8}$/.test(phoneNumber);
                            if (isValid) {
                              setIsPhoneNumber(phoneNumber);
                              field.onChange(e);
                              setIsSuccess(" ");
                            } else {
                              setError("Invalid Phone number");
                            }
                          }}
                          className="w-32"
                        />
                      </FormControl>
                    </div>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birtday Discount */}
            <FormField
              control={form.control}
              name="birthdayDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Birtday Discount <span className=" text-main">*</span>
                  </FormLabel>
                  <br />
                  <FormControl className="mt-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className={`${
                            isBirthdayDiscount ? "text-black" : "text-gray-200"
                          } border-b border-gray-200 w-full justify-start`}
                        >
                          {isBirthdayDiscount || "Select Discount"}%
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white">
                        <Command>
                          <CommandInput />
                          <CommandList>
                            <CommandEmpty>
                              The discount range should be 0 t0 25.
                            </CommandEmpty>
                            <CommandGroup
                              heading="Suggestions"
                              className="h-32 overflow-y-scroll"
                            >
                              {Array.from(Array(26).keys()).map((value) => (
                                <CommandItem
                                  key={value}
                                  value={value.toString()}
                                  onSelect={(value: string) => {
                                    setIsBirthdayDiscount(value);
                                    field.onChange(value);
                                  }}
                                >
                                  {value}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Discount */}
            <FormField
              control={form.control}
              name="specialDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Special Discount <span className=" text-main">*</span>
                  </FormLabel>
                  <br />
                  <FormControl className="mt-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          className={`${
                            isSpecialDiscount ? "text-black" : "text-gray-200"
                          } border-b border-gray-200 w-full justify-start`}
                        >
                          {isSpecialDiscount || "Select Discount"}%
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 bg-white">
                        <Command>
                          <CommandInput />
                          <CommandList>
                            <CommandEmpty>
                              The discount range should be 0 t0 25.
                            </CommandEmpty>
                            <CommandGroup
                              heading="Suggestions"
                              className="h-32 overflow-y-scroll"
                            >
                              {Array.from(Array(26).keys()).map((value) => (
                                <CommandItem
                                  key={value}
                                  value={value.toString()}
                                  onSelect={(value: string) => {
                                    setIsSpecialDiscount(value);
                                    field.onChange(value);
                                  }}
                                >
                                  {value}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-start items-center gap-4">
              <Button
                disabled={
                  !(
                    month &&
                    date &&
                    isEmailId &&
                    isLastName &&
                    isFirstName &&
                    companyNames &&
                    isPhoneNumber &&
                    isSpecialDiscount &&
                    isBirthdayDiscount
                  )
                }
                onClick={createCustomer}
                type="submit"
                className="bg-black text-white border border-black w-fit h-10 rounded-2xl hover:bg-white hover:text-black transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2"
              >
                <IoAddCircleOutline className="text-xl" />
                {isLoading ? "Loading..." : "Create"}
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

            {/* Error Message & Success Message */}
            {error && (
              <div className="text-red-600 mt-4 whitespace-nowrap">
                *{error}
              </div>
            )}
            {isSuccess && (
              <div className="text-main mt-4 whitespace-nowrap">
                {isSuccess}
              </div>
            )}
          </form>
        </Form>
      </motion.div>
    </div>
  );
}
