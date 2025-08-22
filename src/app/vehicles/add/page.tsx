"use client";

import { useRouter } from "next/navigation";
import VehicleForm from "@/components/forms/VehicleForm";

export default function AddVehiclePage() {
  const router = useRouter();

  const handleAdd = async (data: any) => {
    try {
      const response = await fetch("http://localhost:3001/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout du véhicule");

      const result = await response.json();
      console.log("✅ Véhicule ajouté :", result);
      
      alert("Véhicule ajouté avec succès !");
      router.push("/vehicles");
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert("Une erreur s'est produite lors de l'ajout du véhicule");
    }
  };

  return <VehicleForm onSubmit={handleAdd} />;
}