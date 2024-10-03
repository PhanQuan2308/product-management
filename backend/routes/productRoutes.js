const express = require("express");
const Product = require("../models/productModel");
const router = express.Router();

// Route để lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
});

// Route để chèn sản phẩm mới
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(400).json({ message: "Error adding product" });
  }
});

// Route để xóa sản phẩm theo ID
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
});
// Update product by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: "Error updating product" });
  }
});

module.exports = router;
