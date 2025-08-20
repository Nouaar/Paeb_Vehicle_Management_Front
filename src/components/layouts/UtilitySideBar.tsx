"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Settings, FileText, ChevronRight } from "lucide-react";

export default function UtilitySidebar() {
  const pathname = usePathname();

 const categories = [
  {
    key: "parc",
    title: "Gestion du parc",
    icon: <Truck className="h-5 w-5" />,
    items: [
      { href: "/suivi-parc", label: "Liste des véhicules" },
      { href: "/acquisition", label: "Ajouter un véhicule" },
      { href: "/cession", label: "Cessions de véhicules" },
    ],
  },
  {
    key: "maintenance",
    title: "Maintenance",
    icon: <Settings className="h-5 w-5" />,
    items: [
      { href: "/maintenance", label: "Liste des maintenances" },
      { href: "/reparations", label: "Nouvelle réparation" },
      { href: "/outils", label: "Nouvel entretien" },
    ],
  },
];


  return (
    <aside className="w-64 bg-gradient-to-b from-blue-50 to-gray-50 border-r border-gray-200 h-screen p-4">
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.key} className="rounded-lg">
            <div className="flex items-center gap-2 px-4 py-2 text-gray-700 font-semibold">
              <span className="text-blue-500">{cat.icon}</span>
              {cat.title}
            </div>

            {/* Static List Items */}
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
          </div>
        ))}
      </div>
    </aside>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
