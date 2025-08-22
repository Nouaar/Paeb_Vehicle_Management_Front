"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/components/forms/UserForm";
import { addUser } from "@/services/user";

export default function AddUserPage() {
  const router = useRouter();

  const handleAdd = async (data: any) => {
    try {
      await addUser(data);
      alert("Utilisateur ajouté avec succès !");
      router.push("/users");
    } catch (error: any) {
      console.error("Error adding user:", error);
      alert(`Une erreur s'est produite : ${error.message}`);
    }
  };

  return <UserForm onSubmit={handleAdd} />;
}