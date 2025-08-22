import { User } from "./user";

export interface Vehicle {
  _id ?: string; 
  dateMiseEnCirculation: string;
  typeVehicule: "voiture" | "camion" | "moto" | "bus";
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
  plaqueImmatriculation: string;
  kilometrage: number;
  prix: number;
  statut: "disponible" | "en-utilisation" | "en-maintenance" | "vendu";
  conducteurs: User[] | []; 
  prixVente?: number | null;
  dateVente?: Date | null;
}
