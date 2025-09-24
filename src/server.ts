import express from "express";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const products = [
  { id: 1, slug: "red-sneakers", name: "Red sneakers", price: 10.0 },
  { id: 2, slug: "blue-tshirt", name: "Blue T-shirt", price: 20.0 },
  { id: 3, slug: "black-socks", name: "Black socks", price: 3.0 },
  { id: 4, slug: "white-paper", name: "white paper", price: 35.0 },
];

// GET /products/:slug
app.get("/products/:slug", (req, res) => {
  const product = products.find((p) => p.slug === req.params.slug);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// GET /products/:slug
app.get("/products", (req, res) => {
  res.json(products);
});

// POST /orders
const idempo = new Map<string, any>();
app.post("/orders", (req, res) => {
  const key = req.header("Idempotency-Key");
  if (!key) {
    return res
      .status(400)
      .json({ error: "Idempotency-Key header is required" });
  }
  if (idempo.has(key)) {
    return res.json(idempo.get(key));
  }

  const order = {
    orderId: crypto.randomUUID(),
    items: req.body.items || [],
    total: req.body.total || 0,
  };

  idempo.set(key, order);
  res.status(201).json(order);
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
