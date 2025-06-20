import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { validateToken } from "@/app/api/api";

export const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      const response = await validateToken(token);
      if (response.status !== 200) {
        localStorage.removeItem("details");
        Cookies.remove("token");
        navigate("/signin");
      }
    };

    checkAuth();
  }, [navigate]);

  return children;
};
