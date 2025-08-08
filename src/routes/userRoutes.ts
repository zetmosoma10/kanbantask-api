import { Router } from "express";
import { deleteProfile, getLoggedInUser } from "../controllers/userControllers";
import protectRoute from "../middlewares/protectRoute";

const userRouter = Router();

userRouter.route("/me").get(protectRoute, getLoggedInUser);
userRouter.route("/delete-account").post(protectRoute, deleteProfile);

export default userRouter;
