"use client";
import Link from "next/link";
import { useState } from "react";
import Swal from "sweetalert2";
import { Vehicle } from "@/types/vehicle";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export interface VehicleCardProps extends Vehicle {
  alertDateVisiteTechnique: string | number | Date;
  deleteVehicle?: (id: string) => void;
  sellVehicle?: (id: string) => void;
}

// Helpers
const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "Non renseignée";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Date invalide";
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPrice = (price?: number) => {
  if (!price) return "Non renseigné";
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
};

const formatMileage = (km: number) => {
  return new Intl.NumberFormat('fr-FR').format(km);
};

const VehicleCard: React.FC<VehicleCardProps> = ({
  _id,
  dateMiseEnCirculation,
  typeVehicule,
  marque,
  modele,
  annee,
  couleur,
  plaqueImmatriculation,
  kilometrage,
  statut,
  prix,
  conducteurs = [],
  maintenances = [],
  totalCoutMaintenance = 0,
  deleteVehicle = () => {},
  sellVehicle = () => {},
}) => {

  const [showDrivers, setShowDrivers] = useState(false);
  const [showMaintenances, setShowMaintenances] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  const getStatusColor = (status: Vehicle["statut"]) => {
    switch (status) {
      case "disponible":
        return "bg-green-100 text-green-800 border-green-200";
      case "en-utilisation":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "en-maintenance":
        return "bg-red-100 text-red-800 border-red-200";
      case "vendu":
        return "bg-slate-100 text-slate-800 border-slate-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: Vehicle["statut"]) => {
    switch (status) {
      case "disponible":
        return "✅";
      case "en-utilisation":
        return "🔄";
      case "en-maintenance":
        return "🔧";
      case "vendu":
        return "💰";
      default:
        return "ℹ️";
    }
  };

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
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (result.isConfirmed) {
      deleteVehicle(_id!);
      Swal.fire({
        title: "Supprimé !",
        text: "Le véhicule a été supprimé.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleSell = async (vehiculeId: string) => {
    const { value: formValues } = await Swal.fire({
      title: "Vente du véhicule",
      html:
        '<input id="prixVente" type="number" class="swal2-input" placeholder="Prix de vente (€)">' +
        '<input id="dateVente" type="date" class="swal2-input" placeholder="Date de vente">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Confirmer la vente",
      cancelButtonText: "Annuler",
      preConfirm: () => {
        const prixVente = (document.getElementById("prixVente") as HTMLInputElement).value;
        const dateVente = (document.getElementById("dateVente") as HTMLInputElement).value;
        if (!prixVente || !dateVente) {
          Swal.showValidationMessage("Veuillez remplir tous les champs");
        }
        return { prixVente, dateVente };
      },
    });

    if (formValues) {
      try {
        const res = await axios.put(
          `http://localhost:3001/api/vehicles/vendre/${vehiculeId}`,
          {
            prixVente: Number(formValues.prixVente),
            dateVente: formValues.dateVente,
          }
        );
        Swal.fire({
          title: "Succès !",
          text: "Véhicule vendu avec succès",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire("Erreur", "Impossible de vendre le véhicule", "error");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg "
    >
      {/* Header */}
      <div className="p-5 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100 relative">
        <motion.div
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 text-3xl"
        >

        </motion.div>
        
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 truncate">
              {marque} {modele}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {annee} • {couleur}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Ajouté le {formatDate(dateMiseEnCirculation ?? undefined)}
            </p>
          </div>
          
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(statut)}`}>
            <span className="text-sm">{getStatusIcon(statut)}</span>
            <span className="text-xs font-medium capitalize">
              {statut.replace("-", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Plaque</span>
            <div className="font-mono text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {plaqueImmatriculation ?? "—"}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kilométrage</span>
            <div className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
              {kilometrage !== undefined && kilometrage !== null
                ? `${formatMileage(kilometrage)} km`
                : "—"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Prix</span>
            <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              {formatPrice(prix)}
            </div>
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Coût maintenance</span>
            <div className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              {formatPrice(totalCoutMaintenance)}
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-3">
          {/* Conducteurs Section */}
          <motion.div 
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={false}
            animate={{ height: showDrivers ? "auto" : "48px" }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowDrivers(!showDrivers)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-blue-600 mr-2">👥</span>
                <span className="text-sm font-medium text-gray-700">Conducteurs</span>
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {conducteurs.length}
                </span>
              </div>
              <motion.span
                animate={{ rotate: showDrivers ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
              >
                ▼
              </motion.span>
            </button>
            
            <AnimatePresence>
              {showDrivers && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-3 border-t border-gray-200"
                >
                  {conducteurs.length > 0 ? (
                    <div className="space-y-2">
                      {conducteurs.map((c) => (
                        <div key={c._id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium text-sm mr-3">
                            {c.firstName?.charAt(0)}{c.lastName?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {c.firstName} {c.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              ID: {c._id?.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-3 italic">
                      Aucun conducteur assigné
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Maintenances Section */}
          <motion.div 
            className="border border-gray-200 rounded-lg overflow-hidden"
            initial={false}
            animate={{ height: showMaintenances ? "auto" : "48px" }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowMaintenances(!showMaintenances)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-red-600 mr-2">🔧</span>
                <span className="text-sm font-medium text-gray-700">Maintenances</span>
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {maintenances.length}
                </span>
              </div>
              <motion.span
                animate={{ rotate: showMaintenances ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
              >
                ▼
              </motion.span>
            </button>
            
            <AnimatePresence>
              {showMaintenances && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-3 border-t border-gray-200"
                >
                  {maintenances.length > 0 ? (
                    <div className="space-y-2">
                      {maintenances.map((m) => (
                        <div key={m._id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900 capitalize">
                              {m.typeMaintenance}
                            </span>
                            <span className="text-sm font-semibold text-red-600">
                              {formatPrice(m.coutTotal)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {formatDate(m.dateEntretien)}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {m.detailIntervention}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-3 italic">
                      Aucune maintenance enregistrée
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-wrap space-x-2 space-y-2 margin-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={`/vehicles/update/${_id}`}
              className="inline-flex items-center px-3 py-2 bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 text-sm font-medium transition-colors shadow-sm"
            >
              <span className="mr-1">✏️</span>
              Modifier
            </Link>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors shadow-sm"
            >
              <span className="mr-1">🗑️</span>
              Supprimer
            </button>
          </motion.div>
          
          {statut !== "vendu" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => handleSell(_id!)}
                className="inline-flex items-center px-3 py-2 bg-white text-green-600 rounded-lg border border-green-200 hover:bg-green-50 text-sm font-medium transition-colors shadow-sm"
              >
                <span className="mr-1">💰</span>
                Vendre
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default VehicleCard;