const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 4000;

// ✅ MongoDB Connection
mongoose.connect(
  'mongodb+srv://harikuttan87:harikuttan87@cluster0.tfyh8w1.mongodb.net/ecodb4?retryWrites=true&w=majority&appName=cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// ✅ Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const cartItemSchema = new mongoose.Schema({
  email: String,
  productId: String,
  name: String,
  price: Number,
  image: String,
  quantity: Number,
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
});

const orderSchema = new mongoose.Schema({
  email: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],
  total: Number,
  address: String,
  paymentMethod: String,
  createdAt: { type: Date, default: Date.now },
});

// ✅ Models
const User = mongoose.model('User', userSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());

// ✅ Insert Admin If Not Exists
(async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@ict.com' });
    if (!existingAdmin) {
      await new User({
        username: 'Admin',
        email: 'admin@ict.com',
        password: 'admin123',
      }).save();
      console.log('✅ Admin inserted');
    }
  } catch (err) {
    console.error('❌ Admin insert failed:', err);
  }
})();

// ✅ Auth Routes
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (email === 'admin@ict.com') {
    return res.status(403).json({ error: 'Admin account cannot be registered here.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  await new User({ username, email, password }).save();
  res.json({ message: 'Registration successful' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({
    message: 'Login successful',
    user: {
      username: user.username,
      email,
      isAdmin: email === 'admin@ict.com',
    },
  });
});

// ✅ Cart Routes
app.get('/cart/:email', async (req, res) => {
  try {
    const items = await CartItem.find({ email: req.params.email });
    res.json(items);
  } catch {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

app.post('/cart/add', async (req, res) => {
  const { email, productId, name, price, image, quantity } = req.body;
  try {
    let item = await CartItem.findOne({ email, productId });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await new CartItem({ email, productId, name, price, image, quantity }).save();
    }
    const updated = await CartItem.find({ email });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

app.post('/cart/remove', async (req, res) => {
  try {
    await CartItem.deleteOne({ email: req.body.email, productId: req.body.productId });
    const updated = await CartItem.find({ email: req.body.email });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
});

app.post('/cart/clear', async (req, res) => {
  try {
    await CartItem.deleteMany({ email: req.body.email });
    res.json([]);
  } catch {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

app.post('/cart/update', async (req, res) => {
  try {
    await CartItem.updateOne(
      { email: req.body.email, productId: req.body.productId },
      { $set: { quantity: req.body.quantity } }
    );
    const updated = await CartItem.find({ email: req.body.email });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// ✅ Product Routes
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Order Routes
app.post('/order/place', async (req, res) => {
  const { email, items, total, address, paymentMethod } = req.body;
  try {
    await new Order({ email, items, total, address, paymentMethod }).save();
    await CartItem.deleteMany({ email });
    res.json({ message: 'Order placed successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

// ✅ Admin Routes
app.get('/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.post('/admin/products/add', async (req, res) => {
  try {
    await new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
    }).save();
    res.json({ message: 'Product added successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

app.put('/admin/products/update/:id', async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    await Product.updateOne(
      { _id },
      {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
      }
    );
    res.json({ message: 'Product updated successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/admin/products/delete/:id', async (req, res) => {
  try {
    const _id = new mongoose.Types.ObjectId(req.params.id);
    await Product.deleteOne({ _id });
    res.json({ message: 'Product deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
