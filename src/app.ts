import express from "express";
import authRouter from "./routes/authRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRoutes";
import boardRouter from "./routes/boardRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/boards", boardRouter);
app.use(globalErrorHandler);

export default app;
