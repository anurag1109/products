const express = require("express");
const app = express();
app.use(express.json());

const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
app.use(cors());

const { connection } = require("./configs/db");
const { userrouter } = require("./routes/userRoutes");
const { productrouter } = require("./routes/productRoutes");

app.get("/", async (req, res) => {
  res.send("Homepage");
});

app.use("/users", userrouter);
app.use("/products", productrouter);

app.listen(process.env.port, async (req, res) => {
  try {
    await connection;
    console.log("connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  console.log(`server running at port ${process.env.port}`);
});
