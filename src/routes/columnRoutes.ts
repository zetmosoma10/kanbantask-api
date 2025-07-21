import { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import {
  createColumn,
  deleteColumn,
  getAllColumns,
  updateColumn,
} from "../controllers/columnControllers";

const columnRouter = Router();

columnRouter
  .route("/")
  .post(protectRoute, createColumn)
  .get(protectRoute, getAllColumns);

columnRouter
  .route("/:id")
  .delete(protectRoute, deleteColumn)
  .patch(protectRoute, updateColumn);

export default columnRouter;
