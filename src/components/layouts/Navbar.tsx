"use client";

import Link from "next/link";
import { Home, Info, LogOut, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";

interface VehiculeAlert {
  _id: string;
  marque: string;
  modele: string;
  plaqueImmatriculation: string;
  dateVisiteTechnique: string;
}

export default function Navbar() {
  const { logout } = useAuth();
  const [alerts, setAlerts] = useState<VehiculeAlert[]>([]);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await axios.get<VehiculeAlert[]>(
          "http://localhost:3001/api/vehicles/alertes/visite-technique"
        );
        setAlerts(data);
      } catch (err) {
        console.error("Erreur lors du chargement des alertes", err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/images/Logo_paeb.jpg"
              alt="Logo Paeb"
              className="h-10 w-auto transition-transform duration-300 hover:scale-110"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink href="/" icon={<Home size={20} />}>Accueil</NavLink>

            {/* 🔔 Notifications */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="relative flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <Bell size={22} />
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                    {alerts.length}
                  </span>
                )}
              </button>

              {/* Dropdown notifications */}
              {open && (
                <div className="absolute right-0 mt-3 w-80 bg-white shadow-xl rounded-xl p-4 z-50 border border-gray-200">
                  <h3 className="font-semibold text-md mb-3 text-gray-700">Alertes Visite Technique</h3>
                  {alerts.length > 0 ? (
                    <ul className="max-h-72 overflow-y-auto space-y-2">
                      {alerts.map((vehicule) => (
                        <li key={vehicule._id} className="p-2 rounded-lg hover:bg-gray-50 transition">
                          🚗 <span className="font-semibold">{vehicule.marque} {vehicule.modele}</span><br />
                          🏷️ <span className="text-gray-600">{vehicule.plaqueImmatriculation}</span><br />
                          📅 <span className="text-gray-500 text-sm">{vehicule.dateVisiteTechnique
                              ? new Date(vehicule.dateVisiteTechnique).toLocaleDateString("fr-FR")
                              : "Non renseignée"}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-2">✅ Aucune alerte de visite technique</p>
                  )}
                </div>
              )}
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} />
              <span className="font-medium">Déconnexion</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

// Reusable NavLink component
function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-100"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
