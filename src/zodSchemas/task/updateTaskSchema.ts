import taskSchema from "./taskSchema";

const updateTaskSchema = taskSchema
  .pick({
    title: true,
    description: true,
    column:true,
    subtasks: true,
  })
  .partial();

export default updateTaskSchema;
