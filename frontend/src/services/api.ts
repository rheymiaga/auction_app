import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor: attach token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("token");

            if (window.location.pathname !== "/") {
                window.location.replace("/");
            }
        }
        return Promise.reject(error);
    }
);

export default api;
