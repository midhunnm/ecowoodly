import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';
import { Link } from 'react-router';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

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
            <div className="product-card" key={product.id}>
              <img src={product.image} alt={product.name} className="product-img" />
              <h3>{product.name}</h3>
              <p className="product-price">₹{product.price}</p>
              <Link to="/login"><button className="buy-btn">Add to Cart</button></Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
