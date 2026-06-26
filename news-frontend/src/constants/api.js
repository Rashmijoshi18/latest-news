import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : "http://localhost:5000/api";

const API = axios.create({
  baseURL,
  timeout: 10000, // 10 second timeout
});

export default API;
