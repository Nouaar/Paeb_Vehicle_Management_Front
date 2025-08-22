"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, Settings, ChevronDown, Plus, List, Car, Wrench, ClipboardList, Home, BarChart3, Users, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function UtilitySidebar() {
  const { user } = useAuth()
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    parc: true,
    maintenance: true
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const categories = [
    {
      key: "parc",
      title: "Gestion du parc",
      icon: <Truck className="h-5 w-5" />,
      items: [
        { href: "/vehicles", label: "Liste des véhicules", icon: <List className="h-4 w-4" /> },
        { href: "/vehicles/add", label: "Ajouter un véhicule", icon: <Plus className="h-4 w-4" /> },
      ],
    },
    {
      key: "maintenance",
      title: "Maintenance",
      icon: <Settings className="h-5 w-5" />,
      items: [
        { href: "/maintenance", label: "Liste des maintenances", icon: <ClipboardList className="h-4 w-4" /> },
        { href: "/maintenance/add", label: "Nouvelle réparation/entretient", icon: <Wrench className="h-4 w-4" /> },
      ],
    },
  ];

  const mainNavItems = [
    { href: "/dashboard", label: "Tableau de bord", icon: <Home className="h-5 w-5" /> },
    { href: "/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/users", label: "Équipe", icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 h-screen flex flex-col overflow-hidden shadow-sm">

      {/* Main Navigation */}
      <div className="py-4 px-3 border-b border-gray-100">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                  isActive
                    ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span className={isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"}>
                  {item.icon}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.key} className="rounded-lg">
              {/* Section Header */}
              <button
                onClick={() => toggleSection(cat.key)}
                className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 group-hover:text-gray-700">{cat.icon}</span>
                  <span className="font-medium text-sm">{cat.title}</span>
                </div>
                <ChevronDown 
                  className={`h-4 w-4 text-gray-400 transition-transform ${expandedSections[cat.key] ? 'rotate-0' : '-rotate-90'}`} 
                />
              </button>

              {/* Section Items */}
              {expandedSections[cat.key] && (
                <div className="ml-8 mt-2 space-y-1">
                  {cat.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all group",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <span className={isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-600"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="p-4 border-t border-gray-100">
        <Link
          href="/support"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-all group"
        >
          <HelpCircle className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
          <span className="font-medium">Support & Aide</span>
        </Link>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.token}</p>
            <p className="text-xs text-gray-500 truncate">Administrateur</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}