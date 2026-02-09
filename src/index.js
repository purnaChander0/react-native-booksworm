// const express = require("express");
import express from "express";
import "dotenv/config";
import authRoutes from "./routes/AuthRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Hi User!.");
});

app.listen(PORT, () => {
  console.log("running on port " + PORT);
  connectDB();
});
