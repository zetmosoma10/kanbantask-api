import { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import {
  createColumn,
  deleteColumn,
  getAllColumns,
} from "../controllers/columnControllers";
import validateObjectId from "../middlewares/validateObjectId";

const columnRouter = Router();

columnRouter
  .route("/")
  .post(protectRoute, createColumn)
  .get(protectRoute, getAllColumns);

columnRouter.route("/:id").delete(protectRoute, validateObjectId, deleteColumn);

export default columnRouter;
