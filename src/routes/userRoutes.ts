import { Router } from "express";
import {
  deleteProfile,
  getLoggedInUser,
  uploadProfileImage,
} from "../controllers/userControllers";
import protectRoute from "../middlewares/protectRoute";
import uploadMiddleware from "../middlewares/uploadMiddleware";

const userRouter = Router();

userRouter.route("/me").get(protectRoute, getLoggedInUser);
userRouter.route("/delete-account").post(protectRoute, deleteProfile);
userRouter
  .route("/upload-image")
  .patch(protectRoute, uploadMiddleware, uploadProfileImage);

export default userRouter;
