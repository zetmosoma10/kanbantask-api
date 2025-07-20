import express from "express";
import authRouter from "./routes/authRoutes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use(globalErrorHandler);

export default app;
