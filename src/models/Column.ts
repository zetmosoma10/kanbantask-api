import mongoose from "mongoose";

const columnSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: [3, "column name must be at least 3 characters."],
      maxlength: [50, "column name must not exceeds 50 characters."],
      required: [true, "column name is required."],
    },
    boardId: {
      type: mongoose.Types.ObjectId,
      ref: "Board",
      required: [true, "board id is required"],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
  },
  { timestamps: true }
);

columnSchema.index({ boardId: 1 });

const Column = mongoose.model("Column", columnSchema);

export default Column;
