"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Truck,
  Settings,
  FileText,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

export default function UtilityNavbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();

  const categories = [
    {
      key: "parc",
      title: "Gestion du parc",
      icon: <Truck className="h-5 w-5" />,
      items: [
        { href: "/suivi-parc", label: "Suivi du parc" },
        { href: "/acquisition", label: "Acquisitions" },
        { href: "/cession", label: "Sorties / Cessions" },
      ],
    },
    {
      key: "maintenance",
      title: "Maintenance",
      icon: <Settings className="h-5 w-5" />,
      items: [
        { href: "/maintenance", label: "Maintenance préventive" },
        { href: "/reparations", label: "Réparations" },
        { href: "/outils", label: "Outils & Équipements" },
      ],
    },
    {
      key: "ressources",
      title: "Ressources",
      icon: <FileText className="h-5 w-5" />,
      items: [
        { href: "/fournisseurs", label: "Fournisseurs" },
        { href: "/documents", label: "Documents & Rapports" },
      ],
    },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-50 to-gray-50 border-y border-gray-200">
      <div className="container mx-auto px-4">
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-1 py-2">
          {categories.map((cat) => (
            <div
              key={cat.key}
              className="relative group"
              onMouseEnter={() => setActiveMenu(cat.key)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-lg transition-all",
                  activeMenu === cat.key
                    ? "text-blue-600 bg-white shadow-sm"
                    : "text-gray-700 hover:text-blue-600 hover:bg-white/50"
                )}
              >
                <span className="text-blue-500">{cat.icon}</span>
                {cat.title}
                <ChevronDown
                  size={16}
                  className={cn(
                    "transition-transform",
                    activeMenu === cat.key ? "rotate-180" : ""
                  )}
                />
              </button>

              <div
                className={cn(
                  "absolute left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 transition-all duration-200 origin-top",
                  activeMenu === cat.key
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                )}
              >
                {cat.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm transition-colors",
                      pathname === item.href
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-blue-50"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Menu - Implement accordion or drawer here */}
      </div>
    </nav>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}