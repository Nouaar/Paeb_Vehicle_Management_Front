"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import UtilityNavbar from "@/components/layouts/UtilityNavbar";
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
    <>
      {!isLoginPage && user && (
        <>
          <Navbar />
          <UtilityNavbar />
        </>
      )}
      <main className="flex-grow">{children}</main>
      {!isLoginPage && user && <Footer />}
    </>
  );
}