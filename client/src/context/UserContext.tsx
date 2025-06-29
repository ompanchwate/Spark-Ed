import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

const UserContext = createContext<{
  userDetails: any; // if you really want no strict typing, use `any` here as fallback
  setUserDetails: Dispatch<SetStateAction<any>>;
}>({
  userDetails: null,
  setUserDetails: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("details");
    if (userData) {
      try {
        setUserDetails(JSON.parse(userData));
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
