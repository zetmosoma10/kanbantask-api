import { Types } from "mongoose";

type JwtPayloadDto = {
  _id: Types.ObjectId;
  iat: number;
  exp: number;
};

export default JwtPayloadDto;
