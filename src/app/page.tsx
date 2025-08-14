  "use client";

  import React from "react";
  import Slide from "@/components/slide/Slide";
  import ProtectedRoute from "@/components/ProtectedRoute";
import MaintenanceForm from "./vehicles/maintenance/Add_Update/[id]/page";
import VehiculeForm from "./vehicles/Add_Update/[id]/VehiculeForm";

  export default function Home() {
    return (<>
    <ProtectedRoute>
      <Slide />
      <VehiculeForm/>
    </ProtectedRoute>
    
    </>
    );
  }

