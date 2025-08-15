import api from "@/lib/axios"


export const loginAccount = async (email : string , password : string) =>{

    try {
    const response = await  api.post("/auth/login", { email, password });
    return response;
    }catch(err : any) {
        throw new Error(err.response?.data?.message || "Login failed");
    }
    

}