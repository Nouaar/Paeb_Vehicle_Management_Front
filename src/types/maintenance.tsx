import { Vehicle } from "./vehicle";

export interface Maintenance {
  _id?: string;
  typeMaintenance: "entretien" | "réparation";
  vehicule: Vehicle | string; 
  kilometrage: number;
  dateEntretien: string;
  detailIntervention: string;
  coutTotal: number;
  fournisseurPieces?: string;
  garage?: string;
}


export interface MaintenanceFormData {
  typeMaintenance: string;
  vehicule: string;
  kilometrage: string;
  dateEntretien: string;
  detailIntervention: string;
  coutTotal: string;
  fournisseurPieces?: string;
  garage?: string;
}