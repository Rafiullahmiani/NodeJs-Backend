import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./modules/product.js";
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5050;
// Connecting to mongodb
const ConnectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Mongo DB Connected");
  } catch (err) {
    console.log(err);
  }
};

let products = [
  {
    id: 1,
    name: "Corsair HS45",
    price: 4500,
    customImage: "//techmatched.pk/wp-content/uploads/2024/05/4-13.png",
  },
  {
    id: 2,
    name: "Logitech G102",
    price: 2500,
    customImage:
      "//static.webx.pk/files/2603/Images/14-czone.com.pk-1540-12831-250122082031-2603-2261410-231124021614482.jp",
  },
];

//  Get all products from mongodb
app.get("/products", async (req, res) => {
  try {
    const productsFromDB = await Product.find();
    res.status(200).json(productsFromDB);
  } catch (err) {
    res.status(500).json("Something Went Wrong");
  }
});

// Add Product Mongodb

app.post("/Products", async (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  try {
    const newDBProduct = new Product({
      id: newProduct.id,
      name: newProduct.name,
      price: newProduct.price,
      imageUrl: newProduct.imageUrl,
      desc: newProduct.desc,
    });
    await newDBProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json("Something Went Wrong");
  }
});

//  Update product
app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;

  const index = products.findIndex((product) => product.id === parseInt(id));
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    res.json(products[index]);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// Delete product
app.delete("/Products/:id", (req, res) => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== parseInt(id));
  res.sendStatus(204);
});

// Server start
ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
