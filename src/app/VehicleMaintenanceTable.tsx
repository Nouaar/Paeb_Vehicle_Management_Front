"use client";

import React from "react";

interface MaintenanceRecord {
  immatriculation: string;
  marque: string;
  modele: string;
  kilometrage: number;
  dateEntretien: string; // e.g. "29/06/2018"
  typeEntretien: string;
  coutEntretien: number;
  fournisseurPRecharge: string;
  garageEntretien: string;
}

interface Props {
  data: MaintenanceRecord[];
}

export default function VehicleMaintenanceTable({ data }: Props) {
  return (
    <div className="overflow-auto max-h-[500px] border rounded">
      <table className="min-w-full border-collapse border border-gray-300 text-sm">
        <thead className="bg-yellow-400 text-gray-800">
          <tr>
            <th className="border border-gray-300 px-2 py-1">Immatriculation</th>
            <th className="border border-gray-300 px-2 py-1">Marque</th>
            <th className="border border-gray-300 px-2 py-1">Modèle</th>
            <th className="border border-gray-300 px-2 py-1">Kilométrage</th>
            <th className="border border-gray-300 px-2 py-1">Date d'Entretien</th>
            <th className="border border-gray-300 px-2 py-1">Type d'Entretien</th>
            <th className="border border-gray-300 px-2 py-1">Coût d'Entretien</th>
            <th className="border border-gray-300 px-2 py-1">Fournisseur P. Recharge</th>
            <th className="border border-gray-300 px-2 py-1">Garage d'Entretien</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
                Aucun enregistrement
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="border border-gray-300 px-2 py-1">{row.immatriculation}</td>
                <td className="border border-gray-300 px-2 py-1">{row.marque}</td>
                <td className="border border-gray-300 px-2 py-1">{row.modele}</td>
                <td className="border border-gray-300 px-2 py-1">{row.kilometrage}</td>
                <td className="border border-gray-300 px-2 py-1">{row.dateEntretien}</td>
                <td className="border border-gray-300 px-2 py-1">{row.typeEntretien}</td>
                <td className="border border-gray-300 px-2 py-1">{row.coutEntretien} €</td>
                <td className="border border-gray-300 px-2 py-1">{row.fournisseurPRecharge}</td>
                <td className="border border-gray-300 px-2 py-1">{row.garageEntretien}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
