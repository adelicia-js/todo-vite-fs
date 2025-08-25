import axios from "axios";
import type { 
  AuthResponse, 
  Todo, 
  LoginRequest, 
  RegisterRequest, 
  CreateTodoRequest, 
  UpdateTodoRequest 
} from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const loginData: LoginRequest = { email, password };
    const response = await api.post<AuthResponse>("/api/auth/login", loginData);
    return response.data;
  },

  register: async (email: string, password: string): Promise<AuthResponse> => {
    const registerData: RegisterRequest = { email, password };
    const response = await api.post<AuthResponse>("/api/auth/register", registerData);
    return response.data;
  },
};

// Todo API calls
export const todoAPI = {
  getTodos: async (): Promise<Todo[]> => {
    const response = await api.get<Todo[]>("/api/notes");
    return response.data;
  },

  createTodo: async (title: string): Promise<Todo> => {
    const createData: CreateTodoRequest = { title, completed: false };
    const response = await api.post<Todo>("/api/notes", createData);
    return response.data;
  },

  updateTodo: async (id: string, title?: string, completed?: boolean): Promise<Todo> => {
    const updateData: UpdateTodoRequest = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const response = await api.put<Todo>(`/api/notes/${id}`, updateData);
    return response.data;
  },

  deleteTodo: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(`/api/notes/${id}`);
    return response.data;
  },
};
