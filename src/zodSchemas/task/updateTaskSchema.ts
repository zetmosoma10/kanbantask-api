import taskSchema from "./taskSchema";

const updateTaskSchema = taskSchema
  .pick({
    title: true,
    description: true,
    subtasks: true,
  })
  .partial();

export default updateTaskSchema;
