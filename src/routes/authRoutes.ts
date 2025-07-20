import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../controllers/authControllers";

const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/forgot-password").post(forgotPassword);
authRouter.route("/reset-password").patch(resetPassword);

export default authRouter;
