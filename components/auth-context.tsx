"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, signIn as _signIn, signUp as _signUp, signOut as _signOut, type User, type SignUpInput } from "@/lib/auth";

type Ctx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (input: SignUpInput) => Promise<User>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getCurrentUser());
    setLoading(false);
    const onChange = () => setUser(getCurrentUser());
    window.addEventListener("bads-auth-change", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("bads-auth-change", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const value: Ctx = {
    user,
    loading,
    signIn: async (e, p) => { const u = await _signIn(e, p); setUser(u); return u; },
    signUp: async (i)    => { const u = await _signUp(i);    setUser(u); return u; },
    signOut: async ()    => { await _signOut(); setUser(null); },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}
