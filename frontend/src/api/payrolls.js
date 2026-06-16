import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "/api",
  headers: { "Content-Type": "application/json" },
});

export const getPayrolls = () => api.get("/payrolls");
export const createPayroll = (data) => api.post("/payrolls", data);
