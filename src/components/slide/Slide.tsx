"use client";
import React, { useState, useEffect } from "react";
import { 
  Car, 
  Wrench, 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/services/dashboard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStatsComponent = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState('maintenance');
  const [refreshing, setRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      const data = await getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(amount);
  };  

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const handleDownloadReport = () => {
    if (!stats) return;

    // Build CSV data
    const csvRows: string[] = [];
    csvRows.push("Statistique;Valeur");

    csvRows.push(`Total Véhicules;${stats.totalVehicles}`);
    csvRows.push(`Véhicules Disponibles;${stats.availableVehicles}`);
    csvRows.push(`Véhicules en Maintenance;${stats.inMaintenance}`);
    csvRows.push(`Coût Total Maintenance;${stats.totalMaintenanceCost}`);
    csvRows.push(`Conducteurs;${stats.totalDrivers}`);
    csvRows.push(`Kilométrage Moyen;${stats.averageMileage}`);
    csvRows.push(`Véhicules en Utilisation;${stats.inUseVehicles}`);
    csvRows.push(`Visites Techniques à venir;${stats.upcomingInspections}`);

    csvRows.push(""); // Empty row for spacing
    csvRows.push("Maintenance par Type");
    Object.entries(stats.maintenanceByType).forEach(([type, count]) => {
      csvRows.push(`${type};${count}`);
    });

    csvRows.push(""); 
    csvRows.push("Véhicules par Type");
    Object.entries(stats.vehiclesByType).forEach(([type, count]) => {
      csvRows.push(`${type};${count}`);
    });

    csvRows.push(""); 
    csvRows.push("Coûts Mensuels (mois/année;coût)");
    stats.monthlyMaintenanceCost.forEach(item => {
      csvRows.push(`${item.month};${item.cost}`);
    });

    // Convert to CSV string
    const csvContent = csvRows.join("\n");

    // Trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `rapport_parc_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data
  const maintenanceTypeChartData = {
    labels: stats ? Object.keys(stats.maintenanceByType) : [],
    datasets: [
      {
        label: 'Nombre de maintenances',
        data: stats ? Object.values(stats.maintenanceByType) : [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(14, 165, 233, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(139, 92, 246, 0.9)',
        ],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const vehiclesByTypeChartData = {
    labels: stats ? Object.keys(stats.vehiclesByType) : [],
    datasets: [
      {
        label: 'Nombre de véhicules',
        data: stats ? Object.values(stats.vehiclesByType) : [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.9)',
          'rgba(14, 165, 233, 0.9)',
          'rgba(245, 158, 11, 0.9)',
          'rgba(239, 68, 68, 0.9)',
        ],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const monthlyCostChartData = {
    labels: stats ? stats.monthlyMaintenanceCost.map(item => {
      const [month, year] = item.month.split('/');
      return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('fr-FR', { month: 'short' })} ${year}`;
    }) : [],
    datasets: [
      {
        label: 'Coût des maintenances',
        data: stats ? stats.monthlyMaintenanceCost.map(item => item.cost) : [],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'Inter, sans-serif',
          }
        },
      },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 text-center">
        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4 text-sm md:text-base">{error || "Impossible de charger les statistiques"}</p>
        <button 
          onClick={fetchStats}
          className="px-4 py-2 md:px-6 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Véhicules",
      value: stats.totalVehicles,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      trend: "+2% ce mois",
    },
    {
      title: "Disponibles",
      value: stats.availableVehicles,
      icon: Car,
      color: "text-green-600",
      bgColor: "bg-green-100",
      subtitle: `${Math.round((stats.availableVehicles / stats.totalVehicles) * 100)}% du parc`,
    },
    {
      title: "En Maintenance",
      value: stats.inMaintenance,
      icon: Wrench,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      subtitle: `${Math.round((stats.inMaintenance / stats.totalVehicles) * 100)}% du parc`,
    },
    {
      title: "Coût Maintenance",
      value: formatCurrency(stats.totalMaintenanceCost),
      icon: DollarSign,
      color: "text-red-600",
      bgColor: "bg-red-100",
      trend: "-5% vs mois dernier",
    },
    {
      title: "Conducteurs",
      value: stats.totalDrivers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Km Moyens",
      value: formatNumber(Math.round(stats.averageMileage)),
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      subtitle: "Moyenne du parc",
    },
    {
      title: "En Utilisation",
      value: stats.inUseVehicles,
      icon: Car,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100",
      subtitle: `${Math.round((stats.inUseVehicles / stats.totalVehicles) * 100)}% du parc`,
    },
    {
      title: "Visites Techniques",
      value: stats.upcomingInspections,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      subtitle: "Prochaines 30 jours",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8">
        <div className="flex items-center justify-between lg:block">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Tableau de Bord</h2>
            <p className="text-gray-600 mt-1 text-sm md:text-base hidden sm:block">
              Vue d'ensemble complète de votre flotte
            </p>
          </div>
          
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        <div className={`flex-col lg:flex-row items-center space-y-3 lg:space-y-0 lg:space-x-3 mt-4 lg:mt-0 ${
          mobileMenuOpen ? 'flex' : 'hidden lg:flex'
        }`}>
          <div className="text-xs md:text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg w-full lg:w-auto text-center">
            Mise à jour: {new Date().toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="flex space-x-2 w-full lg:w-auto justify-center">
            <button 
              onClick={fetchStats}
              disabled={refreshing}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              title="Actualiser"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleDownloadReport}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Télécharger rapport"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 md:p-5 border border-gray-200 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className={`p-2 md:p-3 rounded-xl ${card.bgColor}`}>
                  <IconComponent className={`w-4 h-4 md:w-6 md:h-6 ${card.color}`} />
                </div>
                {card.trend && (
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full hidden md:block">
                    {card.trend}
                  </span>
                )}
              </div>

              <div className="space-y-1 md:space-y-2">
                <h3 className="text-xs md:text-sm font-medium text-gray-600">{card.title}</h3>
                <p className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {card.value}
                </p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                )}
                {card.trend && (
                  <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full md:hidden block w-fit">
                    {card.trend}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 lg:mb-0">Analytiques Avancées</h3>
          
          {/* Chart selector - Mobile dropdown */}
          <div className="lg:hidden relative">
            <select
              value={activeChart}
              onChange={(e) => setActiveChart(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none"
            >
              <option value="maintenance">Types de Maintenance</option>
              <option value="vehicles">Types de Véhicules</option>
              <option value="monthly">Coûts Mensuels</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Chart selector - Desktop buttons */}
          <div className="hidden lg:flex space-x-2">
            <button
              onClick={() => setActiveChart('maintenance')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeChart === 'maintenance' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-2" />
              Types de Maintenance
            </button>
            <button
              onClick={() => setActiveChart('vehicles')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeChart === 'vehicles' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-2" />
              Types de Véhicules
            </button>
            <button
              onClick={() => setActiveChart('monthly')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeChart === 'monthly' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Coûts Mensuels
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* Main Chart */}
          <div className="xl:col-span-2 bg-gradient-to-br from-gray-50 to-white p-4 md:p-6 rounded-2xl border border-gray-200">
            <div className="h-64 md:h-80">
              {activeChart === 'maintenance' && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-4 text-center text-sm md:text-base">Répartition des Types de Maintenance</h4>
                  <Doughnut data={maintenanceTypeChartData} options={chartOptions} />
                </>
              )}
              
              {activeChart === 'vehicles' && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-4 text-center text-sm md:text-base">Répartition des Types de Véhicules</h4>
                  <Doughnut data={vehiclesByTypeChartData} options={chartOptions} />
                </>
              )}
              
              {activeChart === 'monthly' && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-4 text-center text-sm md:text-base">Évolution des Coûts de Maintenance</h4>
                  <Line data={monthlyCostChartData} options={chartOptions} />
                </>
              )}
            </div>
          </div>

          {/* Summary statistics */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-4 md:p-6 rounded-2xl border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-4 md:mb-6 text-center text-sm md:text-base">Indicateurs de Performance</h4>
            <div className="space-y-3 md:space-y-5">
              <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-medium text-gray-700">Taux de disponibilité</span>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {Math.round((stats.availableVehicles / stats.totalVehicles) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stats.availableVehicles / stats.totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-medium text-gray-700">Coût moyen par véhicule</span>
                  <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
                    {formatCurrency(stats.totalMaintenanceCost / stats.totalVehicles)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Sur 12 mois</div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs md:text-sm font-medium text-gray-700">Taux d'utilisation</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {Math.round((stats.inUseVehicles / stats.totalVehicles) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${(stats.inUseVehicles / stats.totalVehicles) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs md:text-sm font-medium text-gray-700">Maintenances par véhicule</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    {stats.totalVehicles > 0 ? (Object.values(stats.maintenanceByType).reduce((a, b) => a + b, 0) / stats.totalVehicles).toFixed(1) : 0}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Moyenne annuelle</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatsComponent;