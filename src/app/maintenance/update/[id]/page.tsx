"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MaintenanceForm from "@/components/forms/MaintenanceForm";
import { updateMaintenance, getMaintenanceById } from "@/services/maintenances";

export default function UpdateMaintenancePage() {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchMaintenance = async () => {
      try {
        const data = await getMaintenanceById(id);
        setInitialData(data);
      } catch (error) {
        console.error("Error fetching maintenance:", error);
        alert("Impossible de charger les données de maintenance.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMaintenance();
    }
  }, [id]);

  const handleUpdate = async (data: any) => {
    try {
      await updateMaintenance(id, data);
      alert("Maintenance mise à jour avec succès !");
      router.push("/maintenance"); 
    } catch (error) {
      console.error("Error updating maintenance:", error);
      alert("Une erreur s'est produite lors de la mise à jour de la maintenance.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <MaintenanceForm 
      initialData={initialData} 
      onSubmit={handleUpdate} 
      submitLabel="Mettre à jour la maintenance" 
    />
  );
}