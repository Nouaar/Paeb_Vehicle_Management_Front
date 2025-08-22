"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/forms/UserForm";
import { updateUser, getUserById } from "@/services/user";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";

export default function UpdateUserPage() {
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(id);
        setInitialData(data);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Impossible de charger les données de l'utilisateur");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  const handleUpdate = async (data: any) => {
    try {
      await updateUser(id, data);
      alert("Utilisateur mis à jour avec succès !");
      router.push("/users");
    } catch (error: any) {
      console.error("Error updating user:", error);
      alert(`Une erreur s'est produite : ${error.message}`);
    }
  };

  if (loading) {
    return (
      <SpinnerLoading />
    );
  }

  return (
    <UserForm 
      initialData={initialData} 
      onSubmit={handleUpdate} 
      submitLabel="Mettre à jour l'utilisateur" 
    />
  );
}