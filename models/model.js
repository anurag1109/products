const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["seller", "user"],
      default: "user",
    },
  },
  {
    strict: false,
  }
);
const userModel = mongoose.model("users", userSchema);

const productSchema = mongoose.Schema(
  {
    product: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
  },
  {
    strict: false,
  }
);
const productModel = mongoose.model("posts", productSchema);

const blacklistSchema = mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  {
    strict: false,
  }
);
const blacklistModel = mongoose.model("blacklist", blacklistSchema);

module.exports = { userModel, productModel, blacklistModel };
