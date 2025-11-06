import z from "zod";

const boardSchema = z.object({
  name: z
    .string({ invalid_type_error: "name must be a string" })
    .min(3, "name must be at least 3 characters.")
    .max(50, "name must not exceeds 50 characters."),
});

export { boardSchema };
