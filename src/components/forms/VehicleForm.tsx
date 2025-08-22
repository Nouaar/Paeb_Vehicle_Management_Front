"use client";

import { useState, useEffect } from "react";

export interface VehicleData {
  _id?: string;
  dateAjout: string;
  typeVehicule: "voiture" | "camion" | "moto" | "bus";
  marque: string;
  modele: string;
  annee: string;
  couleur: string;
  plaqueImmatriculation: string;
  kilometrage: string;
  statut: "disponible" | "en-utilisation" | "en-maintenance";
  conducteurs: string[];
}

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
}

interface VehicleFormProps {
  initialData?: VehicleData;
  onSubmit: (data: VehicleData) => Promise<void>;
  submitLabel?: string;
}

export default function VehicleForm({ initialData, onSubmit, submitLabel = "Ajouter le véhicule" }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleData>(initialData || {
    dateAjout: new Date().toISOString().split('T')[0], // Default to today
    typeVehicule: "voiture",
    marque: "",
    modele: "",
    annee: "",
    couleur: "",
    plaqueImmatriculation: "",
    kilometrage: "",
    statut: "disponible",
    conducteurs: [],
  });

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof VehicleData, string>>>({});
  const [loading, setLoading] = useState(false);

  // Fetch drivers
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/users");
        if (!response.ok) throw new Error("Erreur lors du chargement des conducteurs");
        const data = await response.json();
        setDrivers(data);
      } catch (err) {
        console.error("Erreur fetch conducteurs :", err);
        alert("Impossible de charger la liste des conducteurs");
      }
    };
    fetchDrivers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof VehicleData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleDriversChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, conducteurs: selectedOptions }));
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof VehicleData, string>> = {};
    if (!formData.marque) newErrors.marque = "La marque est requise";
    if (!formData.modele) newErrors.modele = "Le modèle est requis";
    if (!formData.annee) newErrors.annee = "L'année est requise";
    if (!formData.couleur) newErrors.couleur = "La couleur est requise";
    if (!formData.plaqueImmatriculation) newErrors.plaqueImmatriculation = "La plaque d'immatriculation est requise";
    if (!formData.kilometrage) newErrors.kilometrage = "Le kilométrage est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {initialData?._id ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}
          </h1>
          <p className="opacity-90 mt-1">
            {initialData?._id 
              ? "Mettez à jour les informations du véhicule" 
              : "Renseignez les informations du nouveau véhicule"
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Marque *</label>
              <input
                name="marque"
                value={formData.marque}
                onChange={handleChange}
                placeholder="Ex: Toyota, Renault, Ford..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.marque ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.marque && <p className="text-red-500 text-xs mt-1">{errors.marque}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Modèle *</label>
              <input
                name="modele"
                value={formData.modele}
                onChange={handleChange}
                placeholder="Ex: Corolla, Clio, Focus..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.modele ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.modele && <p className="text-red-500 text-xs mt-1">{errors.modele}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Année *</label>
              <input
                type="number"
                name="annee"
                value={formData.annee}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear() + 1}
                placeholder="Ex: 2022"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.annee ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.annee && <p className="text-red-500 text-xs mt-1">{errors.annee}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Couleur *</label>
              <input
                name="couleur"
                value={formData.couleur}
                onChange={handleChange}
                placeholder="Ex: Rouge, Bleu, Noir..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.couleur ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.couleur && <p className="text-red-500 text-xs mt-1">{errors.couleur}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Plaque d'immatriculation *</label>
              <input
                name="plaqueImmatriculation"
                value={formData.plaqueImmatriculation}
                onChange={handleChange}
                placeholder="Ex: AB-123-CD"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase ${
                  errors.plaqueImmatriculation ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.plaqueImmatriculation && <p className="text-red-500 text-xs mt-1">{errors.plaqueImmatriculation}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Kilométrage *</label>
              <input
                type="number"
                name="kilometrage"
                value={formData.kilometrage}
                onChange={handleChange}
                min="0"
                placeholder="Ex: 15000"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  errors.kilometrage ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.kilometrage && <p className="text-red-500 text-xs mt-1">{errors.kilometrage}</p>}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Type de véhicule *</label>
              <select
                name="typeVehicule"
                value={formData.typeVehicule}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="voiture">Voiture</option>
                <option value="camion">Camion</option>
                <option value="moto">Moto</option>
                <option value="bus">Bus</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Statut *</label>
              <div className="grid grid-cols-1 gap-3 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="statut"
                    value="disponible"
                    checked={formData.statut === "disponible"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">Disponible</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="statut"
                    value="en-utilisation"
                    checked={formData.statut === "en-utilisation"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">En utilisation</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="statut"
                    value="en-maintenance"
                    checked={formData.statut === "en-maintenance"}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2">En maintenance</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Conducteurs assignés</label>
            <p className="text-sm text-gray-500 mb-2">Maintenez Ctrl/Cmd pour sélectionner plusieurs conducteurs</p>
            <select
              multiple
              value={formData.conducteurs}
              onChange={handleDriversChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px]"
            >
              {drivers.map((driver) => (
                <option key={driver._id} value={driver._id}>
                  {driver.firstName} {driver.lastName}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-1">
              {formData.conducteurs.length} conducteur(s) sélectionné(s)
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Traitement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}