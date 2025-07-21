import { Router } from "express";
import { createBoard } from "../controllers/boardControllers";
import protectRoute from "../middlewares/protectRoute";

const boardRouter = Router();

boardRouter.route("/").post(protectRoute, createBoard);

export default boardRouter;
