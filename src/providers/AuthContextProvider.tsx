"use client";
import { Auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  uid: string;
  role: string;
  email: string;
}

interface AuthState {
  userDetails: User | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signOut = async () => {
    await Auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const uid = localStorage.getItem("UID");
    const email = localStorage.getItem("Email");

    if (uid && email) {
      const fetchRole = async () => {
        const userDoc = await getDoc(doc(db, "Users", uid));
        const role = userDoc.data()?.role;
        setUser({ uid, email, role });
      };

      fetchRole();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userDetails: user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);