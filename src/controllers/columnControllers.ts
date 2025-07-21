import { RequestHandler } from "express";
import Column from "../models/Column";
import columnSchema from "../zodSchemas/columnSchema";
import AppError from "../utils/AppError";

export const createColumn: RequestHandler<
  any,
  any,
  any,
  { boardId: string }
> = async (req, res, next) => {
  try {
    const results = columnSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input", 400, results.error.format()));
      return;
    }

    const column = await Column.create({
      name: results.data.name,
      boardId: req.query.boardId,
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
  try {
    const columns = await Column.find({ boardId: req.query.boardId });

    res.status(200).send({
      success: true,
      counts: columns.length,
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
  try {
    const column = await Column.findByIdAndDelete(req.params.id);
    if (!column) {
      next(new AppError("Column not found", 404));
      return;
    }

    res.status(200).send({
      success: true,
      message: "Column deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
