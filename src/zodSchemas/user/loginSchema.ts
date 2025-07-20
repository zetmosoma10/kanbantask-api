import { z } from "zod";

const loginSchema = z.object({
  password: z
    .string({ invalid_type_error: "password must be a string" })
    .min(4, "password must have at least 4 characters")
    .max(255, "password must not exceeds 255 characters"),
  email: z.string().email().max(100, "email must not exceeds 100 characters"),
});

export default loginSchema;
