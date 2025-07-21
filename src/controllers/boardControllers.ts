import { RequestHandler } from "express";
import Board from "../models/Board";
import boardSchema from "../zodSchemas/boardSchema";
import AppError from "../utils/AppError";

export const createBoard: RequestHandler = async (req, res, next) => {
  try {
    const results = boardSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input", 400, results.error.format()));
      return;
    }

    const board = await Board.create({
      name: results.data.name,
      createdBy: req.userId,
    });

    res.status(201).send({
      success: true,
      results: board,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBoards: RequestHandler = async (req, res, next) => {
  try {
    const boards = await Board.find({ createdBy: req.userId });

    res.status(200).send({
      success: true,
      count: boards.length,
      results: boards,
    });
  } catch (error) {
    next(error);
  }
};
