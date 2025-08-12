"use client";

import Link from "next/link";
import { Home, Info, LogOut } from "lucide-react"; 
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  }


  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        <Link href="/" className="text-xl font-bold text-blue-600">
          <img
            src="/images/Logo_paeb.jpg"
            alt="Logo Paeb"
            className="h-12 w-auto"
          />
        </Link>

        <nav className="space-x-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <Home size={18} />
            Accueil
          </Link>
          <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <Info size={18} />
            À propos
          </Link>
          <p className="flex items-center gap-2 text-gray-700 hover:text-blue-500" onClick={handleLogout}>
            <LogOut size={18} />
            Déconnexion
          </p>
        </nav>
      </div>
    </header>
  );
}
