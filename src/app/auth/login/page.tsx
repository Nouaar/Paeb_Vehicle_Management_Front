"use client";

import React, { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { SpinnerLoading } from "@/components/ui/SpinnerLoading";
import { loginAccount } from "@/services/auth";
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginAccount(email, password);
      login(response.data.token);
      console.log("✅ Connexion réussie :", response.data);
    } catch (err: any) {
      setError(err.message || "Échec de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-6 relative overflow-hidden">
      {/* Forme décoratives */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-gray-300/30 rounded-full blur-3xl top-[-120px] left-[-150px]" />
        <div className="absolute w-[400px] h-[400px] bg-gray-400/20 rounded-full blur-3xl bottom-[-120px] right-[-100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl shadow-xl p-8"
      >
        {/* En-tête */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-800 rounded-2xl shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">Bienvenue</h1>
          <p className="text-gray-500 text-sm">
            Connectez-vous pour gérer vos véhicules
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none"
              placeholder="vous@exemple.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 text-gray-800 rounded border-gray-400 focus:ring-gray-700"
              />
              Se souvenir de moi
            </label>
            <a href="#" className="hover:text-gray-900 transition-colors">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium shadow-md hover:bg-gray-800 transition-transform transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? <SpinnerLoading /> : "Se connecter"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}