
import React, { useState, useEffect } from 'react';
import { Toaster } from "sonner";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import Navbar from "./Navbar";
import { authService } from "@/lib/api";

const AppLayout = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-semibold text-xl">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          {isAuthenticated && <AppSidebar />}
          <main className="flex-1 flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 container py-8 max-w-7xl">
              <Outlet />
            </div>
            {isAuthenticated && <SidebarTrigger />}
          </main>
        </div>
      </SidebarProvider>
    </>
  );
};

export default AppLayout;
