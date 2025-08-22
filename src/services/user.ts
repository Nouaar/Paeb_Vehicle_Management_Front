import api from "@/lib/axios"
import { User } from "@/types/user";

export const getUsers = async () => {
 try {
    const response = await api.get("/users");
    return response.data;
 }catch(error : any) {
    console.error("Error fetching users:", error);
    throw error;
 }

}

export const getUserById = async (id: string) => {
   try {
      const response = await api.get(`/users/${id}`);
      return response.data;

   }catch(error : any) {
      console.error("Error fetching user by ID:", error);
      throw error;
   }
}

export const updateUser = async (id: string, userData: User) => {
   try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
   }catch(error : any) {
      console.error("Error updating user:", error);
      throw error;
   }
}

export const deleteUser = async (id : string ) => {
   try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
   }catch(error : any) {
      console.error("Error deleting user:", error);
      throw error;
   }
}


export const addUser = async (userData : Partial<User>) => {
    try {
        const response = await api.post("/auth/add-user", userData);
        return response.data;
    }catch(error : any) {
        console.error("Error adding user:", error);
        throw error;
    }
}