import { RequestHandler } from "express";
import { columnSchema } from "../validations/column";
import Column from "../models/Column";
import AppError from "../utils/AppError";
import mongoose from "mongoose";
import Task from "../models/Task";
import Board from "../models/Board";

export const createColumn: RequestHandler<
  any,
  any,
  any,
  { boardId: string }
> = async (req, res, next) => {
  // ****
  if (!mongoose.Types.ObjectId.isValid(req.query.boardId)) {
    next(new AppError("Board not found", 404));
    return;
  }

  const board = await Board.findById(req.query.boardId);
  if (!board) {
    next(new AppError("Board not found", 404));
    return;
  }

  try {
    const results = columnSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input", 400, results.error.format()));
      return;
    }

    const column = await Column.create({
      name: results.data.name,
      boardId: req.query.boardId,
      createdBy: req.userId,
    });

    res.status(201).send({
      success: true,
      results: column,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllColumns: RequestHandler<
  any,
  any,
  any,
  { boardId: string }
> = async (req, res, next) => {
  // ****
  if (!mongoose.Types.ObjectId.isValid(req.query.boardId)) {
    next(new AppError("Board not found", 404));
    return;
  }

  try {
    const columns = await Column.aggregate([
      { $match: { boardId: new mongoose.Types.ObjectId(req.query.boardId) } },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "column",
          as: "tasks",
        },
      },
      { $unwind: { path: "$tasks", preserveNullAndEmptyArrays: true } },
      { $sort: { "tasks.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          count: { $sum: 1 },
          name: { $first: "$name" },
          boardId: { $first: "$boardId" },
          createdAt: { $first: "$createdAt" },
          tasks: { $push: "$tasks" },
        },
      },
      { $sort: { createdAt: 1 } },
    ]);

    res.status(200).send({
      success: true,
      count: columns.length,
      results: columns,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteColumn: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const column = await Column.findByIdAndDelete(req.params.id, { session });
    if (!column) {
      next(new AppError("Column not found", 404));
      return;
    }

    const tasks = await Task.deleteMany({ column: column._id }, { session });

    await session.commitTransaction();

    res.status(200).send({
      success: true,
      message: "Column deleted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};
