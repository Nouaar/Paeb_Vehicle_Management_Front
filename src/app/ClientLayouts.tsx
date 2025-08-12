"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import UtilityNavbar from "@/components/layouts/UtilityNavbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!user && pathname !== "/auth/login") {
      router.replace("/auth/login");
    }
    if (user && pathname === "/auth/login") {
      router.replace("/");
    }
  }, [user, pathname, router]);

  const isLoginPage = pathname === "/auth/login";

  return (
    <>
      {!isLoginPage && user && <Navbar />}
      {!isLoginPage && user && <UtilityNavbar />}
      <main className="flex-grow">{children}</main>
      {!isLoginPage && user && <Footer />}
    </>
  );
}
