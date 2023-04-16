const express = require("express");
const productrouter = express.Router();
productrouter.use(express.json());
const jwt = require("jsonwebtoken");

const { authenticate, authorise } = require("../middleware/authentication");
const { productModel } = require("../models/model");

productrouter.get("/", authenticate, async (req, res) => {
  try {
    const product = await productModel.find();
    res.status(200).send(product);
  } catch (err) {
    res.status(500).send({msg: err.message})
  }
  
});

productrouter.post(
  "/add",
  authenticate,
  authorise(["seller"]),
  async (req, res) => {
    try {
      let data = req.body;
      const newproduct = new productModel(data);
      newproduct.save();
      res.status(200).send({ msg: "product has been added successfully" });
    } catch (err) {
      console.log(err);
    }
  }
);

// postrouter.get("/top", authenticate, async (req, res) => {
//   const token = req.headers.authorization;
//   jwt.verify(token, "linkedin", async (err, decoded) => {
//     if (decoded) {
//       console.log(decoded);
//       let maxCommentPost = await postModel
//         .find({ user: decoded.userId })
//         .sort({ no_of_comments: -1 })
//         .limit(1);
//       res.status(200).send(maxCommentPost);
//     } else {
//       res.status(200).send({ msg: "You can see only your posts." });
//     }
//   });
// });

// postrouter.patch("/update/:id", authenticate, async (req, res) => {
//   const noteId = req.params.id;
//   const token = req.headers.authorization;
//   jwt.verify(token, "linkedin", async (err, decoded) => {
//     let post = await postModel.find({ user: decoded.userId, _id: noteId });
//     console.log(post);
//     if (post.length > 0) {
//       await postModel.findByIdAndUpdate({ _id: noteId }, req.body);
//       res.status(200).send({ msg: "post has been updated" });
//     } else {
//       res.status(200).send({ msg: "No post exist with given post ID" });
//     }
//   });
// });

productrouter.delete(
  "/delete/:id",
  authenticate,
  authorise(["seller"]),
  async (req, res) => {
    const productID = req.params.id;
    const { accesstoken } = JSON.parse(req.headers.authorization);
    jwt.verify(accesstoken, "products", async (err, decoded) => {
      let product = await productModel.find({ user: decoded.userId, _id: productID });
      if (product.length > 0) {
        await productModel.findByIdAndDelete({ _id: productID });
        res.status(200).send({ msg: "product has been deleted" });
      } else {
        res.status(200).send({ msg: "No product exist with given post ID" });
      }
    });
  }
);

module.exports = { productrouter };
