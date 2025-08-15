"use client";

import { useState, useEffect } from "react";

interface VehiculeFormProps {
  initialData?: any;
}

export default function VehiculeForm({ initialData }: VehiculeFormProps) {
  const [formData, setFormData] = useState({
    dateAjout: initialData?.dateAjout || "",
    typeVehicule: initialData?.typeVehicule || "voiture",
    marque: initialData?.marque || "",
    modele: initialData?.modele || "",
    annee: initialData?.annee || "",
    couleur: initialData?.couleur || "",
    plaqueImmatriculation: initialData?.plaqueImmatriculation || "",
    kilometrage: initialData?.kilometrage || "",
    statut: initialData?.statut || "disponible",
    conducteurs: initialData?.conducteurs || [],
  });

  const [conducteursList, setConducteursList] = useState<any[]>([]);

  // Fetch conducteurs
  useEffect(() => {
    fetch("http://localhost:3001/api/users")
      .then((res) => res.json())
      .then((data) => setConducteursList(data))
      .catch((err) => console.error("Erreur fetch conducteurs :", err));
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConducteursChange = (e: any) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option: any) => option.value);
    setFormData((prev) => ({ ...prev, conducteurs: selectedOptions }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const url = initialData
        ? `http://localhost:3001/api/vehicles/${initialData._id}`
        : "http://localhost:3001/api/vehicles";

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      const result = await res.json();
      console.log("✅ Succès :", result);

      // Réinitialiser le formulaire seulement si c'est un ajout
      if (!initialData) {
        setFormData({
          dateAjout: "",
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
      }
    } catch (err) {
      console.error("❌ Erreur :", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded">
      <input name="marque" value={formData.marque} onChange={handleChange} placeholder="Marque" className="border p-2 w-full" />
      <input name="modele" value={formData.modele} onChange={handleChange} placeholder="Modèle" className="border p-2 w-full" />
      <input type="number" name="annee" value={formData.annee} onChange={handleChange} placeholder="Année" className="border p-2 w-full" />
      <input name="couleur" value={formData.couleur} onChange={handleChange} placeholder="Couleur" className="border p-2 w-full" />
      <input name="plaqueImmatriculation" value={formData.plaqueImmatriculation} onChange={handleChange} placeholder="Plaque" className="border p-2 w-full" />
      <input type="number" name="kilometrage" value={formData.kilometrage} onChange={handleChange} placeholder="Kilométrage" className="border p-2 w-full" />

      <select name="typeVehicule" value={formData.typeVehicule} onChange={handleChange} className="border p-2 w-full">
        <option value="voiture">Voiture</option>
        <option value="camion">Camion</option>
        <option value="moto">Moto</option>
        <option value="bus">Bus</option>
      </select>

      <select name="statut" value={formData.statut} onChange={handleChange} className="border p-2 w-full">
        <option value="disponible">Disponible</option>
        <option value="en-utilisation">En utilisation</option>
        <option value="en-maintenance">En maintenance</option>
      </select>

      <label className="block">Conducteurs :</label>
      <select multiple value={formData.conducteurs} onChange={handleConducteursChange} className="border p-2 w-full">
        {conducteursList.map((c) => (
          <option key={c._id} value={c._id}>
            {c.firstName} {c.lastName}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialData ? "Mettre à jour" : "Ajouter"}
      </button>
    </form>
  );
}
