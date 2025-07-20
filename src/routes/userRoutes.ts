import { Router } from "express";
import { getLoggedInUser } from "../controllers/userControllers";
import protectRoute from "../middlewares/protectRoute";

const userRouter = Router();

userRouter.route("/me").get(protectRoute, getLoggedInUser);

export default userRouter;
