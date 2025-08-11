import { RequestHandler } from "express";
import User from "../models/User";
import Board from "../models/Board";
import Column from "../models/Column";
import Task from "../models/Task";
import streamifier from "streamifier";
import AppError from "../utils/AppError";
import _ from "lodash";
import getUserFields from "../utils/getUserFields";
import mongoose from "mongoose";
import deleteProfileSchema from "../zodSchemas/user/deleteProfileSchema";
import cloudinary from "../configs/cloudinary";

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

export const uploadProfileImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .send({ success: false, message: "No file uploaded" });
    }

    // * Cloudinary stream upload (buffer → Cloudinary)
    const streamUpload = (fileBuffer: Buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "kanbantask" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const imageObject = await streamUpload(req.file.buffer);

    // * Update user
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        imageUrl: (imageObject as any).secure_url,
        imageId: (imageObject as any).public_id,
      },
      { new: true }
    );

    const updatedUser = _.pick(user, getUserFields());

    res.status(200).send({
      success: true,
      results: updatedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteProfileImage: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      next(new AppError("User not found", 404));
      return;
    }

    await cloudinary.uploader.destroy(user.imageId!);

    user.imageId = undefined;
    user.imageUrl = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(200).send({
      success: true,
      results: user,
    });
  } catch (error) {
    next(error);
  }
};
