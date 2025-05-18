import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import Cookies from "js-cookie";

type UserDetailsType = {
  // Replace this with the actual shape of user details
  name?: string;
  email?: string;
  [key: string]: any;
};

type UserContextType = {
  userDetails: UserDetailsType | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetailsType | null>>;
};

const UserContext = createContext<UserContextType>({
  userDetails: null,
  setUserDetails: () => { },
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetailsType | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("details");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserDetails(parsed); // this stores the full parsed object
      } catch (error) {
        console.error("Error parsing user details from localStorage:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
