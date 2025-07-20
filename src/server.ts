import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { env } from "process";

const port = env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});
