"use client";
import React, { useState, useEffect } from "react";
import { getVehicles, deleteVehicle } from "@/services/vehicles";
import VehicleCard from "@/components/cards/vehicles/Vehicle";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import type { VehicleCardProps } from "@/components/cards/vehicles/Vehicle";

const Vehicles = () => {
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<VehicleCardProps[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleData: VehicleCardProps[] = await getVehicles();
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // 🛠️ Supprimer véhicule et mettre à jour le state
  const handleDelete = async (id: string) => {
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((v) => v._id !== id)); // on supprime du state
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Liste des véhicules</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <SpinnerLoading />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle._id}
              {...vehicle}
              deleteVehicle={handleDelete} // 👈 on passe la bonne fonction
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vehicles;
