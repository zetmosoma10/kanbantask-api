import z from "zod";
import objectId from "../objectIdSchema";

const taskSchema = z.object({
  title: z
    .string({ invalid_type_error: "title must be a string" })
    .min(3, "title must have at least 3 characters.")
    .max(200, "title must not exceeds 200 characters."),
  description: z
    .string({ invalid_type_error: "description must be a string" })
    .min(5, "description must have at least 5 characters.")
    .max(300, "description must not exceeds 300 characters."),
  board: objectId(),
  column: objectId(),
  subtasks: z
    .array(
      z.object({
        title: z
          .string({ invalid_type_error: "subtask title must be a string" })
          .min(3, "subtask title must have at least 3 characters.")
          .max(50, "subtask title must not exceeds 50 characters."),
        isCompleted: z.boolean().optional().default(false),
      })
    )
    .optional(),
});

export default taskSchema;
