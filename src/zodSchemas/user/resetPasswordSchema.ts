import userSchema from "./userSchema";

const resetPasswordSchema = userSchema.pick({ password: true });

export default resetPasswordSchema;
