import { boardSchema } from "./board";

const columnSchema = boardSchema.pick({ name: true });

export { columnSchema };
