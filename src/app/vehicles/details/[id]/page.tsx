"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getVehiceleById } from "@/services/vehicles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import Link from "next/link";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface VehicleDetails {
  _id: string;
  typeVehicule: string;
  marque: string;
  modele: string;
  dateMiseEnCirculation: string;
  couleur: string;
  plaqueImmatriculation: string;
  kilometrage: number;
  statut: string;
  prix: number;
  conducteurs: Array<any>;
  maintenances: Array<{
    _id: string;
    typeMaintenance: string;
    dateEntretien: string;
    coutTotal: number;
    detailIntervention: string;
    garage: string;
  }>;
  alertDateVisiteTechnique?: string;
  totalCoutMaintenance?: number;
}

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        if (!id) return;
        const response = await getVehiceleById(id);
        if (!response) throw new Error("Failed to fetch vehicle details");
        setVehicle(response);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SpinnerLoading />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Véhicule non trouvé</h2>
          <Link href="/vehicles" className="text-blue-600 hover:text-blue-800">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    );
  }

  // Calculs sécurisés
  const totalMaintenanceCost = vehicle.totalCoutMaintenance || 
    vehicle.maintenances.reduce((sum, maintenance) => sum + (Number(maintenance.coutTotal) || 0), 0);
  
  const maintenanceCount = vehicle.maintenances.length;
  const averageMaintenanceCost = maintenanceCount > 0 ? totalMaintenanceCost / maintenanceCount : 0;
  const costValueRatio = vehicle.prix > 0 ? (totalMaintenanceCost / vehicle.prix) * 100 : 0;

  // Préparation des données pour les graphiques
  const maintenanceByType = vehicle.maintenances.reduce((acc, maintenance) => {
    const type = maintenance.typeMaintenance || "Non spécifié";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maintenanceByMonth = vehicle.maintenances.reduce((acc, maintenance) => {
    try {
      const date = maintenance.dateEntretien ? new Date(maintenance.dateEntretien) : new Date();
      const month = date.toLocaleString('fr-FR', { month: 'short' });
      const cost = Number(maintenance.coutTotal) || 0;
      acc[month] = (acc[month] || 0) + cost;
    } catch (e) {
      console.error("Error processing maintenance date:", e);
    }
    return acc;
  }, {} as Record<string, number>);


  // Données des graphiques
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  const maintenanceCostChartData = {
    labels: Object.keys(maintenanceByMonth),
    datasets: [
      {
        label: 'Coût par mois',
        data: Object.values(maintenanceByMonth),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
    ],
  };

  const maintenanceTypeChartData = {
    labels: Object.keys(maintenanceByType),
    datasets: [
      {
        label: 'Types de maintenance',
        data: Object.values(maintenanceByType),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const costDistributionData = {
    labels: ['Valeur véhicule', 'Coût maintenance'],
    datasets: [
      {
        data: [vehicle.prix, totalMaintenanceCost],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderWidth: 1,
      },
    ],
  };

  // Fonctions utilitaires
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "voiture": return "🚗";
      case "camion": return "🚚";
      case "moto": return "🏍️";
      case "bus": return "🚌";
      default: return "🚗";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponible": return "bg-green-100 text-green-800";
      case "en-utilisation": return "bg-amber-100 text-amber-800";
      case "en-maintenance": return "bg-red-100 text-red-800";
      case "vendu": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return "Date invalide";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
    }).format(amount);
  };

  const formatMileage = (km: number) => {
    return new Intl.NumberFormat('fr-FR').format(km);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4" key={vehicle._id}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Link href="/vehicles" className="text-blue-600 hover:text-blue-800 mb-2 inline-block">
              ← Retour
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{getVehicleIcon(vehicle.typeVehicule)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {vehicle.marque} {vehicle.modele}
                </h1>
                <p className="text-gray-600">{vehicle.plaqueImmatriculation}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/vehicles/update/${vehicle._id}`}
              className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Modifier
            </Link>
            <Link
              href={`/maintenance/add?vehicleId=${vehicle._id}`}
              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              Nouvelle Maintenance
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">💰</div>
              <div className="ml-3">
                <p className="text-xs text-gray-600">Valeur</p>
                <p className="text-lg font-bold">{formatCurrency(vehicle.prix)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">🛣️</div>
              <div className="ml-3">
                <p className="text-xs text-gray-600">Kilométrage</p>
                <p className="text-lg font-bold">{formatMileage(vehicle.kilometrage)} km</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-amber-100 rounded-lg">🔧</div>
              <div className="ml-3">
                <p className="text-xs text-gray-600">Maintenances</p>
                <p className="text-lg font-bold">{maintenanceCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">💸</div>
              <div className="ml-3">
                <p className="text-xs text-gray-600">Coût Total</p>
                <p className="text-lg font-bold">{formatCurrency(totalMaintenanceCost)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-4 px-4 overflow-x-auto">
              {[
                { id: "overview", label: "Aperçu" },
                { id: "maintenance", label: "Maintenances" },
                { id: "drivers", label: "Conducteurs" },
                { id: "analytics", label: "Analytiques" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-md font-semibold">Informations du véhicule</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="font-medium">{vehicle.typeVehicule}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Couleur</p>
                      <p className="font-medium">{vehicle.couleur}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Mise en circulation</p>
                      <p className="font-medium">{formatDate(vehicle.dateMiseEnCirculation)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Statut</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(vehicle.statut)}`}>
                        {vehicle.statut.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-md font-semibold">Coûts et statistiques</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Coût moyen</p>
                      <p className="font-medium">{formatCurrency(averageMaintenanceCost)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total maintenances</p>
                      <p className="font-medium">{maintenanceCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Dernière maintenance</p>
                      <p className="font-medium">
                        {maintenanceCount > 0 
                          ? formatDate(vehicle.maintenances[maintenanceCount - 1].dateEntretien)
                          : "Aucune"
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Visite technique</p>
                      <p className="font-medium">
                        {vehicle.alertDateVisiteTechnique 
                          ? formatDate(vehicle.alertDateVisiteTechnique)
                          : "Non définie"
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Maintenance Tab */}
            {activeTab === "maintenance" && (
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Historique des maintenances</h3>
                {maintenanceCount === 0 ? (
                  <p className="text-gray-600 text-sm">Aucune maintenance enregistrée</p>
                ) : (
                  <div className="space-y-2">
                    {vehicle.maintenances.map((maintenance) => (
                      <div key={maintenance._id} className="bg-gray-50 rounded p-3 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{maintenance.typeMaintenance}</p>
                            <p className="text-gray-600">{formatDate(maintenance.dateEntretien)}</p>
                            <p className="text-gray-600">{maintenance.detailIntervention}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              {formatCurrency(Number(maintenance.coutTotal) || 0)}
                            </p>
                            <p className="text-gray-600">{maintenance.garage}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Drivers Tab */}
            {activeTab === "drivers" && (
              <div className="space-y-3">
                <h3 className="text-md font-semibold">Conducteurs assignés</h3>
                {vehicle.conducteurs.length === 0 ? (
                  <p className="text-gray-600 text-sm">Aucun conducteur assigné</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {vehicle.conducteurs.map((driver) => (
                      <div key={driver._id} className="bg-gray-50 rounded p-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {driver.firstName?.[0]}{driver.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {driver.firstName} {driver.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{driver.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-4">
                <h3 className="text-md font-semibold">Analytiques et statistiques</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Maintenance Cost Trend */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <h4 className="font-medium mb-2 text-sm">Évolution des coûts</h4>
                    <Line data={maintenanceCostChartData} options={chartOptions} height={200} />
                  </div>

                  {/* Maintenance Type Distribution */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <h4 className="font-medium mb-2 text-sm">Types de maintenance</h4>
                    <Doughnut data={maintenanceTypeChartData} options={chartOptions} height={200} />
                  </div>

                  {/* Cost Distribution */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <h4 className="font-medium mb-2 text-sm">Répartition des coûts</h4>
                    <Doughnut data={costDistributionData} options={chartOptions} height={200} />
                  </div>

                  {/* Maintenance Statistics */}
                  <div className="bg-white p-3 rounded border border-gray-200">
                    <h4 className="font-medium mb-2 text-sm">Statistiques</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total dépensé:</span>
                        <span className="font-bold">{formatCurrency(totalMaintenanceCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coût moyen:</span>
                        <span className="font-bold">{formatCurrency(averageMaintenanceCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nombre de maintenances:</span>
                        <span className="font-bold">{maintenanceCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ratio coût/valeur:</span>
                        <span className="font-bold">
                          {costValueRatio.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}