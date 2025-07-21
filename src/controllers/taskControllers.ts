import { RequestHandler } from "express";
import Task from "../models/Task";
import taskSchema from "../zodSchemas/taskSchema";
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
      subtasks: results.data.subtask,
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

export const getAllTasks: RequestHandler<{ board: string }> = async (
  req,
  res,
  next
) => {
  try {
    const tasks = await Task.find({ board: req.params.board }).populate(
      "column"
    );

    res.status(200).send({
      success: true,
      count: tasks.length,
      results: tasks,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
