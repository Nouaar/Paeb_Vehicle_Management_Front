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