import { Router } from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken); // Apply authentication middleware to all routes

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
