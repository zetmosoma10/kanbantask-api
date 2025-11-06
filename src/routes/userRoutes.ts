import { Router } from "express";
import {
  deleteProfile,
  deleteProfileImage,
  getLoggedInUser,
  uploadProfileImage,
  updateMe,
} from "../controllers/userControllers";
import protectRoute from "../middlewares/protectRoute";
import uploadMiddleware from "../middlewares/uploadMiddleware";

const userRouter = Router();

userRouter
  .route("/me")
  .get(protectRoute, getLoggedInUser)
  .patch(protectRoute, updateMe);
userRouter.route("/delete-account").post(protectRoute, deleteProfile);
userRouter
  .route("/upload-image")
  .patch(protectRoute, uploadMiddleware, uploadProfileImage);
userRouter.route("/delete-image").delete(protectRoute, deleteProfileImage);

export default userRouter;
