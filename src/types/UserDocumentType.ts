import { Types, Document } from "mongoose";

interface UserDocumentType extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  imageUrl?: string;
  imageId?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpire?: Date;
  generateJwt: () => string;
  generateResetPasswordToken: () => string;
  isPasswordsTheSame: (
    password: string,
    hashedPassword: string
  ) => Promise<boolean>;
}

export default UserDocumentType;
