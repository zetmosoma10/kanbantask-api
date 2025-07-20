import { RequestHandler } from "express";
import User from "../models/User";
import { createUserDto } from "../dtos/user/UserDto";
import userSchema from "../zodSchemas/user/userSchema";
import _ from "lodash";

export const register: RequestHandler = async (req, res) => {
  try {
    const results = userSchema.safeParse(req.body);
    if (!results.success) {
      res.status(400).send({
        success: false,
        message: "Invalid input(s)",
        errors: results.error.format(),
      });
    }

    const userInDb = await User.findOne({ email: results.data?.email });
    if (userInDb) {
      res.status(400).send({
        success: false,
        message: "User already registered.",
      });
    }

    const user = await User.create(results.data);

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
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "server error",
    });
  }
};
