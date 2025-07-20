import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
} from "../controllers/authControllers";

const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/forgot-password").post(forgotPassword);

export default authRouter;
