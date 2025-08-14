  "use client";

  import React from "react";
  import Slide from "@/components/slide/Slide";
  import ProtectedRoute from "@/components/ProtectedRoute";
import MaintenanceForm from "./vehicles/maintenance/page";

  export default function Home() {
    return (<>
    <ProtectedRoute>
      <Slide />
      <MaintenanceForm />
    </ProtectedRoute>
    
    </>
    );
  }

