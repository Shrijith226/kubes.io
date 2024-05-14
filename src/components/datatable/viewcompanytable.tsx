import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { AnimatePresence, motion } from "framer-motion";
import { FaEdit } from "react-icons/fa";
import { RiEyeFill } from "react-icons/ri";
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

interface ViewCustomerProps {
  viewCustomerName: string;
  setViewCustomer: React.Dispatch<React.SetStateAction<boolean>>;
}

interface RowData {
  id: string;
  [key: string]: any;
}

export default function Data() {
  const [rows, setRows] = useState<RowData[]>([]);
  const [viewCustomer, setViewCustomer] = useState<boolean>(false);
  const [viewCustomerName, setViewCustomerName] = useState<string>("");
  const [editingCustomer, setEditingCustomer] = useState<CustomerData | false>(
    false
  );

  // Columns definition
  const columns: GridColDef[] = [
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
                setViewCustomer(true);
                setViewCustomerName(params.row.uniqueID);
              }}
              className="text-red-600 cursor-pointer ml-2"
              title="view"
            >
              <RiEyeFill />
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

          {viewCustomer && (
            <ViewCustomer
              setViewCustomer={setViewCustomer}
              viewCustomerName={viewCustomerName}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

const EditCustomerForm: React.FC<{
  customer: CustomerData;
  setEditingCustomer: (customer: CustomerData | false) => void;
}> = ({ customer, setEditingCustomer }) => {
  // Component implementation
  return null; // Placeholder, replace with actual implementation
};

const ViewCustomer: React.FC<ViewCustomerProps> = ({
  setViewCustomer,
  viewCustomerName,
}) => {
  // Component implementation
  return null; // Placeholder, replace with actual implementation
};
