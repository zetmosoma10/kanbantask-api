import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { env } from "process";

import mongoose from "mongoose";

async function main() {
  const dbUrl = env.KANBAN_DB_CONN_STR;
  if (!dbUrl)
    throw new Error("❌ Missing environment variable: KANBAN_DB_CONN_STR");

  const port = env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running in port:${port}...`);
  });

  await mongoose.connect(dbUrl);
  console.log("Successfully connected to database...");
}

main().catch((err) => {
  console.error("App failed to run.", err);
  process.exit(1);
});
