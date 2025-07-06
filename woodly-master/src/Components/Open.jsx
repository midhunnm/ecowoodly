import React, { useEffect, useState } from 'react';
import './open.css';
import { useCart } from './CartContext';
import axios from 'axios';

const Open = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  const handleAddToCart = (product) => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please login to add items to cart.');
      return;
    }

    const cartItem = {
      _id: product._id, // ✅ use _id from MongoDB
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    addToCart(cartItem);
  };

  return (
    <div className="home-container">
      <div className="image-container">
        <img src="bg1.jpg" alt="Wood Background" className="background-image" />
        <div className="image-text">
          <div className="main-text">Going eco has never been Easier</div>
          <div className="sub-text">Make a Difference With Every Purchase, Shop Sustainable.</div>
        </div>
      </div>

      <div className="product-section">
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product._id}> {/* ✅ FIXED: use _id as key */}
              <img src={product.image} alt={product.name} className="product-img" />
              <h3>{product.name}</h3>
              <p className="product-price">₹{product.price}</p>
              <button className="buy-btn" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Open;
