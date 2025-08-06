import { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import {
  createColumn,
  deleteColumn,
  getAllColumns,
  updateColumn,
} from "../controllers/columnControllers";
import validateObjectId from "../middlewares/validateObjectId";

const columnRouter = Router();

columnRouter
  .route("/")
  .post(protectRoute, createColumn)
  .get(protectRoute, getAllColumns);

columnRouter
  .route("/:id")
  .delete(protectRoute, validateObjectId, deleteColumn)
  .patch(protectRoute, validateObjectId, updateColumn);

export default columnRouter;
