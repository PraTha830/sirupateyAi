import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isAuthed, loginWithUserId, logout as doLogout } from "./authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(isAuthed());

  useEffect(() => setAuthed(isAuthed()), []);

  // Map email -> user_id to match your /auth/token body for now
  const login = async ({ email }) => {
    await loginWithUserId(email);
    setAuthed(true);
  };

  const logout = () => {
    doLogout();
    setAuthed(false);
  };

  const value = useMemo(() => ({ authed, login, logout }), [authed]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
