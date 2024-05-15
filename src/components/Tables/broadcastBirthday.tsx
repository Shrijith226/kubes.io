import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// Firebase
import { db } from "@/lib/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
import { format, isWithinInterval, add, endOfMonth } from "date-fns";

interface RowData {
  id: string;
  [key: string]: any;
}

export default function BirthdayBroadcast() {
  const [rows, setRows] = useState<RowData[]>([]);

  // Fetching Customers which birthday in next 30 days
   useEffect(() => {
    const fetchData = async () => {
      const today = new Date();
      //const endOfNext60Days = add(today, { days: 10 });
      const formattedToday = format(today, "dd/MM");

      const q = query(
        collection(db, "customers"),
        where("dob", ">=", formattedToday)
      );

      const data = await getDocs(q);

      const upcomingBirthdays = data.docs
        .map((doc) => ({ ...doc.data(), id: doc.id, dob: doc.data().dob }))
        .filter((customer) => {
          const customerBirthdayThisYear = new Date(
            `${customer.dob}-${today.getFullYear()}`
          );
          // Extend the interval by 30 days, considering the next month
          const endOfNext60Days = add(today, { days: 30 });
          return isWithinInterval(customerBirthdayThisYear, {
            start: today,
            end: endOfNext60Days,
          });
        });

      setRows(upcomingBirthdays);
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
      resizable: false,
      headerClassName: "w-full",
    },
    {
      field: "companyName",
      headerName: "Company",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "firstName",
      headerName: "First Name",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: false,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "lastName",
      headerName: "Last Name",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "emailID",
      headerName: "Email",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "dob",
      headerName: "DOB(DD/MM)",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "birthdayDiscount",
      headerName: "Birthday Discount",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "specialDiscount",
      headerName: "Special Discount",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "action",
      headerName: "Action",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
      renderCell: (params) => (
        <div className="flex items-center justify-center h-12">
          <Button
            variant={"outline"}
            className="rounded-3xl border-main text-xs hover:text-main transition-all duration-500 ease-in-out"
          >
            Broadcast
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex justify-left items-center">
      <div className="w-full p-1 mt-12 relative">
        <h1 className="text-lg font-medium absolute -top-10 left-0">
          Birthdays in next 30 day
        </h1>
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
      </div>
    </div>
  );
}
