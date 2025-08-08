import { RequestHandler } from "express";
import User from "../models/User";
import Board from "../models/Board";
import Column from "../models/Column";
import Task from "../models/Task";
import AppError from "../utils/AppError";
import _ from "lodash";
import getUserFields from "../utils/getUserFields";
import mongoose from "mongoose";
import deleteProfileSchema from "../zodSchemas/user/deleteProfileSchema";

export const getLoggedInUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      next(new AppError("User not found.", 404));
      return;
    }

    const editedUser = _.pick(user, getUserFields());

    res.status(200).send({
      success: true,
      results: editedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProfile: RequestHandler = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const results = deleteProfileSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input(s)", 400, results.error.formErrors));
      return;
    }

    const user = await User.findById(req.userId)
      .select("+password")
      .session(session);

    const isSamePassword = await user?.isPasswordsTheSame(
      results.data.password,
      user.password
    );
    if (!isSamePassword) {
      next(new AppError("Incorrect password", 400));
      return;
    }

    await Promise.all([
      Board.deleteMany({ createdBy: user?._id }, { session }),
      Column.deleteMany({ createdBy: user?._id }, { session }),
      Task.deleteMany({ createdBy: user?._id }, { session }),
    ]);

    await user?.deleteOne({ session });

    await session.commitTransaction();

    res.status(200).send({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    await session.endSession();
  }
};
