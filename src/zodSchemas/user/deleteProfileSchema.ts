import userSchema from "./userSchema";

const deleteProfileSchema = userSchema.pick({ password: true });

export default deleteProfileSchema;
