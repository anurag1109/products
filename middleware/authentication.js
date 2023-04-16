const jwt = require("jsonwebtoken");
const { blacklistModel, userModel } = require("../models/model");
const express = require("express");
const app = express();
app.use(express.json());
const authenticate = async (req, res, next) => {
  try {
    const { accesstoken } = JSON.parse(req.headers.authorization);
    if (accesstoken) {
      let blacklistedtoken = await blacklistModel.find({ token: accesstoken });
      // if (blacklists.includes(token))
      if (blacklistedtoken.length > 0) {
        res
          .status(200)
          .send({ msg: "This token has been used already,Please login again" });
      } else {
        jwt.verify(accesstoken, "products", async (err, decoded) => {
          if (decoded) {
            const { userId } = decoded;
            const user = await userModel.findOne({ _id: userId });
            const role = user?.role;
            req.role = role;
            req.body.user = decoded.userId;
            next();
          } else {
            res.status(200).send({ msg: err.message });
          }
        });
      }
    } else {
      res.status(200).send({ msg: "Please login first" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ msg: err.message });
  }
};

const authorise = function (permittedrole) {
  return (req, res, next) => {
    if (permittedrole.includes(req.role)) {
      next();
    } else {
      res.status(401).send({ msg: "You are not authorised" });
    }
  };
};

module.exports = { authenticate, authorise };
