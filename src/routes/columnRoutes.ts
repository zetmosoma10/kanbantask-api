import { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import { createColumn } from "../controllers/columnControllers";

const columnRouter = Router();

columnRouter.route("/").post(protectRoute, createColumn);

export default columnRouter;
