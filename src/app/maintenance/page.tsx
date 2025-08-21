"use client";
import React, { useState, useEffect } from "react";
import MaintenanceCard from "@/components/cards/maintenance/Maintenance";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import { getMaintenances } from "@/services/maintenances";
import { Maintenance } from "@/types/maintenance";
import { deleteMaintenance } from "@/services/maintenances";



export default function MaintenanceList() {
  const [loading, setLoading] = useState(true);
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const maintenanceData = await getMaintenances();
        setMaintenances(maintenanceData);
      } catch (error) {
        console.error("Error fetching maintenances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteMaintenance(id);
      setMaintenances((prev) => prev.filter((m) => m._id !== id)); 
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  }

  if (!loading && maintenances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2a4 4 0 014-4h4m0 0V7a4 4 0 00-8 0v4m8 0a4 4 0 11-8 0"
          />
        </svg>
        <p className="text-lg">Aucun enregistrement de maintenance</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <SpinnerLoading />
        </div>
      ) : (
        maintenances.map((maintenance) => (
          <MaintenanceCard
            key={maintenance._id}
            {...maintenance}
            deleteMaintenance={handleDelete}
          />
        ))
      )}
    </div>
  );
}
