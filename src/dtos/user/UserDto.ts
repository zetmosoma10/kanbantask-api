import z from "zod";
import userSchema from "../../zodSchemas/user/userSchema";

type createUserDto = z.infer<typeof userSchema>;

export { createUserDto };
