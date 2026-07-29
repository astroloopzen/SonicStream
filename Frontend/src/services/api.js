import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Crucial for HttpOnly cookies if your backend uses them
});

// Request Interceptor: No longer needed for localStorage tokens since we use HttpOnly cookies
// Cookies are automatically sent because of withCredentials: true

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Let the calling function (like AuthContext) handle the 401 state.
      // We no longer force a hard redirect here, which would break Guest mode and Welcome routing.
    }
    return Promise.reject(error);
  }
);

export default api;