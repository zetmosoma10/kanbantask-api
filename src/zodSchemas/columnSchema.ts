import boardSchema from "./boardSchema";

const columnSchema = boardSchema.pick({ name: true });

export default columnSchema;
