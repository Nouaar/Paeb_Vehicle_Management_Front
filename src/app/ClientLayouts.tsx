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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/auth/login") router.replace("/auth/login");
      if (user && pathname === "/auth/login") router.replace("/");
    }
  }, [user, pathname, router, loading]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) return <SpinnerLoading />;

  const isLoginPage = pathname === "/auth/login";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && user && <Navbar />}

      <div className="flex flex-1">
        {/* Mobile sidebar overlay */}
        {!isLoginPage && user && (
          <>
            <div className="md:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="m-2 p-2 rounded-md bg-gray-200 hover:bg-gray-300 fixed top-16 z-30"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div
              className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className="absolute inset-0 bg-black/30 transition-opacity"
                onClick={() => setSidebarOpen(false)}
              ></div>
              <div className={`relative transform transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}>
                <UtilitySideBar onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </>
        )}

        {/* Desktop sidebar */}
        {!isLoginPage && user && (
          <aside className="hidden md:block w-64 border-r border-gray-200 bg-white sticky top-0 h-screen">
            <UtilitySideBar />
          </aside>
        )}

        <main className="flex-1 p-4 md:p-6 overflow-y-auto mt-16 md:mt-0">
          {children}
        </main>
      </div>

      {!isLoginPage && user && <Footer />}
    </div>
  );
}