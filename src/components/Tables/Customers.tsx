import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AnimatePresence, motion } from "framer-motion";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  useState,
  useEffect,
  FC,
  FormEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

// Icons
import { CiSearch } from "react-icons/ci";
import { IoMdDownload } from "react-icons/io";
import { FaEdit, FaRegEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

// Firebase
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  CommandItem,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "../ui/command";

interface CustomerData {
  id: string;
  uniqueID: string;
  dob: string;
  emailID: string;
  firstName: string;
  lastName: string;
  location: string;
  companyName: string;
  phoneNumber: string;
  birthdayDiscount: string;
  specialDiscount: string;
}

interface DeleteCustomerProps {
  deleteCustomerName: string;
  setDeleteCustomer: Dispatch<SetStateAction<boolean>>;
}

interface DeleteCustomer {
  fullName: string;
}

interface RowData {
  id: string;
  [key: string]: any;
}

export default function DataTable() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [deleteCustomer, setDeleteCustomer] = useState<boolean>(false);
  const [deleteCustomerName, setDeleteCustomerName] = useState<string>("");
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | false>(
    false
  );

  // Fetching Customers
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, "customers"));
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchData();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns: GridColDef[] = [
    {
      field: "uniqueID",
      headerName: "Membership ID",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      align: "center",
      headerAlign: "center",
      headerClassName: "w-full",
    },
    {
      field: "firstName",
      headerName: "First Name",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "companyName",
      headerName: "Company",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "emailID",
      headerName: "Email",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "dob",
      headerName: "DOB(DD/MM)",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "birthdayDiscount",
      headerName: "Birthday Discount",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "specialDiscount",
      headerName: "Special Discount",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "isActive",
      headerName: "Activity Status",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
      renderCell: (params) => (
        <div className="flex items-center justify-center h-12">
          <div className="flex justify-center items-center gap-4 text-xl">
            <div
              onClick={() => {
                setDeleteCustomer(true);
                setDeleteCustomerName(params.row.uniqueID);
              }}
              className="text-red-600 cursor-pointer"
              title="delete"
            >
              <RiDeleteBin6Line />
            </div>

            <div
              className="text-main cursor-pointer"
              title="edit"
              onClick={() => setEditingCustomer(params.row)}
            >
              <FaEdit />
            </div>

            <div
              className="text-main cursor-pointer"
              title="view"
              onClick={() => setEditingCustomer(params.row)}
            >
              <FaRegEye />
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Download
  const downloadData = useCallback(() => {
    const dataStr = JSON.stringify(rows, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    let exportFileDefaultName = "customers.json";

    let linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [rows]);

  // Search Fn
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredRows = rows.filter(
    (row) =>
      row.dob.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.emailID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.uniqueID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.isActive.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.specialDiscount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.birthdayDiscount.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search Bar */}
      <div className="absolute top-3 right-5">
        <div className="relative">
          <div>
            <Input
              id="searchBar"
              placeholder="search..."
              className="bg-white sm:w-32 md:w-96 p-4 border rounded-xl sm:h-7 md:h-10"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
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

      <div className="flex justify-center items-center relative">
        <div className="w-full h-96 p-1 mt-5">
          <DataGrid
            key={filteredRows.length}
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
          />

          <Button
            variant={"outline"}
            onClick={downloadData}
            className="rounded-3xl border-main absolute -top-[1.6rem] lg:-top-[4.4rem] right-0 lg:right-44 text-sm"
          >
            <IoMdDownload className="text-main text-xl mr-2" /> Download Audit
            Log
          </Button>

          <AnimatePresence>
            {editingCustomer && (
              <EditCustomerForm
                customer={editingCustomer}
                setEditingCustomer={setEditingCustomer}
              />
            )}

            {deleteCustomer && (
              <DeleteCustomer
                setDeleteCustomer={setDeleteCustomer}
                deleteCustomerName={deleteCustomerName}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// --------------- Edit Customer ---------------
const EditCustomerForm: FC<{
  customer: CustomerData;
  setEditingCustomer: (customer: CustomerData | false) => void;
}> = ({ customer, setEditingCustomer }) => {
  const [updatedCustomer, setUpdatedCustomer] =
    useState<CustomerData>(customer);

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

  // Fetch company name
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, "companies"));
      setCompanyNames(data.docs.map((doc) => doc.data().companyName));
    };

    fetchData();
  }, []);

  // Update Handler
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Check if email is in the correct format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(isEmailId || updatedCustomer.emailID)) {
      setError("Invalid email format");
      setIsLoading(false);
      return;
    }

    // Check if first name is in the correct format
    const firstNameRegex = /^[a-zA-Z\s]{4,}$/;
    if (!firstNameRegex.test(isFirstName || updatedCustomer.firstName)) {
      setError("First name must be at least 4 alphabetic characters");
      setIsLoading(false);
      return;
    }

    // Check if first name is in the correct format
    const lastNameRegex = /^[a-zA-Z\s]{1,}$/;
    if (!lastNameRegex.test(isLastName || updatedCustomer.lastName)) {
      setError("Last name must be at least 1 alphabetic characters");
      setIsLoading(false);
      return;
    }

    try {
      const customerRef = doc(db, "customers", updatedCustomer.id);
      const updatedFields = {
        companyName: isCompanyName || updatedCustomer.companyName,
        firstName: isFirstName || updatedCustomer.firstName,
        lastName: isLastName || updatedCustomer.lastName,
        emailID: isEmailId || updatedCustomer.emailID,
        dob: updatedCustomer.dob || updatedCustomer.dob,
        phoneNumber: isPhoneNumber || updatedCustomer.phoneNumber,
        birthdayDiscount:
          isBirthdayDiscount || updatedCustomer.birthdayDiscount,
        specialDiscount: isSpecialDiscount || updatedCustomer.specialDiscount,
      };
      await updateDoc(customerRef, updatedFields);

      setIsSuccess("Customer updated successfully");

      window.location.reload();
    } catch (error) {
      console.error("Error updating document: ", error);
      setError("Something went wrong");
    }
  };

  return (
    <div
      onClick={() => setEditingCustomer(false)}
      className="bg-white bg-opacity-5 backdrop-blur fixed h-screen w-screen top-0 left-0 flex justify-center items-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ ease: "easeInOut", delay: 0.3 }}
        className="bg-white border-4 border-main shadow-sm h-fit sm:w-[85vw] md:w-[30vw] px-12 py-8 rounded-xl relative overflow-hidden"
      >
        <h1 className="text-center text-main uppercase text-xl font-bold">
          Edit a customer
        </h1>

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Membership ID */}
          <div>
            <Label className="font-bold">Membership ID</Label>
            <Input
              type="text"
              disabled
              name="uniqueID"
              defaultValue={updatedCustomer.uniqueID}
            />
          </div>

          {/* Company */}
          <div className="mt-4">
            <Label className="font-bold">
              Company Name <span className=" text-main">*</span>
            </Label>

            <Popover>
              <PopoverTrigger asChild>
                <Button className="text-black border-b border-gray-200 w-full justify-start">
                  {isCompanyName || updatedCustomer.companyName}
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
          </div>

          {/* First Name */}
          <div className="mt-4">
            <Label className="font-bold">First Name</Label>
            <Input
              type="text"
              name="firstName"
              defaultValue={updatedCustomer.firstName}
              onChange={(e) => setIsFirstName(e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="mt-4">
            <Label className="font-bold">Last Name</Label>
            <Input
              type="text"
              name="lastName"
              defaultValue={updatedCustomer.lastName}
              onChange={(e) => setIsLastName(e.target.value)}
            />
          </div>

          {/* Email ID */}
          <div className="mt-4">
            <Label className="font-bold">Email ID</Label>
            <Input
              type="email"
              name="emailID"
              defaultValue={updatedCustomer.emailID}
              onChange={(e) => setIsEmailId(e.target.value)}
            />
          </div>

          {/* DOB */}
          <div className="mt-4">
            <Label className="font-bold">DOB</Label>
            <Input type="date" name="dob" defaultValue={updatedCustomer.dob} />
          </div>

          {/* Phone Number */}
          <div className="mt-4">
            <Label className="font-bold">Phone Number</Label>
            <div className="flex justify-start items-center gap-2 mt-2">
              <p className="border rounded-full p-2">+65</p>
              <div>
                <Input
                  type="text"
                  placeholder="phone number"
                  name="phoneNumber"
                  defaultValue={updatedCustomer.phoneNumber}
                  onChange={(e) => setIsPhoneNumber(e.target.value)}
                  className="w-32"
                />
              </div>
            </div>
          </div>

          {/* Birthday Discount */}
          <div className="mt-4">
            <Label className="font-bold">Birthday Discount</Label>
            <Input
              type="text"
              name="birthdayDiscount"
              defaultValue={updatedCustomer.birthdayDiscount}
              onChange={(e) => setIsBirthdayDiscount(e.target.value)}
            />
          </div>

          {/* Special Discount */}
          <div className="mt-4">
            <Label className="font-bold">Special Discount</Label>
            <Input
              type="text"
              name="specialDiscount"
              defaultValue={updatedCustomer.specialDiscount}
              onChange={(e) => setIsSpecialDiscount(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-start items-center gap-4">
            <Button
              type="submit"
              className="bg-black text-white border border-black w-fit h-10 rounded-2xl hover:bg-white hover:text-black transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2"
            >
              update
            </Button>

            <Button
              type="button"
              onClick={() => setEditingCustomer(false)}
              className="bg-red-600 text-white border border-red-600 w-fit h-10 rounded-2xl hover:bg-white hover:text-red-600 transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2"
            >
              Cancel
            </Button>
          </div>
        </form>

        {/* Error Message & Success Message */}
        {error && (
          <div className="text-red-600 mt-4 whitespace-nowrap text-sm">
            *{error}
          </div>
        )}
        {isSuccess && (
          <div className="text-main mt-4 whitespace-nowrap text-sm">
            {isSuccess}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ------------- Inactive Customer -------------
const DeleteCustomer: FC<DeleteCustomerProps> = ({
  setDeleteCustomer,
  deleteCustomerName,
}) => {
  return (
    <div
      onClick={() => setDeleteCustomer(false)}
      className="bg-white bg-opacity-5 backdrop-blur fixed h-screen w-screen top-0 left-0 flex justify-center items-center"
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 0 }}
        transition={{ ease: "easeInOut", delay: 0.3 }}
        className="bg-white border-4 border-main shadow-sm h-fit sm:w-[85vw] md:w-[30vw] px-12 py-8 rounded-xl relative overflow-hidden"
      >
        Confirm Deletion of company
        <p className="font-bold uppercase">{deleteCustomerName}</p>
        {/* Buttons */}
        <div className="flex justify-start items-center gap-4">
          <Button
            type="submit"
            className="bg-black text-white border border-black w-fit h-10 rounded-2xl hover:bg-white hover:text-black transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2"
          >
            Delete
          </Button>

          <Button
            type="button"
            onClick={() => setDeleteCustomer(false)}
            className="bg-red-600 text-white border border-red-600 w-fit h-10 rounded-2xl hover:bg-white hover:text-red-600 transition-all ease-in-out duration-500 mt-8 flex justify-center items-center gap-2"
          >
            Cancel
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
