import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minlength: [3, "title must have at least 3 characters."],
      maxlength: [200, "title must not exceeds 200 characters."],
      required: [true, "title is required"],
    },
    description: {
      type: String,
      trim: true,
      minlength: [5, "description must have at least 5 characters."],
      maxlength: [300, "description must not exceeds 300 characters."],
      required: [true, "description is required"],
    },
    columnId: {
      type: mongoose.Types.ObjectId,
      ref: "Column",
      required: [true, "column id is required"],
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
    subtasks: [
      {
        title: {
          type: String,
          trim: true,
          minlength: [3, "title must have at least 3 characters."],
          maxlength: [50, "title must not exceeds 50 characters."],
          required: [true, "subtask title is required"],
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ columnId: 1 });
taskSchema.index({ boardId: 1, columnId: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
