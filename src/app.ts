import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import sanitize from "express-mongo-sanitize";
import authRouter from "./routes/authRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRoutes";
import boardRouter from "./routes/boardRoutes";
import columnRouter from "./routes/columnRoutes";
import taskRouter from "./routes/taskRoutes";

const app = express();

const limit = rateLimit({
  windowMs: 15 * 60 * 1000, // * 15 minutes
  max: 100, // * limit each IP to 100 requests per windowMs // 100 requests
  message: "Too many requests from this IP, please try again after an hour",
});

app.set("trust proxy", 1);
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(limit);
app.use(helmet());
// app.use(sanitize());
app.use(compression());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/boards", boardRouter);
app.use("/api/columns", columnRouter);
app.use((req, res) => {
  res.status(400).send({
    success: false,
    message: `Invalid path: ${req.path}`,
  });
});
app.use(globalErrorHandler);

export default app;
