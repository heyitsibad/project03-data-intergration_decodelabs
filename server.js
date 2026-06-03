const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// config FIRST
dotenv.config();

// DB connect ONCE
connectDB();

const app = express();

app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// routes
app.use("/api/tasks", require("./routes/taskRoutes"));

// server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});