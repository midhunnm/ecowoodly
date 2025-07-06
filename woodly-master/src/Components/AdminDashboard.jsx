import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './admin.css';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', image: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:4000/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:4000/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.image) {
      alert('All fields are required.');
      return;
    }

    try {
      const data = {
        name: form.name,
        price: parseFloat(form.price),
        image: form.image,
      };

      if (editId) {
        await axios.put(`http://localhost:4000/admin/products/update/${editId}`, data);
      } else {
        await axios.post('http://localhost:4000/admin/products/add', data);
      }

      setForm({ name: '', price: '', image: '' });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error('Failed to submit product', err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
    });
    setEditId(product._id); // Use _id instead of id
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axios.delete(`http://localhost:4000/admin/products/delete/${_id}`);
      fetchProducts();
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="form-section">
        <h3>{editId ? 'Update Product' : 'Add New Product'}</h3>
        <input
          type="text"
          placeholder="Product Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <button onClick={handleSubmit}>
          {editId ? 'Update Product' : 'Add Product'}
        </button>
      </div>

      <h3>Products</h3>
      <div className="product-list">
        {products.map((p) => (
          <div key={p._id} className="product-item">
            <img src={p.image} alt={p.name} />
            <div className="product-info">
              <h4>{p.name}</h4>
              <p>₹{p.price}</p>
              <button onClick={() => handleEdit(p)}>Edit</button>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h3>Orders</h3>
      <div className="order-list">
        {orders.map((order, i) => (
          <div key={i} className="order-item">
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} (₹{item.price})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
