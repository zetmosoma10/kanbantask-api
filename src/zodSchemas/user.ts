import z from "zod";

const userSchema = z.object({
  firstName: z
    .string({ invalid_type_error: "first name must be a string" })
    .min(3, "first name must have at least 3 characters")
    .max(100, "first name must not exceeds 100 characters"),
  lastName: z
    .string({ invalid_type_error: "last name must be a string" })
    .min(3, "last name must have at least 3 characters")
    .max(100, "last name must not exceeds 100 characters"),
  password: z
    .string({ invalid_type_error: "password must be a string" })
    .min(4, "password must have at least 4 characters")
    .max(255, "password must not exceeds 255 characters"),
  isAdmin: z.boolean().default(false),
  email: z.string().email().max(100, "email must not exceeds 100 characters"),
});

const loginSchema = userSchema.pick({ email: true, password: true });
const resetPasswordSchema = userSchema.pick({ password: true });
const forgotPasswordSchema = userSchema.pick({ email: true });
const deleteProfileSchema = userSchema.pick({ password: true });

export {
  userSchema,
  loginSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  deleteProfileSchema,
};
