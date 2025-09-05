"use client";
import React, { useState, useEffect } from "react";
import { getVehicles, deleteVehicle } from "@/services/vehicles";
import VehicleCard from "@/components/cards/vehicles/Vehicle";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import type { VehicleCardProps } from "@/components/cards/vehicles/Vehicle";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Search, Filter, X, Plus, Download, Car, CheckCircle, AlertCircle, Wrench } from "lucide-react";

const Vehicles = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleCardProps[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleData: VehicleCardProps[] = await getVehicles();
        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = vehicles;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(vehicle =>
        vehicle.marque?.toLowerCase().includes(term) ||
        vehicle.modele?.toLowerCase().includes(term) ||
        vehicle.plaqueImmatriculation?.toLowerCase().includes(term) ||
        vehicle.couleur?.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(vehicle => vehicle.statut === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter(vehicle => vehicle.typeVehicule === typeFilter);
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateMiseEnCirculation || 0).getTime() - new Date(a.dateMiseEnCirculation || 0).getTime();
        case "oldest":
          return new Date(a.dateMiseEnCirculation || 0).getTime() - new Date(b.dateMiseEnCirculation || 0).getTime();
        case "price-high":
          return (b.prix || 0) - (a.prix || 0);
        case "price-low":
          return (a.prix || 0) - (b.prix || 0);
        case "mileage-high":
          return (b.kilometrage || 0) - (a.kilometrage || 0);
        case "mileage-low":
          return (a.kilometrage || 0) - (b.kilometrage || 0);
        default:
          return 0;
      }
    });

    setFilteredVehicles(result);
  }, [vehicles, searchTerm, statusFilter, typeFilter, sortBy]);

  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
    setShowFilters(false);
  };

  const getStatusCount = (status: string) => {
    return vehicles.filter(vehicle => vehicle.statut === status).length;
  };

  const getTypeCount = (type: string) => {
    return vehicles.filter(vehicle => vehicle.typeVehicule === type).length;
  };

  const hasActiveFilters = searchTerm || statusFilter !== "all" || typeFilter !== "all";

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

  // Exporter en Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      vehicles.map(v => ({
        "Type": v.typeVehicule,
        "Marque": v.marque,
        "Modèle": v.modele,
        "Date Mise en Circulation": v.dateMiseEnCirculation
          ? new Date(v.dateMiseEnCirculation).toLocaleDateString()
          : "",
        "Couleur": v.couleur,
        "Plaque d'immatriculation": v.plaqueImmatriculation,
        "Kilométrage": v.kilometrage,
        "Statut": v.statut,
        "Prix": v.prix,
        "Conducteurs": v.conducteurs && v.conducteurs.length > 0
          ? v.conducteurs.map(c => `${c.firstName} ${c.lastName}`).join(", ")
          : "Aucun",
        "Prix de vente": v.prixVente ?? "Non vendue",
        "Date de vente": v.dateVente 
          ? new Date(v.dateVente).toLocaleDateString() 
          : "Non vendue",
        "Date alerte visite technique": v.alertDateVisiteTechnique 
          ? new Date(v.alertDateVisiteTechnique).toLocaleDateString() 
          : "Non définie",
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Véhicules");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "vehicules.xlsx");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Title */}
            <motion.div variants={itemVariants}>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestion du Parc Automobile</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Gérez l'ensemble des véhicules de votre flotte</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Export Excel */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToExcel}
                className="flex-1 sm:flex-none bg-green-600 text-white px-3 sm:px-5 py-2 rounded-lg sm:rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Exporter Excel</span>
                <span className="sm:hidden">Excel</span>
              </motion.button>

              {/* Add Vehicle */}
              <Link
                href="/vehicles/add"
                className="flex-1 sm:flex-none bg-blue-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ajouter un véhicule</span>
                <span className="sm:hidden">Ajouter</span>
              </Link>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filtres
              </button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6" variants={containerVariants}>
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg sm:rounded-xl">
                  <Car className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Total Véhicules</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{vehicles.length}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-green-100 rounded-lg sm:rounded-xl">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{getStatusCount("disponible")}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-amber-100 rounded-lg sm:rounded-xl">
                  <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">En utilisation</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{getStatusCount("en-utilisation")}</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 sm:p-3 bg-red-100 rounded-lg sm:rounded-xl">
                  <Wrench className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">En maintenance</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{getStatusCount("en-maintenance")}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Filters Section */}
          <motion.div 
            variants={itemVariants}
            className={`bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 ${showFilters ? 'block' : 'hidden sm:block'}`}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filtres et recherche</h2>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearFilters}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 flex items-center transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Réinitialiser
                  </motion.button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="sm:hidden text-gray-600 hover:text-gray-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search Input */}
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Rechercher</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Marque, modèle, plaque..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 sm:py-3 w-full border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="disponible">Disponible ({getStatusCount("disponible")})</option>
                  <option value="en-utilisation">En utilisation ({getStatusCount("en-utilisation")})</option>
                  <option value="en-maintenance">En maintenance ({getStatusCount("en-maintenance")})</option>
                  <option value="vendu">Vendu ({getStatusCount("vendu")})</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Type de véhicule</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                >
                  <option value="all">Tous les types</option>
                  <option value="voiture">Voiture ({getTypeCount("voiture")})</option>
                  <option value="camion">Camion ({getTypeCount("camion")})</option>
                  <option value="moto">Moto ({getTypeCount("moto")})</option>
                  <option value="bus">Bus ({getTypeCount("bus")})</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm sm:text-base"
                >
                  <option value="newest">Plus récent</option>
                  <option value="oldest">Plus ancien</option>
                  <option value="price-high">Prix (élevé)</option>
                  <option value="price-low">Prix (bas)</option>
                  <option value="mileage-high">Kilométrage (élevé)</option>
                  <option value="mileage-low">Kilométrage (bas)</option>
                </select>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results Count */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 sm:mb-6 flex justify-between items-center bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100"
        >
          <p className="text-xs sm:text-sm text-gray-600 font-medium">
            {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''} trouvé{filteredVehicles.length !== 1 ? 's' : ''}
          </p>
          {hasActiveFilters && (
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-blue-600">
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Filtres actifs</span>
            </div>
          )}
        </motion.div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12 sm:py-16">
            <SpinnerLoading />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-6 sm:p-12 text-center"
          >
            <Car className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {hasActiveFilters 
                ? "Aucun véhicule ne correspond à vos critères de recherche" 
                : "Aucun véhicule n'est enregistré dans le système"
              }
            </p>
            {hasActiveFilters ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearFilters}
                className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                Effacer les filtres
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/vehicles/add"
                  className="bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                  Ajouter un véhicule
                </Link>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {filteredVehicles.map((vehicle) => (
                <motion.div
                  key={vehicle._id}
                  variants={itemVariants}
                  layout
                >
                  <VehicleCard
                    {...vehicle}
                    deleteVehicle={handleDelete}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;