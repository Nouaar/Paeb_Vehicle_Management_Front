"use client";
import React, { useState, useEffect } from "react";
import MaintenanceCard from "@/components/cards/maintenance/Maintenance";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import { getMaintenances, deleteMaintenance } from "@/services/maintenances";
import { Maintenance } from "@/types/maintenance";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function MaintenanceList() {
  const [loading, setLoading] = useState(true);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState<Maintenance[]>([]);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [garageFilter, setGarageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  // Mobile filters state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const data = await getMaintenances();
        setMaintenances(data);
        setFilteredMaintenances(data);
      } catch (error) {
        console.error("Error fetching maintenances:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaintenances();
  }, []);

  // Filtering + sorting
  useEffect(() => {
    let result = maintenances;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (m) =>
          m.detailIntervention?.toLowerCase().includes(term) ||
          m.garage?.toLowerCase().includes(term) ||
          m.fournisseurPieces?.toLowerCase().includes(term) ||
          (typeof m.vehicule !== "string" && 
            (m.vehicule?.marque?.toLowerCase().includes(term) || 
             m.vehicule?.modele?.toLowerCase().includes(term) ||
             m.vehicule?.plaqueImmatriculation?.toLowerCase().includes(term)))
      );
    }

    if (typeFilter !== "all") {
      result = result.filter((m) => m.typeMaintenance === typeFilter);
    }

    if (garageFilter !== "all") {
      result = result.filter((m) => m.garage === garageFilter);
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.dateEntretien).getTime() - new Date(a.dateEntretien).getTime();
        case "oldest":
          return new Date(a.dateEntretien).getTime() - new Date(b.dateEntretien).getTime();
        case "cost-high":
          return (b.coutTotal || 0) - (a.coutTotal || 0);
        case "cost-low":
          return (a.coutTotal || 0) - (b.coutTotal || 0);
        default:
          return 0;
      }
    });

    setFilteredMaintenances(result);
  }, [maintenances, searchTerm, typeFilter, garageFilter, sortBy]);

  const handleDelete = async (id: string) => {
    try {
      await deleteMaintenance(id);
      setMaintenances((prev) => prev.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setGarageFilter("all");
    setSortBy("recent");
  };

  // Calculate statistics
  const totalCost = maintenances.reduce((sum, m) => sum + (m.coutTotal || 0), 0);
  const averageCost = maintenances.length > 0 ? totalCost / maintenances.length : 0;
  const maintenanceTypes = [...new Set(maintenances.map(m => m.typeMaintenance))];
  const uniqueGarages = [...new Set(maintenances.map(m => m.garage).filter(Boolean))];

  const hasActiveFilters = searchTerm || typeFilter !== "all" || garageFilter !== "all";

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Export to Excel function
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      maintenances.map(m => ({
        "Type": m.typeMaintenance,
        "Véhicule": typeof m.vehicule === "object" && m.vehicule
          ? `${m.vehicule.marque} ${m.vehicule.modele}`
          : "Non défini",
        "Plaque": typeof m.vehicule === "object" && m.vehicule
          ? m.vehicule.plaqueImmatriculation
          : "Non défini",
        "Détail intervention": m.detailIntervention,
        "Kilométrage": m.kilometrage ?? "",
        "Garage": m.garage ?? "",
        "Fournisseur pièces": m.fournisseurPieces ?? "",
        "Coût total": m.coutTotal ?? "",
        "Date maintenance": m.dateEntretien
          ? new Date(m.dateEntretien).toLocaleDateString("fr-FR")
          : "",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Maintenances");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "maintenances.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          {/* Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gestion des Maintenances
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Suivi complet de l'entretien des véhicules</p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToExcel}
              className="bg-green-600 text-white px-3 py-2 sm:px-5 sm:py-2 rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center shadow-md hover:shadow-lg text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3h14v2H3V3zm0 4h14v2H3V7zm0 4h8v2H3v-2zm0 4h8v2H3v-2z"></path>
              </svg>
              <span className="hidden sm:inline">Exporter Excel</span>
              <span className="sm:hidden">Excel</span>
            </motion.button>

            <Link
              href="/maintenance/add"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl text-sm sm:text-base flex-1 sm:flex-none justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              <span className="hidden sm:inline">Nouvelle Maintenance</span>
              <span className="sm:hidden">Nouvelle</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 11-8 0"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Maintenances</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{maintenances.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Coût Total</p>
                <p className="text-lg sm:text-sm font-bold text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(totalCost)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-amber-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Coût Moyen</p>
                <p className="text-lg sm:text-sm font-bold text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'TND' }).format(averageCost)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-6 0H5m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Garages</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{uniqueGarages.length}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <span className="font-medium text-gray-700">Filtres & Recherche</span>
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform ${showMobileFilters ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </motion.button>
        </div>

        {/* Filters Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 hidden lg:block">Filtres & Recherche</h2>
            <h2 className="text-lg font-semibold text-gray-900 lg:hidden">Filtres appliqués</h2>
            {hasActiveFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Réinitialiser les filtres
              </motion.button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Garage, fournisseur, véhicule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de maintenance</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="all">Tous types</option>
                {maintenanceTypes.map((type, idx) => (
                  <option key={idx} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Garage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Garage</label>
              <select
                value={garageFilter}
                onChange={(e) => setGarageFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="all">Tous garages</option>
                {uniqueGarages.map((garage, idx) => (
                  <option key={idx} value={garage || ''}>
                    {garage}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="recent">Plus récent</option>
                <option value="oldest">Plus ancien</option>
                <option value="cost-high">Coût (élevé)</option>
                <option value="cost-low">Coût (bas)</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-gray-600 font-medium text-sm sm:text-base">
            {filteredMaintenances.length} maintenance{filteredMaintenances.length !== 1 ? 's' : ''} trouvée{filteredMaintenances.length !== 1 ? 's' : ''}
          </p>
          {hasActiveFilters && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span className="hidden sm:inline">Filtres actifs</span>
            </div>
          )}
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <SpinnerLoading />
          </div>
        ) : filteredMaintenances.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center"
          >
            <svg
              className="h-16 w-16 sm:h-20 sm:w-20 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 11-8 0"></path>
            </svg>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Aucune maintenance trouvée</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto text-sm sm:text-base">
              {hasActiveFilters 
                ? "Aucune maintenance ne correspond à vos critères de recherche. Essayez d'ajuster vos filtres." 
                : "Commencez par ajouter votre première maintenance."
              }
            </p>
            {hasActiveFilters ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                Effacer les filtres
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/maintenance/add"
                  className="bg-blue-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium inline-flex items-center text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Ajouter une maintenance
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence>
              {filteredMaintenances.map((maintenance) => (
                <motion.div
                  key={maintenance._id}
                  variants={itemVariants}
                  layout
                >
                  <MaintenanceCard
                    {...maintenance}
                    deleteMaintenance={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}