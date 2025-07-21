import { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import { createColumn, getAllColumns } from "../controllers/columnControllers";

const columnRouter = Router();

columnRouter.route("/").post(protectRoute, createColumn).get(getAllColumns);

export default columnRouter;
