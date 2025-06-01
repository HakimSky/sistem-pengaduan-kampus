import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem("is_staff") === "true";

  useEffect(() => {
    if (!isAdmin) {
      navigate("/"); // arahkan ke home kalau bukan admin
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : null;
};

export default ProtectedRoute;
