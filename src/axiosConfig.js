import axios from 'axios';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 15000, // 15 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle different error status codes
        if (error.response) {
            switch (error.response.status) {
                case 401: // Unauthorized
                    // Handle unauthorized access (e.g., redirect to login)
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    break;
                case 403: // Forbidden
                    // Handle forbidden access
                    break;
                case 404: // Not found
                    // Handle not found
                    break;
                case 500: // Server error
                    // Handle server error
                    break;
                default:
                    // Handle other errors
                    break;
            }
        }

        return Promise.reject(error);
    }
);

// Helper methods for common HTTP requests
export const http = {
    get: (url, config = {}) => axiosInstance.get(url, config),
    post: (url, data, config = {}) => axiosInstance.post(url, data, config),
    put: (url, data, config = {}) => axiosInstance.put(url, data, config),
    delete: (url, config = {}) => axiosInstance.delete(url, config),
    patch: (url, data, config = {}) => axiosInstance.patch(url, data, config)
};

export default axiosInstance; 