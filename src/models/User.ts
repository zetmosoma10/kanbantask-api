import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "process";
import UserDocumentDto from "./../dtos/user/UserDocumentDto";

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
    minlength: [4, "password must have at least 4 characters"],
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
  imageUrl: String,
  imageId: String,
  passwordChangedAt: Date,
  passwordResetTokenExpire: Date,
  passwordResetToken: String,
});

// * ENCRYPT THE PASSWORD
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// * GENERATE JWT
userSchema.methods.generateJwt = function (): string {
  return jwt.sign(
    {
      _id: this._id,
    },
    env.KANBAN_JWT_SECRET!,
    {
      expiresIn: "1d",
    }
  );
};

// * COMPARE PASSWORD
userSchema.methods.isPasswordsTheSame = async function (
  password: string,
  hashPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
};

const User = mongoose.model<UserDocumentDto>("User", userSchema);

export default User;
