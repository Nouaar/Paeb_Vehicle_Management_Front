"use client";

import { useState } from "react";

export default function MaintenanceForm() {
  const [formData, setFormData] = useState({
    typeMaintenance: "",
    vehicule: "",
    kilometrage: "",
    dateEntretien: "",
    detailIntervention: "",
    coutTotal: "",
    fournisseurPieces: "",
    garage: "",
  });

  const [savedData, setSavedData] = useState(null); 

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "dateEntretien") {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (value !== "" && !dateRegex.test(value)) {
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const dataToSave = {
      ...formData,
      kilometrage: Number(formData.kilometrage),
      coutTotal: Number(formData.coutTotal),
    };

    const response = await fetch("http://localhost:3001/api/maintenances", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'enregistrement");
    }

    const result = await response.json();

    setSavedData(result);

    alert("Maintenance ajoutée avec succès !");

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
  } catch (error: any) {
    console.error(error);
    alert(`Une erreur est survenue : ${error.message}`);
  }
};
   

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto p-4 space-y-4 bg-white shadow rounded"
      >
        {/* Type de maintenance */}
        <div>
          <label className="block font-medium">Type de maintenance *</label>
          <select
            name="typeMaintenance"
            value={formData.typeMaintenance}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">-- Sélectionner --</option>
            <option value="entretien">Entretien</option>
            <option value="réparation">Réparation</option>
          </select>
        </div>

        {/* Véhicule (ObjectId) */}
        <div>
          <label className="block font-medium">Véhicule *</label>
          <input
            type="text"
            name="vehicule"
            value={formData.vehicule}
            onChange={handleChange}
            placeholder="ID du véhicule"
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Kilométrage */}
        <div>
          <label className="block font-medium">Kilométrage *</label>
          <input
            type="number"
            name="kilometrage"
            min={0}
            value={formData.kilometrage}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Date d'entretien */}
        <div>
          <label className="block font-medium">Date d'entretien *</label>
          <input
            type="date"
            name="dateEntretien"
            value={formData.dateEntretien}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Détail de l'intervention */}
        <div>
          <label className="block font-medium">Détail de l'intervention *</label>
          <textarea
            name="detailIntervention"
            value={formData.detailIntervention}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Coût total */}
        <div>
          <label className="block font-medium">Coût total *</label>
          <input
            type="number"
            name="coutTotal"
            min={0}
            value={formData.coutTotal}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {/* Fournisseur des pièces */}
        <div>
          <label className="block font-medium">Fournisseur des pièces</label>
          <input
            type="text"
            name="fournisseurPieces"
            value={formData.fournisseurPieces}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Garage */}
        <div>
          <label className="block font-medium">Garage</label>
          <input
            type="text"
            name="garage"
            value={formData.garage}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>

      {savedData && (
        <div className="max-w-lg mx-auto mt-6 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold mb-2">Maintenance enregistrée :</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(savedData, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
