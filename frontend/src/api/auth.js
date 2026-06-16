import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

export const login = async (email, password) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("hrms_token");
  localStorage.removeItem("hrms_user");
};
