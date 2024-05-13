import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";

// Firebase
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { HiOutlineSpeakerphone } from "react-icons/hi";

interface RowData {
  id: string;
  [key: string]: any;
}

export default function SpecialBroadcast() {
  const [rows, setRows] = useState<RowData[]>([]);

  // Fetching Customers
  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(collection(db, "companies"));
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchData();
  }, []);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns: GridColDef[] = [
    {
      field: "companyName",
      headerName: "Company Name",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "shortName",
      headerName: "Short Name",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: false,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "discountPercentage",
      headerName: "Discount",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "dailyCode",
      headerName: "Daily Code",
      align: "center",
      flex: isMobile ? 0 : 1,
      width: isMobile ? 130 : undefined,
      headerAlign: "center",
      resizable: true,
      headerClassName: "sm:text-xs md:text-sm lg:text-base font-bold",
    },
    {
      field: "customerCount",
      headerName: "Customer Count",
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
        <div className="flex items-center justify-center h-12 px-2">
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
      <div className="w-full p-1 mt-20 relative">
        {/* Heading & Btn */}
        <h1 className="text-lg font-medium absolute -top-10 left-0">
          Special Broadcast
        </h1>

        <Button
          variant={"outline"}
          className="absolute -top-12 right-0 rounded-3xl bg-main border-main hover:bg-main hover:border-main hover:text-white text-white text-sm"
        >
          <HiOutlineSpeakerphone className="text-white text-xl mr-2" />{" "}
          Broadcast All
        </Button>

        {/* Table */}
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
