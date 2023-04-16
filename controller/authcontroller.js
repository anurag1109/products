const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { userModel, blacklistModel } = require("../models/model");

const register = async (req, res) => {
  const { name, email, gender, password, age, city, role } = req.body;
  console.log(email);
  try {
    if (await userModel.findOne({ email })) {
      res.send({ msg: "User already exist, please login" });
    } else {
      const hashedpass = await bcrypt.hash(password, 5);
      const hasheduser = new userModel({
        name,
        email,
        gender,
        age,
        city,
        role,
        password: hashedpass,
      });
      console.log(hasheduser);
      await hasheduser.save();
      res.status(200).send({ msg: "User has been added successfully" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const isUserExist = await userModel.findOne({ email });
    console.log(isUserExist);
    if (!isUserExist) {
      res.status(200).send({ msg: "User not exist. Please Register first" });
    } else if (!(await bcrypt.compare(password, isUserExist.password))) {
      res.status(200).send({ msg: "Password is not correct" });
    } else {
      const accesstoken = jwt.sign({ userId: isUserExist._id }, "products", {
        expiresIn: 300,
      });
      const refreshtoken = jwt.sign(
        { userId: isUserExist._id },
        "refreshproducts",
        { expiresIn: 600 }
      );
      res
        .status(200)
        .send({ msg: "Login Successfull", accesstoken, refreshtoken });
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const logout = async (req, res) => {
  const { accesstoken, refreshtoken } = JSON.parse(req.headers.authorization);
  console.log(accesstoken, refreshtoken);
  const accessblacklist = new blacklistModel({
    token: accesstoken,
  });
  await accessblacklist.save();
  const refreshblacklist = new blacklistModel({
    token: refreshtoken,
  });

  await refreshblacklist.save();
  // blacklists.push(token);
  res.send({ msg: "Logout successful" });
};

const newtoken = async (req, res) => {
  try {
    const { refreshtoken } = JSON.parse(req.headers.authorization);
    const decoded = jwt.verify(refreshtoken, "refreshproducts");
    if (decoded) {
      const token = jwt.sign({ userId: decoded.userId }, "products", {
        expiresIn: 60,
      });
      res.status(200).send({ accesstoken: token });
    } else {
      res.send({ msg: "Invalid refresh token,please login first" });
    }
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
};
module.exports = { register, login, logout, newtoken };
