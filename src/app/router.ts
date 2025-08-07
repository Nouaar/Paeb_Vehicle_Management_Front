import Home from "./page";


const ROUTES = {
  LOGIN: "/login",
  HOME: "/",
    DASHBOARD: "/dashboard",
    VEHICLES: "/vehicles",
    VEHICLE_DETAILS: (id: string) => `/vehicles/${id}`,
    ADD_VEHICLE: "/vehicles/add",
    EDIT_VEHICLE: (id: string) => `/vehicles/edit/${id}`,
    USERS: "/users",
    USER_DETAILS: (id: string) => `/users/${id}`,
    ADD_USER: "/users/add",
    EDIT_USER: (id: string) => `/users/edit/${id}`,
  
    SETTINGS: "/settings",
    NOT_FOUND: "/404",

};

export default ROUTES;
