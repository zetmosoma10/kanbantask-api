import { RequestHandler } from "express";
import Board from "../models/Board";
import boardSchema from "../zodSchemas/boardSchema";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import Column from "../models/Column";
import Task from "../models/Task";

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

export const editBoard: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const results = boardSchema.safeParse(req.body);
  if (!results.success) {
    next(new AppError("Invalid input", 400, results.error.format()));
    return;
  }

  try {
    const board = await Board.findByIdAndUpdate(req.params.id, results.data);
    if (!board) {
      next(new AppError("Board not found", 404));
      return;
    }

    res.status(200).send({
      success: true,
      results: board,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const board = await Board.findByIdAndDelete(req.params.id, { session });
    if (!board) {
      next(new AppError("Board not found", 404));
      return;
    }

    await Column.deleteMany({ boardId: board._id }, { session });
    await Task.deleteMany({ board: board._id });

    await session.commitTransaction();

    res.status(200).send({
      success: true,
      message: "Board deleted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};
