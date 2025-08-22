"use client";

import MaintenanceForm from "@/components/forms/MaintenanceForm";
import { addMaintenance } from "@/services/maintenances";
import { useRouter } from "next/navigation";

export default function AddMaintenancePage() {
  const router = useRouter();

  const handleAdd = async (data: any) => {
    try {
      await addMaintenance(data);
      alert("Maintenance ajoutée avec succès !");
      router.push("/maintenance"); // Redirect to maintenance list
    } catch (error) {
      console.error("Error adding maintenance:", error);
      alert("Une erreur s'est produite lors de l'ajout de la maintenance.");
    }
  };

  return <MaintenanceForm onSubmit={handleAdd} />;
}