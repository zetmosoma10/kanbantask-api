import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  updateTask,
} from "../controllers/taskControllers";
import protectRoute from "../middlewares/protectRoute";

const taskRouter = Router();

taskRouter.route("/").post(protectRoute, createTask);
taskRouter.route("/:board").get(protectRoute, getAllTasks);
taskRouter
  .route("/:id")
  .patch(protectRoute, updateTask)
  .delete(protectRoute, deleteTask);

export default taskRouter;
