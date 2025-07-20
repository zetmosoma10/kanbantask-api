import express from "express";

const app = express();

app.get("/", (req, res) => res.send("NODE + TYPESCRIPT"));

export default app;
