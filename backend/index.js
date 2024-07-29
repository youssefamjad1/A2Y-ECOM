const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// CORS configuration
const corsOptions = {
  origin: 'https://66a7f360291c93000872acf2--a2y.netlify.app/', // Frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOptions));

// Database connection with MongoDB
const options = {
  ssl: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 5000
};

mongoose.connect(mongoUri, options)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
    if (err.name === 'MongooseServerSelectionError') {
      console.error('MongooseServerSelectionError:', err.message);
      console.error('Additional Info:', JSON.stringify(err, null, 2));
    }
  });

// Importing models
const Product = require('./models/Product');
const Users = require('./models/User');

// API Creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
  const imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  res.json({
    success: 1,
    image_url: imageUrl
  });
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

app.post('/removeproduct', async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name
  });
});

app.get('/allproducts', async (req, res) => {
  let products = await Product.find({});
  console.log("all products fetched");
  res.send(products);
});

app.post('/signup', async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({ success: false, errors: "Existing user found with the same email address!" });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id
    }
  };
  const token = jwt.sign(data, jwtSecret);
  res.json({ success: true, token });
});

app.post('/login', async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = await bcrypt.compare(req.body.password, user.password);
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        }
      };
      const token = jwt.sign(data, jwtSecret);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password!" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Address!" });
  }
});

app.get('/newcollections', async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("Fetched products:", products);
    let newcollection = products.slice(1).slice(-8);
    console.log("New collections fetched:", newcollection);
    res.json(newcollection);
  } catch (err) {
    console.error("Error fetching new collections:", err);
    res.status(500).json({ error: "Failed to fetch new collections" });
  }
});

app.get('/popularinwomen', async (req, res) => {
  console.log("Received request for popularinwomen");
  try {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("popular_in_women fetched", popular_in_women);
    res.send(popular_in_women);
  } catch (error) {
    console.error("Error fetching popular_in_women:", error);
    res.status(500).send("Internal Server Error");
  }
});

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  } else {
    try {
      const data = jwt.verify(token, jwtSecret);
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({ errors: "Please authenticate using a valid token!" });
    }
  }
};

app.post('/addtocart', fetchUser, async (req, res) => {
  console.log("added", req.body.itemid);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemid] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Added");
});

app.post('/removefromcart', fetchUser, async (req, res) => {
  console.log("removed", req.body.itemid);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemid] > 0) {
    userData.cartData[req.body.itemid] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
  res.send("Removed");
});

app.post('/getcart', fetchUser, async (req, res) => {
  console.log("GetCart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error" + error);
  }
});
