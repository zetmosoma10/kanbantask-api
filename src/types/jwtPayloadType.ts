import { Types } from "mongoose";

type JwtPayloadType = {
  _id: Types.ObjectId;
  iat: number;
  exp: number;
};

export default JwtPayloadType;
