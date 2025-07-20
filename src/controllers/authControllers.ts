import { RequestHandler } from "express";
import User from "../models/User";
import { createUserDto } from "../dtos/user/UserDto";
import userSchema from "../zodSchemas/user/userSchema";
import _ from "lodash";
import loginSchema from "../zodSchemas/user/loginSchema";

export const register: RequestHandler = async (req, res) => {
  try {
    const results = userSchema.safeParse(req.body);
    if (!results.success) {
      res.status(400).send({
        success: false,
        message: "Invalid input(s)",
        errors: results.error.format(),
      });

      return;
    }

    const userInDb = await User.findOne({ email: results.data?.email });
    if (userInDb) {
      res.status(400).send({
        success: false,
        message: "User already registered.",
      });

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
    res.status(500).send({
      success: false,
      message: "server error",
    });
  }
};

export const login: RequestHandler = async (req, res) => {
  try {
    const results = loginSchema.safeParse(req.body);
    if (!results.success) {
      res.status(400).send({
        success: false,
        message: "Invalid input(s)",
        errors: results.error.format(),
      });

      return;
    }

    const user = await User.findOne({ email: results.data.email }).select(
      "+password"
    );
    if (!user) {
      res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    const isPasswordsTheSame = await user.isPasswordsTheSame(
      results.data.password,
      user.password
    );
    if (!isPasswordsTheSame) {
      res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });

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
    res.status(500).send({
      success: false,
      message: "server error",
    });
  }
};
