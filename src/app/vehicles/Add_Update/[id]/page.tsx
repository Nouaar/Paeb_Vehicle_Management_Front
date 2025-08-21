"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VehiculeForm() {
  const { id } = useParams(); // id du véhicule pour la mise à jour
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [conducteursList, setConducteursList] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    dateAjout: "",
    typeVehicule: "voiture",
    marque: "",
    modele: "",
    annee: "",
    couleur: "",
    plaqueImmatriculation: "",
    kilometrage: "",
    statut: "disponible",
    conducteurs: [] as string[],
  });

  // Fetch conducteurs
  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => res.json())
      .then((data) => setConducteursList(data))
      .catch((err) => console.error("Erreur fetch conducteurs :", err));
  }, []);

  // Fetch véhicule si id existe (édition)
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    fetch(`http://localhost:3001/api/vehicles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          dateAjout: data.dateAjout || "",
          typeVehicule: data.typeVehicule || "voiture",
          marque: data.marque || "",
          modele: data.modele || "",
          annee: data.annee || "",
          couleur: data.couleur || "",
          plaqueImmatriculation: data.plaqueImmatriculation || "",
          kilometrage: data.kilometrage || "",
          statut: data.statut || "disponible",
          conducteurs: data.conducteurs?.map((c: any) => c._id) || [],
        });
      })
      .catch((err) => console.error("Erreur fetch véhicule :", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConducteursChange = (e: any) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option: any) => option.value
    );
    setFormData((prev) => ({ ...prev, conducteurs: selectedOptions }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = id
        ? `http://localhost:3001/api/vehicles/${id}`
        : "http://localhost:3001/api/vehicles";
      const method = id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      const result = await res.json();
      console.log("✅ Succès :", result);

      // Redirection vers liste véhicules
      router.push("/vehicles");
    } catch (err) {
      console.error("❌ Erreur :", err);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {id ? "Modifier le véhicule" : "Ajouter un nouveau véhicule"}
          </h1>
          <p className="opacity-90 mt-1">
            {id ? "Mettez à jour les informations du véhicule" : "Renseignez les informations du nouveau véhicule"}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Modèle *</label>
              <input
                name="modele"
                value={formData.modele}
                onChange={handleChange}
                placeholder="Ex: Corolla, Clio, Focus..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Couleur *</label>
              <input
                name="couleur"
                value={formData.couleur}
                onChange={handleChange}
                placeholder="Ex: Rouge, Bleu, Noir..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Plaque d'immatriculation *</label>
              <input
                name="plaqueImmatriculation"
                value={formData.plaqueImmatriculation}
                onChange={handleChange}
                placeholder="Ex: AB-123-CD"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition uppercase"
                required
              />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
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
              onChange={handleConducteursChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px]"
            >
              {conducteursList.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.firstName} {c.lastName}
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
              onClick={() => router.push("/vehicles")}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {id ? "Mettre à jour" : "Ajouter le véhicule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}