import { RequestHandler } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import _ from "lodash";
import AppError from "../utils/AppError";
import emailTransporter from "../email/emailTransporter";
import dayjs from "dayjs";
import crypto from "node:crypto";
import getUserFields from "../utils/getUserFields";
import emailPasswordResetTemplate from "../email/emailPasswordResetTemplate";
import emailPasswordSuccessTemplate from "../email/emailPasswordSuccessTemplate";
import {
  userSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  loginSchema,
} from "../validations/user";

export const register: RequestHandler = async (req, res, next) => {
  try {
    const results = userSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input(s)", 400, results.error.format()));

      return;
    }

    const userInDb = await User.findOne({ email: results.data?.email });
    if (userInDb) {
      next(new AppError("User already registered.", 400));

      return;
    }

    const user = await User.create(results.data);

    const token = user.generateJwt();

    const editedUser = _.pick(user, getUserFields());

    res.status(201).send({
      success: true,
      results: editedUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const results = loginSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid input(s)", 400, results.error.format()));

      return;
    }

    const user = await User.findOne({ email: results.data.email }).select(
      "+password"
    );
    if (!user) {
      next(new AppError("Invalid email or password", 400));

      return;
    }

    const isPasswordsTheSame = await user.isPasswordsTheSame(
      results.data.password,
      user.password
    );
    if (!isPasswordsTheSame) {
      next(new AppError("Invalid email or password", 400));

      return;
    }

    const token = user.generateJwt();

    const editedUser = _.pick(user, getUserFields());

    res.status(200).send({
      success: true,
      results: editedUser,
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (req, res, next) => {
  try {
    const results = forgotPasswordSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid email", 400, results.error.format()));
      return;
    }

    const user = await User.findOne({ email: results.data.email });
    if (!user) {
      next(new AppError("Invalid email", 400));
      return;
    }

    const token = user.generateResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const url = `${process.env.KANBAN_CLIENT}/reset-password?token=${token}&id=${user._id}`;

    // * SEND EMAIL
    try {
      emailTransporter({
        clientEmail: user.email,
        subject: "Password reset request",
        htmlContent: emailPasswordResetTemplate(user, url),
      });

      res.status(200).send({
        success: true,
        message: "We've sent you reset link on your email.",
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword: RequestHandler<
  {},
  {},
  {},
  { token: string; id: string }
> = async (req, res, next) => {
  try {
    // ****
    const results = resetPasswordSchema.safeParse(req.body);
    if (!results.success) {
      next(new AppError("Invalid password", 400, results.error.format()));
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(req.query.id)) {
      next(new AppError(`Invalid objectId: ${req.query.id}`, 400));
      return;
    }

    const user = await User.findById(req.query.id);
    if (!user) {
      next(new AppError("User not found", 404));
      return;
    }

    const hashToken = crypto
      .createHash("sha256")
      .update(req.query.token)
      .digest("hex");

    if (user.passwordResetToken !== hashToken) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });

      next(
        new AppError(
          "Invalid token provided. Please request another token",
          400
        )
      );
      return;
    }

    if (dayjs().isAfter(user.passwordResetTokenExpire)) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpire = undefined;
      await user.save({ validateBeforeSave: false });

      next(
        new AppError("Reset link has expired. Please request another one.", 400)
      );
      return;
    }

    user.password = results.data.password;
    user.passwordChangedAt = dayjs().toDate();
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // * SEND CONFIRMATION EMAIL
    try {
      emailTransporter({
        clientEmail: user.email,
        subject: "Reset password success",
        htmlContent: emailPasswordSuccessTemplate(user),
      });
    } catch (error) {
      console.log("error sending email", error);
    }

    const jwt = user.generateJwt();

    const editedUser = _.pick(user, getUserFields());

    res.status(200).send({
      success: true,
      token: jwt,
      results: editedUser,
    });
  } catch (error) {
    next(error);
  }
};
