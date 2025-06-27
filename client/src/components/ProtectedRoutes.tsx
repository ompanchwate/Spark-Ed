// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedUserType }) => {
  const user = JSON.parse(localStorage.getItem("details"));

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (user.userType !== allowedUserType) {
    return <Navigate to="/unauthorized" />; // or redirect to homepage
  }



  return children;
};

export default ProtectedRoute;
