require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const noteRoutes = require("./routes/noteRoutes");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));

// Allow requests only from specific origins
app.use(
  cors({
    origin: [
      "https://takenote-five.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  })
);

// routes
app.use("/api/notes", noteRoutes);
app.use("/api/user", userRoutes);

// connect to db and listen to requests
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port:", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
