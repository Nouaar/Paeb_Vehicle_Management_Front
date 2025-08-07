"use client";

import Link from "next/link";

export default function Navbar() {
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

        <nav className="space-x-4">
          <Link href="/" className="text-gray-700 hover:text-blue-500">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-500">
            About
          </Link>
          <Link href="/logout" className="text-gray-700 hover:text-blue-500">
            Logout
          </Link>
        </nav>
      </div>
    </header>
  );
}
