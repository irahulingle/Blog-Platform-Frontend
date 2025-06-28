import axios from "axios";

const api = axios.create({
  baseURL: "https://blog-platform-backend-crkc.onrender.com/api/v1",
  withCredentials: true,
});

export default api;
