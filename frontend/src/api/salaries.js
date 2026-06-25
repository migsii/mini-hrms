import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

export const createSalary = (data) => api.post("/salaries", data);
export const updateSalary = (id, data) => api.put(`/salaries/${id}`, data);
export const getSalary = (id) => api.get(`/salaries/${id}`);
