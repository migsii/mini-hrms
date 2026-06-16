import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginApi, logout as logoutApi } from "../api/auth";

function getStoredUser() {
  const stored = localStorage.getItem("hrms_user");
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem("hrms_token", data.token);
    localStorage.setItem("hrms_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
