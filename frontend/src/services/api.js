import axios from "axios";

const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL || `http://localhost:5000/`;

const api = axios.create({
  baseURL: backendUrl,
});

// Add a request interceptor to attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Task APIs
export const fetchTasks = () => api.get("tasks/");
export const createTask = (data) => api.post("tasks/", data);
export const updateTask = (id, data) => api.put(`tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`tasks/${id}`);
// Analytics APIs
export const fetchAnalyticsOverview = () => api.get("analytics/overview");
export const fetchWeeklyTaskDistribution = () => api.get("analytics/weekly_task_distribution");
export const login = (credentials) => api.post("auth/login", credentials);
export const register = (userData) => api.post("auth/register", userData);







// import axios from "axios";

// const backendPort = import.meta.env.VITE_BACKEND_PORT || "5000";
// const api = axios.create({
//     baseURL: `http://localhost:5000/`,
// });


// export const fetchTasks = () => api.get("tasks/");
// export const createTask = (data) => api.post("tasks/", data);
// export const updateTask = (id, data) => api.put(`tasks/${id}`, data);
// export const deleteTask = (id) => api.delete(`tasks/${id}`);
