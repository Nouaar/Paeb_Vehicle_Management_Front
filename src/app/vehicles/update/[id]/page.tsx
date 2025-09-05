"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import VehicleForm from "@/components/forms/VehicleForm";

export default function UpdateVehiclePage() {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`https://paeb-vehicle-management-backend.onrender.com/api/vehicles/${id}`);
        if (!response.ok) throw new Error("Erreur lors du chargement du véhicule");
        
        const data = await response.json();
        setInitialData({
          ...data,
          conducteurs: data.conducteurs?.map((c: any) => c._id) || [],
        });
      } catch (error) {
        console.error("Erreur fetch véhicule :", error);
        alert("Impossible de charger les données du véhicule");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const handleUpdate = async (data: any) => {
    try {
      const response = await fetch(`https://paeb-vehicle-management-backend.onrender.com/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erreur lors de la mise à jour du véhicule");

      const result = await response.json();
      console.log("✅ Véhicule mis à jour :", result);
      
      alert("Véhicule mis à jour avec succès !");
      router.push("/vehicles");
    } catch (error) {
      console.error("❌ Erreur :", error);
      alert("Une erreur s'est produite lors de la mise à jour du véhicule");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <VehicleForm 
      initialData={initialData} 
      onSubmit={handleUpdate} 
      submitLabel="Mettre à jour le véhicule" 
    />
  );
}