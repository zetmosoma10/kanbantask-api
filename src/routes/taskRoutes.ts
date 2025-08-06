import { Router } from "express";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/taskControllers";
import protectRoute from "../middlewares/protectRoute";
import validateObjectId from "../middlewares/validateObjectId";

const taskRouter = Router();

taskRouter.route("/").post(protectRoute, createTask);
taskRouter
  .route("/:id")
  .patch(protectRoute, validateObjectId, updateTask)
  .delete(protectRoute, validateObjectId, deleteTask);

export default taskRouter;
