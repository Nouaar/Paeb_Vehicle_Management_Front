  "use client";

  import React from "react";
  import Slide from "@/components/slide/Slide";
  import ProtectedRoute from "@/components/ProtectedRoute";

  export default function Home() {
    return (<>
    <ProtectedRoute>
      <Slide />
    </ProtectedRoute>
    
    </>
    );
  }

