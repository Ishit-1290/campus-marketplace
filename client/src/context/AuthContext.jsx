// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  async function fetchMe() {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
    }
  }

  useEffect(() => {
    (async () => {
      await fetchMe();      // waits for cookie check
      setLoadingAuth(false); // <-- set to false ONLY ONCE
    })();
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });

    // After successful login, refresh user state
    await fetchMe();

    return res.data;
  }

  async function register(payload) {
    const res = await api.post("/auth/register", payload);

    await fetchMe();

    return res.data;
  }

  async function logout() {
    try {
      await api.post("/auth/logout"); // backend clears cookie
    } catch (err) {}

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, fetchMe, loadingAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
