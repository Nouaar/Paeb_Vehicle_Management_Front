import api from "@/lib/axios";

interface MaintenanceData {
  typeMaintenance: "entretien" | "réparation" | "";
  vehicule: string;
  kilometrage: number;
  dateEntretien: string;
  detailIntervention: string;
  coutTotal: number;
  fournisseurPieces?: string;
  garage?: string;
}

export const addMaintenance = async (data: MaintenanceData) => {
  try {
    const response = await api.post("/maintenances", data);
    return response;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to add maintenance");
  }
};
