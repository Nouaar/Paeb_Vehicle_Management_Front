// services/dashboard.ts
import api from "@/lib/axios"

export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  inUseVehicles: number;
  inMaintenance: number;
  soldVehicles: number;
  totalMaintenanceCost: number;
  averageMileage: number;
  upcomingInspections: number;
  totalDrivers: number;
  maintenanceByType: { [key: string]: number };
  vehiclesByType: { [key: string]: number };
  monthlyMaintenanceCost: { month: string; cost: number }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // In a real implementation, you might have a dedicated endpoint for dashboard stats
    // For now, we'll fetch all data and calculate statistics
    const [vehiclesResponse, maintenancesResponse, usersResponse] = await Promise.all([
      api.get("/vehicles"),
      api.get("/maintenances"),
      api.get("/users")
    ]);

    const vehicles = vehiclesResponse.data;
    const maintenances = maintenancesResponse.data;
    const users = usersResponse.data;

    // Calculate statistics
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v: any) => v.statut === "disponible").length;
    const inUseVehicles = vehicles.filter((v: any) => v.statut === "en-utilisation").length;
    const inMaintenance = vehicles.filter((v: any) => v.statut === "en-maintenance").length;
    const soldVehicles = vehicles.filter((v: any) => v.statut === "vendu").length;
    
    const totalMaintenanceCost = maintenances.reduce((sum: number, m: any) => sum + (m.coutTotal || 0), 0);
    const averageMileage = vehicles.reduce((sum: number, v: any) => sum + (v.kilometrage || 0), 0) / totalVehicles;
    
    // Calculate upcoming inspections (next 30 days)
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);
    const upcomingInspections = vehicles.filter((v: any) => {
      if (!v.alertDateVisiteTechnique) return false;
      const inspectionDate = new Date(v.alertDateVisiteTechnique);
      return inspectionDate >= today && inspectionDate <= nextMonth;
    }).length;

    const totalDrivers = users.filter((u: any) => u.role === "conducteur").length;
    
    // Group maintenance by type
    const maintenanceByType = maintenances.reduce((acc: any, maintenance: any) => {
      const type = maintenance.typeMaintenance || "Non spécifié";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Group vehicles by type
    const vehiclesByType = vehicles.reduce((acc: any, vehicle: any) => {
      const type = vehicle.typeVehicule || "Non spécifié";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Calculate monthly maintenance cost
    const monthlyMaintenanceCost = maintenances.reduce((acc: any, maintenance: any) => {
      if (!maintenance.dateEntretien) return acc;
      
      const date = new Date(maintenance.dateEntretien);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      const existing = acc.find((item: any) => item.month === monthYear);
      
      if (existing) {
        existing.cost += maintenance.coutTotal || 0;
      } else {
        acc.push({ month: monthYear, cost: maintenance.coutTotal || 0 });
      }
      
      return acc;
    }, []);


    return {
      totalVehicles,
      availableVehicles,
      inUseVehicles,
      inMaintenance,
      soldVehicles,
      totalMaintenanceCost,
      averageMileage,
      upcomingInspections,
      totalDrivers,
      maintenanceByType,
      vehiclesByType,
      monthlyMaintenanceCost
    };
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch dashboard statistics");
  }
};