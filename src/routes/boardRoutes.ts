import { Router } from "express";
import { createBoard, getAllBoards } from "../controllers/boardControllers";
import protectRoute from "../middlewares/protectRoute";

const boardRouter = Router();

boardRouter
  .route("/")
  .post(protectRoute, createBoard)
  .get(protectRoute, getAllBoards);

export default boardRouter;
