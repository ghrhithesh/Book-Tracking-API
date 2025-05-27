import express from "express";
import bookRoutes from "./routes/bookRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

// Create Express application
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Book Tracking API is running",
    endpoints: {
      health: "GET /health",
      books: {
        create: "POST /books",
        getAll: "GET /books",
        getOne: "GET /books/:id",
        update: "PATCH /books/:id",
        checkout: "PATCH /books/:id/checkout",
        return: "PATCH /books/:id/return",
      },
    },
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running successfully",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/books", bookRoutes);

// Handle 404 errors
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
