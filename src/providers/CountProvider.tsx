import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CustomerContextProps {
  customerCount: number;
  companyCount: number;
  activeCompanyCount: number;
}

const CustomerContext = createContext<CustomerContextProps>({
  customerCount: 0,
  companyCount: 0,
  activeCompanyCount: 0,
});

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [companyCount, setCompanyCount] = useState<number>(0);
  const [activeCompanyCount, setActiveCompanyCount] = useState<number>(0);

  // Total Customer Count
  useEffect(() => {
    const getCustomerCount = async () => {
      const customersCollection = collection(db, "customers");
      const customerSnapshot = await getDocs(customersCollection);
      const customerCount = customerSnapshot.size;

      setCustomerCount(customerCount);
    };

    getCustomerCount();
  }, []);

  // Total Companies Count
  useEffect(() => {
    const getCustomerCount = async () => {
      const companyCollection = collection(db, "companies");
      const companySnapshot = await getDocs(companyCollection);
      const companyCount = companySnapshot.size;

      setCompanyCount(companyCount);
    };

    getCustomerCount();
  }, []);

  // Total Active Company Count
  useEffect(() => {
    const getActiveCompanyCount = async () => {
      const activeCompanyCollection = collection(db, "companies");
      const q = query(activeCompanyCollection, where("isActive", "==", true));
      const activeCompanySnapshot = await getDocs(q);
      const activeCompanyCount = activeCompanySnapshot.size;

      setActiveCompanyCount(activeCompanyCount);
    };

    getActiveCompanyCount();
  }, []);

  return (
    <CustomerContext.Provider
      value={{ customerCount, companyCount, activeCompanyCount }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
