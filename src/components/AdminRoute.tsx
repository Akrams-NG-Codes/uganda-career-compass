
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { checkIsAdmin } from "@/services/supabaseService";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const { isAdmin } = await checkIsAdmin(user.id);
        setIsAdmin(isAdmin);
      } else {
        setIsAdmin(false);
      }
      setChecking(false);
    };

    if (!isLoading) {
      verifyAdmin();
    }
  }, [user, isLoading]);

  if (isLoading || checking) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
