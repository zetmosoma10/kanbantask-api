import express from "express";
import authRouter from "./routes/authRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./routes/userRoutes";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use(globalErrorHandler);

export default app;
