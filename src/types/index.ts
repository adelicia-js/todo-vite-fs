export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  userId: string;
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

export interface PaginatedTodosResponse {
  todos: Todo[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface ErrorResponse {
  error: string;
  message?: string;
}
