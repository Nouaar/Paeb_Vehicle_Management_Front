"use client";

import Link from "next/link";
import { Home, Info, LogOut, Bell, Menu } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await axios.get<VehiculeAlert[]>(
          "https://paeb-vehicle-management-backend.onrender.com/api/vehicles/alertes/visite-technique"
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
          {/* Logo and Mobile Menu Button */}
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-3 p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <Link href="/" className="flex items-center">
              <img
                src="/images/Logo_paeb.jpg"
                alt="Logo Paeb"
                className="h-10 w-auto transition-transform duration-300 hover:scale-110"
              />
            </Link>
          </div>

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

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
              <div className="px-4 py-3 space-y-3">
                <MobileNavLink href="/" icon={<Home size={20} />} onClick={() => setMobileMenuOpen(false)}>
                  Accueil
                </MobileNavLink>
                
                {/* Mobile Notifications */}
                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <Bell size={20} />
                    <span>Notifications</span>
                    {alerts.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {alerts.length}
                      </span>
                    )}
                  </button>
                  
                  {open && (
                    <div className="ml-6 mt-2 bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Alertes Visite Technique</h4>
                      {alerts.length > 0 ? (
                        <ul className="space-y-2 text-sm">
                          {alerts.slice(0, 3).map((vehicule) => (
                            <li key={vehicule._id} className="p-2 rounded-md bg-white">
                              🚗 {vehicule.marque} {vehicule.modele} ({vehicule.plaqueImmatriculation})
                            </li>
                          ))}
                          {alerts.length > 3 && (
                            <li className="text-xs text-gray-500 text-center">
                              +{alerts.length - 3} autres alertes
                            </li>
                          )}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">Aucune alerte</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            </div>
          )}
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

// Mobile NavLink component
function MobileNavLink({ href, icon, children, onClick }: { 
  href: string; 
  icon: React.ReactNode; 
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}