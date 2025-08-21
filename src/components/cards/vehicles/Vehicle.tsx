"use client";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { Vehicle } from "@/types/vehicle";

export interface VehicleCardProps extends Vehicle {
  deleteVehicle?: (id: string) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  _id,
  dateAjout,
  typeVehicule,
  marque,
  modele,
  annee,
  couleur,
  plaqueImmatriculation,
  kilometrage,
  statut,
  conducteurs = [],
  deleteVehicle = () => {},
}) => {
  const [showDrivers, setShowDrivers] = useState(false);

  const getVehicleIcon = (type: Vehicle["typeVehicule"]) => {
    switch (type) {
      case "voiture":
        return "🚗";
      case "camion":
        return "🚚";
      case "moto":
        return "🏍️";
      case "bus":
        return "🚌";
      default:
        return "🚗";
    }
  };

  const getStatusColor = (status: Vehicle["statut"]) => {
    switch (status) {
      case "disponible":
        return "bg-green-100 text-green-800";
      case "en-utilisation":
        return "bg-orange-100 text-orange-800";
      case "en-maintenance":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatMileage = (km: number) =>
    km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action supprimera définitivement le véhicule.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      deleteVehicle(_id!);
      Swal.fire("Supprimé !", "Le véhicule a été supprimé.", "success");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
      {/* header */}
      <div className="flex justify-between items-start p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{getVehicleIcon(typeVehicule)}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {marque} {modele}
            </h3>
            <p className="text-sm text-gray-600">
              {annee} • {couleur}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(
            statut
          )}`}
        >
          {statut.replace("-", " ")}
        </span>
      </div>

      {/* body */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-xs text-gray-500 uppercase font-medium">
              Plaque
            </span>
            <div className="font-mono text-sm font-semibold bg-gray-100 px-2 py-1 rounded">
              {plaqueImmatriculation}
            </div>
          </div>
          <div>
            <span className="text-xs text-gray-500 uppercase font-medium">
              Kilométrage
            </span>
            <div className="text-sm font-semibold">
              {formatMileage(kilometrage)} km
            </div>
          </div>
        </div>

        {/* conducteurs */}
        <div className="mt-4">
          <button
            onClick={() => setShowDrivers(!showDrivers)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <svg
              className={`w-4 h-4 mr-1 transition-transform ${
                showDrivers ? "rotate-90" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
            Conducteurs ({conducteurs.length})
          </button>

          {showDrivers && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              {conducteurs.length > 0 ? (
                <ul className="space-y-2">
                  {conducteurs.map((c) => (
                    <li key={c._id} className="flex items-center text-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <span className="text-blue-600 font-semibold">
                          {c.firstName.charAt(0)}
                          {c.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {c.firstName} {c.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {c._id.substring(0, 8)}...
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  Aucun conducteur assigné
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          Ajouté le {new Date(dateAjout).toLocaleDateString("fr-FR")}
        </span>

        <div className="flex space-x-2">
          <Link
            href={`/vehicles/Add_Update/${_id}`}
            className="px-3 py-2 bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 text-sm font-medium"
          >
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-50 text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
