"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

// Import des icônes lucide
import { 
  Truck,            // pour "Gestion du parc"
  Settings,         // pour "Maintenance"
  FileText,         // pour "Ressources"
  ChevronRight,     // petite flèche pour items
} from "lucide-react";

export default function UtilityNavbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  // Ajout d'une icône par catégorie (dans l'objet)
  const categories = [
    {
      key: "parc",
      title: "Gestion du parc",
      icon: <Truck className="inline-block mr-1 h-5 w-5 text-blue-600" />,
      items: [
        { href: "/suivi-parc", label: "Suivi du parc" },
        { href: "/acquisition", label: "Acquisitions" },
        { href: "/cession", label: "Sorties / Cessions" },
      ],
    },
    {
      key: "maintenance",
      title: "Maintenance",
      icon: <Settings className="inline-block mr-1 h-5 w-5 text-blue-600" />,
      items: [
        { href: "/maintenance", label: "Maintenance préventive" },
        { href: "/reparations", label: "Réparations" },
        { href: "/outils", label: "Outils & Équipements" },
      ],
    },
    {
      key: "ressources",
      title: "Ressources",
      icon: <FileText className="inline-block mr-1 h-5 w-5 text-blue-600" />,
      items: [
        { href: "/fournisseurs", label: "Fournisseurs" },
        { href: "/documents", label: "Documents & Rapports" },
      ],
    },
  ];

  return (
    <nav className="bg-blue-50 border-t border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex flex-wrap gap-6">
        {categories.map((cat) => (
          <div
            key={cat.key}
            className="relative group"
            onMouseEnter={() => setOpenDropdown(cat.key)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            <button
              onClick={() => toggleDropdown(cat.key)}
              aria-haspopup="true"
              aria-expanded={openDropdown === cat.key}
              aria-controls={`${cat.key}-menu`}
              className="text-gray-800 font-semibold hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
            >
              {cat.icon}
              {cat.title}
            </button>

            {/* Dropdown */}
            <div
              id={`${cat.key}-menu`}
              className={`absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50 transition-all duration-200 ${
                openDropdown === cat.key ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <ul className="py-2">
                {cat.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpenDropdown(null)}
                      className={`flex items-center justify-between px-4 py-2 text-sm ${
                        pathname === item.href
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="h-4 w-4 text-blue-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
