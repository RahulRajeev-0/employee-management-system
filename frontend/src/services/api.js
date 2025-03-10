// src/utils/api.js
import axios from 'axios';


export const baseURL ='http://127.0.0.1:8000/'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/', // replace with your API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});


// Storage management functions
export const getAccessToken = () => localStorage.getItem('accessToken');
export const getRefreshToken = () => localStorage.getItem('refreshToken');
export const setAccessToken = (token) => localStorage.setItem('accessToken', token);
export const setRefreshToken = (token) => localStorage.setItem('refreshToken', token);
export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  return
};


// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Variable to track if token refresh is in progress
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process failed queue
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    
    failedQueue = [];
  };



// Response interceptor to handle 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      // If error is not 401 or request has already been retried, reject
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }
      
      // If token refresh is already in progress, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        // No refresh token available, redirect to login
        triggerLogout();
        return Promise.reject(error);
      }
      
      try {
        // Attempt to refresh the token
        const response = await axios.post(
          'http://127.0.0.1:8000/user/api/token/refresh/',
          { refresh: refreshToken }
        );
        
        const { access, refresh } = response.data;
        
        setAccessToken(access);
        if (refresh) {
          // Some APIs return a new refresh token as well
          setRefreshToken(refresh);
        }
        
        // Update authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        originalRequest.headers['Authorization'] = `Bearer ${access}`;
        
        // Process queued requests
        processQueue(null, access);
        
        isRefreshing = false;
        
        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;
        
        // If refresh token fails, log user out
        triggerLogout();
        return Promise.reject(err);
      }
    }
  );
  
  // Function to trigger user logout
  const triggerLogout = () => {
    removeTokens();
    // Redirect to login page or dispatch logout action
    window.location.href = '/login';
    // Or if using React Router: history.push('/login');
    // Or if using Redux: dispatch(logoutAction());
  };

  export default api;