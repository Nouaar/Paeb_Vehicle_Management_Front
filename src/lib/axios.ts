import axios from "axios";


const api = axios.create({
    baseURL : process.env.NEXT_PUBLIC_API_URL || "https://paeb-vehicle-management-backend.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})


export default api;