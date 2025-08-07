"use client";

import React, { useState } from "react";

export default function MaintenanceForm() {
  const [form, setForm] = useState({
    identEntretien: "",
    identVehicule: "",
    immatriculation: "",
    marque: "",
    modele: "",
    kilometrage: "",
    dateEntretien: "",
    typeEntretien: "",
    coutEntretien: "",
    fournisseurPRecharge: "",
    garageEntretien: "",
    annee: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted with data: " + JSON.stringify(form, null, 2));
  };

  const handleCancel = () => {
    alert("Form cancelled");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 bg-gray-200 p-6 rounded-md shadow-md"
    >
      <h2 className="text-xl font-semibold mb-6">Fiche Entretien</h2>

      {[
        { label: "Identifiant de Entretien", name: "identEntretien", type: "text" },
        { label: "Identifiant de véhicule", name: "identVehicule", type: "text" },
        { label: "Immatriculation", name: "immatriculation", type: "text" },
        { label: "Marque", name: "marque", type: "text" },
        { label: "Modèle", name: "modele", type: "text" },
        { label: "Kilométrage", name: "kilometrage", type: "text" },
        { label: "Date d'Entretien", name: "dateEntretien", type: "date" },
        { label: "Type d'Entretien", name: "typeEntretien", type: "text" },
        { label: "Coût d'Entretien", name: "coutEntretien", type: "text" },
        { label: "Fournisseur P. Recharge", name: "fournisseurPRecharge", type: "text" },
        { label: "Garage d'Entretien", name: "garageEntretien", type: "text" },
        { label: "Année", name: "annee", type: "text" },
      ].map(({ label, name, type }) => (
        <div key={name} className="flex items-center mb-3">
          <label htmlFor={name} className="w-40 font-medium">
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            value={form[name as keyof typeof form]}
            onChange={handleChange}
            className="border border-gray-400 rounded px-2 py-1 w-full bg-white"
          />
        </div>
      ))}

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 transition"
        >
          <span>Valider</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded shadow hover:bg-yellow-500 transition"
        >
          <span>Annuler</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </form>
  );
}
