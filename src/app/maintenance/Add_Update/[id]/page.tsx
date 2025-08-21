"use client";

import { useState, useEffect } from "react";
import { addMaintenance } from "@/services/maintenances";
import { getVehicles } from "@/services/vehicles";

interface MaintenanceData {
  typeMaintenance: "entretien" | "réparation" | "";
  vehicule: string;
  kilometrage: number | string;
  dateEntretien: string;
  detailIntervention: string;
  coutTotal: number | string;
  fournisseurPieces?: string;
  garage?: string;
}

interface Vehicle {
  _id: string;
  marque: string;
  modele: string;
  plaqueImmatriculation: string;
}

export default function MaintenanceForm() {
  const [formData, setFormData] = useState<MaintenanceData>({
    typeMaintenance: "",
    vehicule: "",
    kilometrage: "",
    dateEntretien: "",
    detailIntervention: "",
    coutTotal: "",
    fournisseurPieces: "",
    garage: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [savedData, setSavedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof MaintenanceData, string>>>({});

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const vehicleData = await getVehicles();
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
     
    fetchVehicles();
  }, []);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof MaintenanceData, string>> = {};
    
    if (!formData.typeMaintenance) newErrors.typeMaintenance = "Le type de maintenance est requis";
    if (!formData.vehicule) newErrors.vehicule = "Veuillez sélectionner un véhicule";
    if (!formData.kilometrage) newErrors.kilometrage = "Le kilométrage est requis";
    if (!formData.dateEntretien) newErrors.dateEntretien = "La date d'entretien est requise";
    if (!formData.detailIntervention) newErrors.detailIntervention = "Le détail de l'intervention est requis";
    if (!formData.coutTotal) newErrors.coutTotal = "Le coût total est requis";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "dateEntretien" && value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) return;
    }

    // Clear error when field is edited
    if (errors[name as keyof MaintenanceData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        kilometrage: Number(formData.kilometrage),
        coutTotal: Number(formData.coutTotal),
      };

      const response = await addMaintenance(dataToSave);
      setSavedData(response.data);

      // Reset form
      setFormData({
        typeMaintenance: "",
        vehicule: "",
        kilometrage: "",
        dateEntretien: "",
        detailIntervention: "",
        coutTotal: "",
        fournisseurPieces: "",
        garage: "",
      });
      
      setErrors({});
    } catch (error: any) {
      console.error(error);
      alert(`Une erreur est survenue : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Nouvelle maintenance</h1>
            <p className="opacity-90 mt-1">Enregistrez une nouvelle intervention sur votre flotte</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type de maintenance */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Type de maintenance <span className="text-red-500">*</span>
                </label>
                <select
                  name="typeMaintenance"
                  value={formData.typeMaintenance}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.typeMaintenance ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Sélectionner --</option>
                  <option value="entretien">Entretien</option>
                  <option value="réparation">Réparation</option>
                </select>
                {errors.typeMaintenance && (
                  <p className="text-red-500 text-xs mt-1">{errors.typeMaintenance}</p>
                )}
              </div>

              {/* Véhicule */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Véhicule <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehicule"
                  value={formData.vehicule}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.vehicule ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Sélectionner un véhicule --</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.marque} {v.modele} ({v.plaqueImmatriculation})
                    </option>
                  ))}
                </select>
                {errors.vehicule && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicule}</p>
                )}
              </div>

              {/* Kilométrage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Kilométrage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="kilometrage"
                  min={0}
                  value={formData.kilometrage}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.kilometrage ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: 50000"
                />
                {errors.kilometrage && (
                  <p className="text-red-500 text-xs mt-1">{errors.kilometrage}</p>
                )}
              </div>

              {/* Date d'entretien */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date d'entretien <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateEntretien"
                  value={formData.dateEntretien}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.dateEntretien ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dateEntretien && (
                  <p className="text-red-500 text-xs mt-1">{errors.dateEntretien}</p>
                )}
              </div>

              {/* Coût total */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Coût total (TND) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">€</span>
                  <input
                    type="number"
                    name="coutTotal"
                    min={0}
                    step="0.01"
                    value={formData.coutTotal}
                    onChange={handleChange}
                    required
                    className={`w-full pl-8 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.coutTotal ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.coutTotal && (
                  <p className="text-red-500 text-xs mt-1">{errors.coutTotal}</p>
                )}
              </div>
            </div>

            {/* Détail de l'intervention */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Détail de l'intervention <span className="text-red-500">*</span>
              </label>
              <textarea
                name="detailIntervention"
                value={formData.detailIntervention}
                onChange={handleChange}
                required
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.detailIntervention ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Décrivez en détail l'intervention effectuée..."
              />
              {errors.detailIntervention && (
                <p className="text-red-500 text-xs mt-1">{errors.detailIntervention}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fournisseur des pièces */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Fournisseur des pièces
                </label>
                <input
                  type="text"
                  name="fournisseurPieces"
                  value={formData.fournisseurPieces}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nom du fournisseur"
                />
              </div>

              {/* Garage */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Garage
                </label>
                <input
                  type="text"
                  name="garage"
                  value={formData.garage}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Nom du garage"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition flex items-center justify-center font-medium"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Enregistrer la maintenance
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {savedData && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-green-800 font-medium">Maintenance enregistrée avec succès !</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Votre intervention a été correctement enregistrée dans le système.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}