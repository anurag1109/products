const express = require("express");
const userrouter = express.Router();
userrouter.use(express.json());
const { authenticate, authorise } = require("../middleware/authentication");

const {
  register,
  login,
  logout,
  newtoken,
} = require("../controller/authcontroller");

userrouter.post("/register", register);
userrouter.post("/login", login);
userrouter.get("/logout", logout);
userrouter.get("/newtoken", newtoken);

module.exports = { userrouter };
