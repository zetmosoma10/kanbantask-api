import mongoose from "mongoose";

const boardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "board name must be at least 3 characters."],
      maxlength: [50, "board name must not exceeds 50 characters."],
      required: [true, "board name is required."],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "createdBy field is required."],
    },
  },
  { timestamps: true }
);

boardSchema.index({ createdBy: 1 });
boardSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Board = mongoose.model("Board", boardSchema);

export default Board;
