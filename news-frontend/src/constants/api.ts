import axios, { AxiosInstance } from "axios";

// Using type-assertions for Vite import.meta variables
const backendUrl = (import.meta as any).env.VITE_BACKEND_URL;

const baseURL: string = backendUrl 
  ? `${backendUrl}/api`
  : "http://localhost:5000/api";

const API: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

export default API;
