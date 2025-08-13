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
  userId: number;
}
