import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CustomerContextProps {
  customerCount: number;
}

const CustomerContext = createContext<CustomerContextProps>({ customerCount: 0 });

export const useCustomers = () => useContext(CustomerContext);

export const CustomerProvider = ({ children }: { children: ReactNode }) => {
  const [customerCount, setCustomerCount] = useState<number>(0);

  useEffect(() => {
    const getCustomerCount = async () => {
      const customersCollection = collection(db, "customers");
      const customerSnapshot = await getDocs(customersCollection);
      const customerCount = customerSnapshot.size;

      setCustomerCount(customerCount);
    };

    getCustomerCount();
  }, []);

  return (
    <CustomerContext.Provider value={{ customerCount }}>
      {children}
    </CustomerContext.Provider>
  );
};
