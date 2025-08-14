import { Router } from "express";
import {
  createBoard,
  deleteBoard,
  getAllBoards,
  editBoard,
} from "../controllers/boardControllers";
import protectRoute from "../middlewares/protectRoute";
import validateObjectId from "../middlewares/validateObjectId";

const boardRouter = Router();

boardRouter
  .route("/")
  .post(protectRoute, createBoard)
  .get(protectRoute, getAllBoards);

boardRouter
  .route("/:id")
  .patch(protectRoute, validateObjectId, editBoard)
  .delete(protectRoute, validateObjectId, deleteBoard);

export default boardRouter;
