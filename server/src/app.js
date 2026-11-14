import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        origin === "https://sih-career-guidance-platform.vercel.app"
      ) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes import

import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chat", chatRouter);

// Global error-handling middleware
// Catches errors thrown by asyncHandler / ApiError and returns clean JSON
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: err.errors || [],
  });
});

export default app;