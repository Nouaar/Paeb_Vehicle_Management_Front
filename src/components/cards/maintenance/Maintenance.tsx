"use client";
import Swal from "sweetalert2";
import Link from "next/link";
import { Maintenance } from "@/types/maintenance";

interface MaintenanceCardProps extends Maintenance {
  deleteMaintenance: (id: string) => void;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  _id,
  typeMaintenance,
  vehicule,
  kilometrage,
  dateEntretien,
  detailIntervention,
  coutTotal,
  fournisseurPieces,
  garage,
  deleteMaintenance,
}) => {
  const handleDelete = () => {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, supprimer !",
      cancelButtonText: "Annuler",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMaintenance(_id!);
        Swal.fire("Supprimé !", "L'enregistrement a été supprimé.", "success");
      }
    });
  };

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "TND",
    }).format(amount);

  // Format mileage
  const formatMileage = (km: number) =>
    km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Format date
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Card Header */}
      <div className="flex justify-between items-start p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {typeof vehicule !== "string" ? `${vehicule?.marque} ${vehicule?.modele}` : "Véhicule"}
          </h3>
          <p className="text-sm text-gray-600">
            {typeof vehicule !== "string" ? vehicule?.plaqueImmatriculation : "N/A"} •{" "}
            {formatMileage(kilometrage)} km
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-600">{formatCurrency(coutTotal)}</div>
          <div className="text-sm text-gray-500">{formatDate(dateEntretien)}</div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-2">
        <p>
          <span className="font-medium">Type :</span> {typeMaintenance}
        </p>
        <p>
          <span className="font-medium">Détails :</span> {detailIntervention}
        </p>
        <p>
          <span className="font-medium">Garage :</span> {garage || "Non spécifié"}
        </p>
        <p>
          <span className="font-medium">Fournisseur :</span> {fournisseurPieces || "Non spécifié"}
        </p>
      </div>

      {/* Card Footer */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleDateString("fr-FR")}
        </div>
        <div className="flex space-x-2">
          <Link
            href={`/maintenance/edit/${_id}`}
            className="px-3 py-2 bg-white text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm font-medium"
          >
            Modifier
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-2 bg-white text-red-600 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceCard;
