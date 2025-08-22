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

export const getMaintenances = async () => {
  try {

    const response = await api.get("/maintenances");
    return response.data;

  }catch(error : any) {
    throw new Error(error.response?.data?.message || "Failed to fetch maintenances");
  }
}

export const deleteMaintenance = async (id: string) => {
  try {
    const response = await api.delete(`/maintenances/${id}`);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to delete maintenance");
  }
}


export const updateMaintenance = async (id: string, data: MaintenanceData) => {
  try {
    const response = await api.put(`/maintenances/${id}`, data);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to update maintenance");
  }
}


export const getMaintenanceById = async (id: string) => {
  try {
    const response = await api.get(`/maintenances/${id}`);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Failed to fetch maintenance");
  }
};