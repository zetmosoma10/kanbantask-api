import { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import {
  createColumn,
  deleteColumn,
  getAllColumns,
} from "../controllers/columnControllers";

const columnRouter = Router();

columnRouter
  .route("/")
  .post(protectRoute, createColumn)
  .get(protectRoute, getAllColumns);

columnRouter.route("/:id").delete(protectRoute, deleteColumn);

export default columnRouter;
