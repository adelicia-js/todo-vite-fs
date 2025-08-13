import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  userId: string;
}

export const getNotes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as AuthenticatedRequest).userId;

    const notes = await prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    return res.status(500).json({ error: "Failed to fetch notes" });
  }
};

export const createNote = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { title, completed = false } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ error: "Title is required" });
    }

    const note = await prisma.todo.create({
      data: {
        title: title.trim(),
        completed,
        userId,
      },
    });

    return res.status(201).json(note);
  } catch (error) {
    console.error("Create note error:", error);
    return res.status(500).json({ error: "Failed to create note" });
  }
};

export const updateNote = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const noteId = req.params.id;
    const { title, completed } = req.body;

    if (!noteId || noteId.trim() === "") {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const existingNote = await prisma.todo.findFirst({
      where: { id: noteId, userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    const updateData: { title?: string; completed?: boolean } = {};
    
    if (title !== undefined) {
      if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title cannot be empty" });
      }
      updateData.title = title.trim();
    }
    
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    const updatedNote = await prisma.todo.update({
      where: { id: noteId },
      data: updateData,
    });

    return res.json(updatedNote);
  } catch (error) {
    console.error("Update note error:", error);
    return res.status(500).json({ error: "Failed to update note" });
  }
};

export const deleteNote = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const noteId = req.params.id;

    if (!noteId || noteId.trim() === "") {
      return res.status(400).json({ error: "Invalid note ID" });
    }

    const existingNote = await prisma.todo.findFirst({
      where: { id: noteId, userId },
    });

    if (!existingNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.todo.delete({
      where: { id: noteId },
    });

    return res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    return res.status(500).json({ error: "Failed to delete note" });
  }
};
