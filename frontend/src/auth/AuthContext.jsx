import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "http://localhost:5000/api/auth";

  /* ---------- LOAD SESSION ---------- */

  useEffect(() => {

    const session = localStorage.getItem("session");

    if (session) {
      setUser(JSON.parse(session));
    }

    setLoading(false);

  }, []);

  /* ---------- SIGNUP ---------- */

  const signup = async (email, password) => {

    const res = await fetch(`${API}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Signup failed");
    }

    return data;
  };

  /* ---------- LOGIN ---------- */

  const login = async (email, password) => {

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Invalid credentials");
    }

    const session = {
      email: data.email,
      role: data.role,
      token: data.token
    };

    localStorage.setItem("session", JSON.stringify(session));

    setUser(session);

    return session;
  };

  /* ---------- LOGOUT ---------- */

  const logout = () => {

    localStorage.removeItem("session");

    setUser(null);

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );

};

export const useAuth = () => useContext(AuthContext);