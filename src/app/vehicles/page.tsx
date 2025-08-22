"use client";
import React, { useState, useEffect } from "react";
import { getVehicles, deleteVehicle } from "@/services/vehicles";
import VehicleCard from "@/components/cards/vehicles/Vehicle";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import type { VehicleCardProps } from "@/components/cards/vehicles/Vehicle";
import Link from "next/link";

const Vehicles = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleCardProps[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<VehicleCardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

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
  };

  const getStatusCount = (status: string) => {
    return vehicles.filter(vehicle => vehicle.statut === status).length;
  };

  const getTypeCount = (type: string) => {
    return vehicles.filter(vehicle => vehicle.typeVehicule === type).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion du Parc Automobile</h1>
              <p className="text-gray-600 mt-2">Gérez l'ensemble des véhicules de votre flotte</p>
            </div>
            <Link
              href="/vehicles/add"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Ajouter un véhicule
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 11-8 0"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Total Véhicules</p>
                  <p className="text-xl font-bold text-gray-900">{vehicles.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">Disponibles</p>
                  <p className="text-xl font-bold text-gray-900">{getStatusCount("disponible")}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">En utilisation</p>
                  <p className="text-xl font-bold text-gray-900">{getStatusCount("en-utilisation")}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-600">En maintenance</p>
                  <p className="text-xl font-bold text-gray-900">{getStatusCount("en-maintenance")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtres et recherche</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
                Réinitialiser les filtres
              </button>
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
                    placeholder="Marque, modèle, plaque..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de véhicule</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            {filteredVehicles.length} véhicule{filteredVehicles.length !== 1 ? 's' : ''} trouvé{filteredVehicles.length !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Filtres actifs: {statusFilter !== 'all' ? 'Statut, ' : ''}{typeFilter !== 'all' ? 'Type, ' : ''}{searchTerm ? 'Recherche' : ''}</span>
          </div>
        </div>

        {/* Vehicles Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <SpinnerLoading />
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <svg
              className="h-16 w-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 11-8 0"></path>
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun véhicule trouvé</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? "Aucun véhicule ne correspond à vos critères de recherche" 
                : "Aucun véhicule n'est enregistré dans le système"
              }
            </p>
            {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') ? (
              <button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Effacer les filtres
              </button>
            ) : (
              <Link
                href="/vehicles/add"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Ajouter le premier véhicule
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                {...vehicle}
                deleteVehicle={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;