"use client";

import Link from "next/link";
import { Home, Info, LogOut } from "lucide-react"; 

export default function Navbar() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          <img
            src="/images/Logo_paeb.jpg"
            alt="Logo Paeb"
            className="h-12 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="space-x-6 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <Home size={18} />
            Accueil
          </Link>
          <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <Info size={18} />
            À propos
          </Link>
          <Link href="/logout" className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <LogOut size={18} />
            Déconnexion
          </Link>
        </nav>
      </div>
    </header>
  );
}
