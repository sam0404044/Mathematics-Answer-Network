"use client";
import { createContext, useState, useEffect, ReactNode } from "react";

type User = {
  uid: number;
  username: string;
  email: string;
};

type AuthContextType = {
  isLogin: string | boolean;
  setIsLogin: React.Dispatch<React.SetStateAction<string | boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  uid: User | null;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogin, setIsLogin] = useState<string | boolean>("loading");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loginStatus = async () => {
      try {
        const res = await fetch("/api/user/me", { credentials: "include" });
        if (!res.ok) {
          setIsLogin(false);
          return;
        }
        const data = await res.json();
        if (data.uid) {
          setIsLogin(true);
          setUser(data);
        } else {
          setIsLogin(false);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setIsLogin(false);
      }
    };
    loginStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
