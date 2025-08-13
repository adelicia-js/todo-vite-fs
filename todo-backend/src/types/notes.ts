export interface Note {
  id: number;
  content: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteRequest {
  content: string;
}

export interface UpdateNoteRequest {
  content: string;
}
