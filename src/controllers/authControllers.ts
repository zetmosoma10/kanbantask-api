import { RequestHandler } from "express";
import User from "../models/User";
import { createUserDto } from "../dtos/user/UserDto";
import userSchema from "../zodSchemas/user/userSchema";
import _ from "lodash";
import loginSchema from "../zodSchemas/user/loginSchema";
import AppError from "../utils/AppError";

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
    next(new AppError("Server error. Try again later", 500));
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
    next(new AppError("Server error. Try again later", 500));
  }
};
