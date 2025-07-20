import { RequestHandler } from "express";
import User from "../models/User";
import userSchema from "../zodSchemas/user/userSchema";
import _ from "lodash";
import loginSchema from "../zodSchemas/user/loginSchema";
import AppError from "../utils/AppError";
import forgotPasswordSchema from "../zodSchemas/user/forgotPasswordSchema";
import emailTransporter from "../email/emailTransporter";

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

    const editedUser = _.pick(user, [
      "firstName",
      "lastName",
      "isAdmin",
      "email",
      "__v",
      "_id",
    ]);

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

    const editedUser = _.pick(user, [
      "firstName",
      "lastName",
      "isAdmin",
      "email",
      "__v",
      "_id",
    ]);

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
        content: `Hi ${user.firstName},\n 
      We have received a password reset request, and to continue with the reset please click the link below. The link expires in 10 minutes.\n\n
      ${url}
      `,
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
