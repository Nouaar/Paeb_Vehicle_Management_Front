"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import UtilitySideBar from "@/components/layouts/UtilitySideBar";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/auth/login") {
        router.replace("/auth/login");
      }
      if (user && pathname === "/auth/login") {
        router.replace("/");
      }
    }
  }, [user, pathname, router, loading]);

  if (loading) {
    return <SpinnerLoading />;
  }

  const isLoginPage = pathname === "/auth/login";

  return (
    <div className="flex flex-col min-h-screen">
      {!isLoginPage && user && <Navbar />}

      <div className="flex flex-1">
        {!isLoginPage && user && (
          <aside className="w-64 border-r border-gray-200 bg-white sticky top-0 h-screen">
            <UtilitySideBar />
          </aside>
        )}

        <main className="flex-1 p-4 overflow-y-auto">{children}</main>
      </div>

      {!isLoginPage && user && <Footer />}
    </div>
  );
}