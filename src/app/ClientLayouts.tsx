"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import UtilitySideBar from "@/components/layouts/UtilitySideBar";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import { Menu, X } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile toggle

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/auth/login") router.replace("/auth/login");
      if (user && pathname === "/auth/login") router.replace("/");
    }
  }, [user, pathname, router, loading]);

  if (loading) return <SpinnerLoading />;

  const isLoginPage = pathname === "/auth/login";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && user && <Navbar />}

      <div className="flex flex-1">
        {/* Mobile overlay sidebar */}
        {!isLoginPage && user && (
          <>
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="m-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div
              className={`fixed inset-0 z-40 md:hidden transition-transform transform ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setSidebarOpen(false)}
              ></div>
              <aside className="relative w-64 bg-white h-full shadow-lg">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-2 right-2 p-2 rounded-md hover:bg-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
                <UtilitySideBar />
              </aside>
            </div>
          </>
        )}

        {/* Desktop sidebar */}
        {!isLoginPage && user && (
          <aside className="hidden md:block w-64 border-r border-gray-200 bg-white sticky top-0 h-screen">
            <UtilitySideBar />
          </aside>
        )}

        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>

      {!isLoginPage && user && <Footer />}
    </div>
  );
}