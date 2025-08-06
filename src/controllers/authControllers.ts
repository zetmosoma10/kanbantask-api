import { RequestHandler } from "express";
import User from "../models/User";
import userSchema from "../zodSchemas/user/userSchema";
import _ from "lodash";
import loginSchema from "../zodSchemas/user/loginSchema";
import AppError from "../utils/AppError";
import forgotPasswordSchema from "../zodSchemas/user/forgotPasswordSchema";
import emailTransporter from "../email/emailTransporter";
import dayjs from "dayjs";
import resetPasswordSchema from "../zodSchemas/user/resetPasswordSchema";
import crypto from "node:crypto";
import getUserFields from "../utils/getUserFields";
import mongoose from "mongoose";

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

    const url = `${req.protocol}://${req.get(
      "host"
    )}/reset-password?token=${token}&id=${user._id}`;

    try {
      emailTransporter({
        clientEmail: user.email,
        subject: "Password reset request",
        content: `Hi ${user.firstName},\n We have received a password reset request, and    continue with the reset please click the link below. The link expires in 10 minutes.\n\n ${url}`,
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
