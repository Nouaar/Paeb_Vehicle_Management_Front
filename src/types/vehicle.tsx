import { User } from "./user";

export interface Vehicle {
  _id ?: string; 
  dateAjout: string;
  typeVehicule: "voiture" | "camion" | "moto" | "bus";
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
  plaqueImmatriculation: string;
  kilometrage: number;
  statut: "disponible" | "en-utilisation" | "en-maintenance";
  conducteurs: User[] | []; 
}
