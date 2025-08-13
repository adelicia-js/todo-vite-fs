import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  register: async (email: string, password: string) => {
    const response = await api.post("/auth/register", { email, password });
    return response.data;
  },
};

// Todo API calls
export const todoAPI = {
  getTodos: async () => {
    const response = await api.get("/notes");
    return response.data;
  },

  createTodo: async (title: string) => {
    const response = await api.post("/notes", { title, completed: false });
    return response.data;
  },

  updateTodo: async (id: number, title?: string, completed?: boolean) => {
    const updateData: { title?: string; completed?: boolean } = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const response = await api.put(`/notes/${id}`, updateData);
    return response.data;
  },

  deleteTodo: async (id: number) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
};
