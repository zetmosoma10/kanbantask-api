import mongoose from "mongoose";
import { z } from "zod";

const objectId = () => {
  return z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid objectId",
  });
};

export default objectId;
