"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

type User = { token: string } | null;

type AuthContextType = {
  user: User;
  login: (token: string) => void;
  logout: () => void;
  loading : boolean ;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
    const token = localStorage.getItem("token");
    if (token) setUser({ token });

    }catch(error) {
      setUser(null) ; 
      console.error("Error retrieving token from localStorage:", error);
    }
    finally {
      setLoading(false)
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser({ token });
    setLoading(false);
    router.push("/"); 
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/login");
  };

  

  const value = useMemo(() => ({ user, login, logout , loading }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
