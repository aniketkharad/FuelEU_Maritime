import axios from 'axios';

// Vite default port for our backend docker mapping might be on 3001
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// Interceptor for error handling can be added here
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data?.error || error.message);
        return Promise.reject(error);
    }
);
