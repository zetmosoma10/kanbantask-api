import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    minlength: [3, "first name must have at least 3 characters"],
    maxlength: [100, "first name must not exceeds 100 characters"],
    required: [true, "first name is required."],
  },
  lastName: {
    type: String,
    trim: true,
    minlength: [3, "last name must have at least 3 characters"],
    maxlength: [100, "last name must not exceeds 100 characters"],
    required: [true, "last name is required."],
  },
  password: {
    type: String,
    select: false,
    minlength: [4, "password must have at least 3 characters"],
    maxlength: [255, "password must not exceeds 255 characters"],
    required: [true, "password is required."],
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, "email is required"],
    maxLength: [100, "email must not exceeds 100 characters"],
    validate: {
      validator: (val: string) => validator.isEmail(val),
      message: "Invalid email",
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  passwordResetTokenExpire: Date,
  passwordResetToken: String,
});

const User = mongoose.model("User", userSchema);

export default User;
