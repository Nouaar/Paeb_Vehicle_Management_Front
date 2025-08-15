"use client";

import Link from "next/link";
import { Home, Info, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">  
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/Logo_paeb.jpg"
              alt="Logo Paeb"
              className="h-10 w-auto transition-transform hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/" icon={<Home size={18} />}>
              Accueil
            </NavLink>
            <NavLink href="/about" icon={<Info size={18} />}>
              À propos
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50"
            >
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </nav>

          {/* Mobile menu button would go here */}
          
        </div>
      </div>
    </header>
  );
}

// Reusable NavLink component
function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}