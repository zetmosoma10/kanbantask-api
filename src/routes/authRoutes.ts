import { Router } from "express";
import { register } from "../controllers/authControllers";

const authRouter = Router();

authRouter.route("/register").post(register);

export default authRouter;
