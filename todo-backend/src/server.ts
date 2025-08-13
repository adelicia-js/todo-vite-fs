import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
const corsOptions = {
  origin: NODE_ENV === "production" 
    ? "https://todo-vite-fs.vercel.app"
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Health check
app.get("/health", (req: express.Request, res: express.Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Routes
app.use("/auth", authRoutes);
app.use("/notes", notesRoutes);

app.get("/", (req: express.Request, res: express.Response) => {
  res.json({ message: "Todo Backend API" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
