"use client";

import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: { id: string; email: string; username: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/sign-in", {
      email,
      password,
    });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    router.push("/products");
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/auth/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
