"use client";
import Link from "next/link";

interface VehicleCardProps {
  dateAdded: Date;
  vehicleType: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  kilometrage: number;
  status: "available" | "in-use" | "maintenance";
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  dateAdded,
  vehicleType,
  brand,
  model,
  year,
  color,
  licensePlate,
  kilometrage,
  status
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h3 className="text-lg font-bold">{brand} {model} ({year})</h3>
      <p className="text-sm text-gray-600">{vehicleType} - {color}</p>
      <p>License Plate: {licensePlate}</p>
      <p>Kilometrage: {kilometrage} km</p>
      <p>Status: <span className="font-semibold">{status}</span></p>
      <p className="text-xs text-gray-500">
        Added: {new Date(dateAdded).toLocaleDateString()}
      </p>
      <Link
        href={`/vehicles/${licensePlate}`}
        className="text-blue-500 hover:underline mt-2 inline-block"
      >
        View Details
      </Link>
    </div>
  );
};

export default VehicleCard;
