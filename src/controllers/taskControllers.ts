import { RequestHandler } from "express";
import { updateTaskSchema, taskSchema } from "../validations/task";
import Task from "../models/Task";
import AppError from "../utils/AppError";
import Column from "../models/Column";

export const createTask: RequestHandler = async (req, res, next) => {
  try {
    const results = taskSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input(s)", 400, results.error.format()));
      return;
    }

    const column = await Column.findOne({
      _id: results.data.column,
      boardId: results.data.board,
    });
    if (!column) {
      next(new AppError("Column not found.", 404));
      return;
    }

    const task = await Task.create({
      title: results.data.title,
      description: results.data.description,
      subtasks: results.data.subtasks,
      board: results.data.board,
      column: results.data.column,
      createdBy: req.userId,
    });

    res.status(201).send({
      success: true,
      results: task,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    if (Object.keys(req.body).length === 0) {
      next(new AppError("Please provide field(s) to update", 400));
      return;
    }

    const results = updateTaskSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input(s)", 400, results.error.format()));
      return;
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: results.data },
      { new: true, runValidators: true }
    );

    if (!task) {
      next(new AppError("Task not found", 404));
      return;
    }

    res.status(200).send({
      success: true,
      results: task,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      next(new AppError("Task not found", 404));
      return;
    }

    res.status(200).send({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
