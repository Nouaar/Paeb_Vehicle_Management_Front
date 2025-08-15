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

  useEffect(() => {
  
    const fetchVehicles = async () => {
      try {
        const vehicleData = await getVehicles();
        setVehicles(vehicleData);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    }
     
    fetchVehicles()
    
  }, []);


  console.log("Available vehicles:", vehicles);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "dateEntretien" && value) {
      const date = new Date(value);
      if (isNaN(date.getTime())) return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const dataToSave = {
        ...formData,
        kilometrage: Number(formData.kilometrage),
        coutTotal: Number(formData.coutTotal),
      };

      console.log("Data to save:", dataToSave);

      const response = await addMaintenance(dataToSave);
      setSavedData(response.data);

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
    } finally {
      setLoading(false);
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

        {/* Véhicule */}
        <div>
          <label className="block font-medium">Véhicule *</label>
          <select
            name="vehicule"
            value={formData.vehicule}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          >
            <option value="">-- Sélectionner un véhicule --</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.marque} {v.modele} ({v.plaqueImmatriculation})
              </option>
            ))}
          </select>
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
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      {savedData && (
        <div className="max-w-lg mx-auto mt-6 p-4 border rounded bg-green-50">
          <h2 className="text-lg font-semibold mb-2">Maintenance enregistrée :</h2>
          <pre className="whitespace-pre-wrap text-sm">
            {JSON.stringify(savedData, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
}
