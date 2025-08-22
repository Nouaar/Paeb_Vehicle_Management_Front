"use client";

import { useState } from "react";
import { SpinnerLoading } from "../ui/SpinnerLoading";

export interface UserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

interface UserFormProps {
  initialData?: UserData;
  onSubmit: (data: UserData) => Promise<void>;
  submitLabel?: string;
}

export default function UserForm({ initialData, onSubmit, submitLabel = "Ajouter l'utilisateur" }: UserFormProps) {
  const [formData, setFormData] = useState<UserData>(initialData || {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "user",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UserData, string>>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (errors[name as keyof UserData]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UserData, string>> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis";
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.password && !initialData?._id) newErrors.password = "Le mot de passe est requis";
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold">
              {initialData?._id ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
            </h1>
            <p className="opacity-90 mt-1">
              {initialData?._id 
                ? "Mettez à jour les informations de l'utilisateur" 
                : "Ajoutez un nouvel utilisateur au système"
              }
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Jean"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: Dupont"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Ex: jean.dupont@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Mot de passe {!initialData?._id && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={initialData?._id ? "Laisser vide pour ne pas modifier" : "Saisissez un mot de passe"}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
                {initialData?._id && (
                  <p className="text-sm text-gray-500 mt-1">
                    Laisser le champ vide pour conserver le mot de passe actuel
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role || "user"}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition flex items-center disabled:opacity-50"
              >
                {loading ? (
                        <SpinnerLoading />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {submitLabel}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}