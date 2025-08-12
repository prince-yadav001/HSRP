
"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check sessionStorage for login state when component mounts
    const loggedInStatus = sessionStorage.getItem("isAdminLoggedIn");
    if (loggedInStatus === "true") {
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    // Set login state and also in sessionStorage
    sessionStorage.setItem("isAdminLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Clear login state and from sessionStorage
    sessionStorage.removeItem("isAdminLoggedIn");
    setIsLoggedIn(false);
  };

  if (isLoading) {
      return (
          <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 text-center">
                <p>Loading...</p>
          </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
      {isLoggedIn ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
}
