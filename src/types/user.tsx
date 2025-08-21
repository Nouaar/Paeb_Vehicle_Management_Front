export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "conducteur" | "manager";
}
