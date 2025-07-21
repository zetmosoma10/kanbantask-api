import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/taskControllers";
import protectRoute from "../middlewares/protectRoute";

const taskRouter = Router();

taskRouter.route("/").post(protectRoute, createTask);
taskRouter.route("/:boardId").get(protectRoute, getAllTasks);

export default taskRouter;
