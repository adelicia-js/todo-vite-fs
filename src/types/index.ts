export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

// API Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface CreateTodoRequest {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
