import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AnimatePresence, motion } from "framer-motion";
import {
  useState,
  useEffect,
  FC,
  FormEvent,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";

// Icons
import { FaEdit } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
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

// Schemas
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

export default function Data() {
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

  const columns: GridColDef[] = [
    {
      field: "uniqueID",
      headerName: "Membership ID",
      flex: 1,
      width: 180,
      align: "center",
      headerAlign: "center",
      resizable: false,
      headerClassName: "w-full",
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
      align: "center",
      width: 180,
      headerAlign: "center",
      resizable: false,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
      align: "center",
      width: 180,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "companyName",
      headerName: "Company",
      flex: 1,
      align: "center",
      width: 180,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "emailID",
      headerName: "Email",
      flex: 1,
      align: "center",
      width: 180,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "dob",
      headerName: "DOB(DD/MM)",
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "birthdayDiscount",
      headerName: "Birthday Discount",
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "specialDiscount",
      headerName: "Special Discount",
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "isActive",
      headerName: "Activity Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
      renderCell: (params) => (
        <div className="flex items-center justify-center h-12 w-2/4">
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
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center relative">
      <div className="w-full p-1 mt-5 md:w-full">
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
        />


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
