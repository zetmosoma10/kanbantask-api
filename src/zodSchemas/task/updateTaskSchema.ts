import taskSchema from "./taskSchema";

const updateTaskSchema = taskSchema
  .pick({
    title: true,
    description: true,
    subtask: true,
  })
  .partial();

export default updateTaskSchema;
