import userSchema from "./userSchema";

const forgotPasswordSchema = userSchema.pick({ email: true });

export default forgotPasswordSchema;
