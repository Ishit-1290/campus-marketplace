// src/api/axios.js
import axios from "axios";
import { API_BASE_URL } from "../config";
const api = axios.create({
  baseURL: API_BASE_URL+"/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
