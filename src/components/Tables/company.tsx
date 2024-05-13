import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FaEdit, FaEye } from "react-icons/fa";
import { Button } from "../ui/button";
 
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { query, where, collectionGroup } from "firebase/firestore";
 

interface CompanyData {
  companyId: string;
  companyName: string;
  shortName: string;
  discountPercentage: string;
  dailyCode: string;
  customerCount: number; // Add customerCount property
  isActive: string;
}

export default function DataTable() {
  const [rows, setRows] = useState<CompanyData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRow, setEditingRow] = useState<CompanyData | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query all companies
        const companiesQuerySnapshot = await getDocs(collection(db, "companies"));
        const companiesData: CompanyData[] = [];
  
        // Loop through each company
        for (const companyDoc of companiesQuerySnapshot.docs) {
          const companyData = companyDoc.data() as CompanyData;
          const companyId = companyDoc.id;
  
          // Query customers for the current company
          const customersQuerySnapshot = await getDocs(query(collection(db, "customers"), where("companyName", "==", companyData.companyName)));
  
          // Get customer count
          let customerCount = 0;
          customersQuerySnapshot.forEach(customerDoc => {
            customerCount++;
          });
  
          // Add company data with customer count
          companiesData.push({
            ...companyData,
            companyId,
            customerCount,
          });
        }
  
        // Set the state with company data including customer count
        setRows(companiesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
  
    fetchData();
  }, []);
  
  
  const handleEdit = (row: CompanyData) => {
    setEditingRow(row);
    setIsEditing(true);
  };

  const handleUpdate = async (updatedData: Partial<CompanyData>) => {
    try {
      await updateDoc(doc(db, "companies", (updatedData as CompanyData).companyId), updatedData);
      setIsEditing(false);
      setEditingRow(null);
      const updatedRows = await getDocs(collection(db, "companies"));
      setRows(
        updatedRows.docs.map((doc) => ({ ...doc.data(), companyId: doc.id }) as CompanyData)
      );
      setNotification("Company data updated successfully!");
      setTimeout(() => {
        setNotification(null);
      }, 3000); // Hide notification after 3 seconds
    } catch (error) {
      console.error("Error updating document: ", error);
      setNotification("Error updating company data!");
    }
  };
 

  const columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <div className="flex items-center space-x-2 justify-center h-12">
          <Button
            onClick={() => handleEdit(params.row as CompanyData)}
            className="text-main cursor-pointer bg-red-100"
          >
            <FaEdit />
          </Button>

          <Button
            onClick={() => console.log("View action clicked for", params.row)}
            className="text-main cursor-pointer bg-red-100"
          >
            <FaEye />
          </Button>
        </div>
      ),
    },

    {
      field: "companyName",
      headerName: "Company Name",
      width: 155,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "shortName",
      headerName: "Short Name",
      width: 155,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "discountPercentage",
      headerName: "Discount %",
      width: 155,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "dailyCode",
      headerName: "Daily Code",
      width: 155,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "customerCount",
      headerName: "Customer Count",
      width: 155,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
    {
      field: "isActive",
      headerName: "Is Active",
      width: 155,
      align: "center",
      headerAlign: "center",
      resizable: false,
    },
  ];

  return (
 
  
    <div>
      <div style={{ height: 400, width: "100%", alignItems: "center", position: "relative" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          getRowId={(row) => row.companyId}
        />
      </div>
      <AnimatePresence>
        {isEditing && editingRow && (
          <motion.div>
            <EditForm
              editingRow={editingRow}
              onUpdate={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface EditFormProps {
  editingRow: CompanyData;
  onUpdate: (updatedData: Partial<CompanyData>) => void;
  onCancel: () => void;
}

function EditForm({ editingRow, onUpdate, onCancel }: EditFormProps) {
  const [updatedData, setUpdatedData] = useState<Partial<CompanyData>>(editingRow);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(updatedData);
  };

  return (
    <div
      onClick={onCancel} // Close the modal if clicked outside
      className="bg-white bg-opacity-5 backdrop-blur fixed h-screen  top-0 left-0 flex justify-center items-center"
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
          Edit a Company
        </h1>

        <form onSubmit={handleSubmit} className="mt-8">
          {/* Company Name */}
          <div>
            <label className="font-bold">Company Name <span className="text-main">*</span></label>
            <input
              type="text"
              name="companyName"
              value={updatedData.companyName || ""}
              onChange={handleChange}
            />
          </div>

          {/* Short Name */}
          <div className="mt-4">
            <label className="font-bold">
              Short Name <span className="text-main">*</span>
            </label>
            <input
              type="text"
              name="shortName"
              value={updatedData.shortName || ""}
              onChange={handleChange}
              className="mt-5" // Add margin-top for spacing
            />
          </div>

          {/* Discount Percentage */}
          <div className="mt-4">
            <label className="font-bold">
              Discount Percentage <span className="text-main">*</span>
            </label>
            <input
              type="text"
              name="discountPercentage"
              value={updatedData.discountPercentage || ""}
              onChange={handleChange}
            />
          </div>

          {/* Daily Code */}
          <div className="mt-4">
            <label className="font-bold">Daily Code&npsb<span className="text-main">*</span></label>
            <p>{updatedData.dailyCode}</p>
          </div>

          {/* Customer Count */}
          <div className="mt-4">
            <label className="font-bold" >Customer Count <span className="text-main">*</span></label>
            <p>{updatedData.customerCount}</p>
          </div>

          {/* Is Active */}
          <div className="mt-4">
            <label className="font-bold">Is Active <span className="text-main">*</span></label>
            <select
              name="isActive"
              value={updatedData.isActive || ""}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="TRUE">True</option>
              <option value="FALSE">False</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-start items-center gap-4">
            <button
              type="submit"
              className="bg-black text-white border border-black w-fit h-12 rounded-2xl hover:bg-white hover:text-black transition-all ease-in-out duration-500 mt-10 flex justify-center items-center gap-3"
            >
              Save & Update
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="bg-red-600 text-white border border-red-600 w-fit h-12 rounded-2xl hover:bg-white hover:text-red-600 transition-all ease-in-out duration-500 mt-10 flex justify-center items-center gap-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
     </div>
  );
}
