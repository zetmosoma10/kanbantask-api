import { Router } from "express";
import { createTask } from "../controllers/taskControllers";
import protectRoute from "../middlewares/protectRoute";

const taskRouter = Router();

taskRouter.route("/").post(protectRoute, createTask);

export default taskRouter;
