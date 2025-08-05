import { Router } from "express";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/taskControllers";
import protectRoute from "../middlewares/protectRoute";

const taskRouter = Router();

taskRouter.route("/").post(protectRoute, createTask);
taskRouter
  .route("/:id")
  .patch(protectRoute, updateTask)
  .delete(protectRoute, deleteTask);

export default taskRouter;
