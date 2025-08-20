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

export default function UtilitySidebar() {
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
    <aside className="w-64 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 h-screen p-4">
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.key} className="rounded-lg">
            <button
              onClick={() =>
                setActiveMenu(activeMenu === cat.key ? null : cat.key)
              }
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all",
                activeMenu === cat.key
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-700 hover:bg-white/50 hover:text-blue-600"
              )}
            >
              <span className="flex items-center gap-2">
                <span className="text-blue-500">{cat.icon}</span>
                {cat.title}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform",
                  activeMenu === cat.key ? "rotate-180" : ""
                )}
              />
            </button>

            {/* Dropdown Items */}
            {activeMenu === cat.key && (
              <div className="ml-6 mt-1 space-y-1">
                {cat.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                      pathname === item.href
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-blue-50"
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
