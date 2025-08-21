import api from "@/lib/axios"

export const getVehicles = async () => {
 try {
    const response = await api.get("/vehicles");
    return response.data;
 }catch(error : any) {
    console.error("Error fetching vehicles:", error);
    throw error;
 }
}

export const deleteVehicle = async (id : string ) => {
   try {
      const response = await api.delete(`/vehicles/${id}`);
      return response.data;
   }catch(error : any) {
      console.error("Error deleting vehicle:", error);
      throw error;
   }
}

export const getVehiceleById = async (id: string) => {
   try {
      const response = await api.get(`/vehicles/${id}`);
      return response.data;

   }catch(error : any) {
      console.error("Error fetching vehicle by ID:", error);
      throw error;
   }
}

export const createVehicle = async (vehicleData: any) => {
   try {
      const response = await api.post("/vehicles", vehicleData);
      return response.data;
   }catch(error : any) {
      console.error("Error creating vehicle:", error);
      throw error;
   }
}

export const updateVehicle = async (id: string, vehicleData: any) => {
   try {
      const response = await api.put(`/vehicles/${id}`, vehicleData);
      return response.data;
   }catch(error : any) {
      console.error("Error updating vehicle:", error);
      throw error;
   }
}