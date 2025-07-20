import { Types, Document } from "mongoose";

interface UserDocumentDto extends Document {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  imageUrl?: string;
  imageId?: string;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpire?: Date;
  generateJwt: () => string;
}

export default UserDocumentDto;
