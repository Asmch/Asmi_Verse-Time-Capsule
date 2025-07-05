"use client";

import { createContext, useContext } from "react";
import { useSession, signOut } from "next-auth/react";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  id?: string;
}

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const user = session?.user ? (session.user as User) : null;
  const loading = status === "loading";

  // setUser is a no-op for compatibility
  const setUser = () => {};

  const logout = () => {
    signOut({ callbackUrl: "/Login" });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
