import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

  useEffect(() => {
    if (userEmail) {
      fetchCart();
    }
  }, [userEmail]);

  const fetchCart = async () => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`http://localhost:4000/cart/${userEmail}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };
  
  const addToCart = async (product) => {
    if (!userEmail) return;

    try {
      // Check if the item already exists in cartItems
      const existingItem = cartItems.find((item) => item.productId === product._id);

      const res = await axios.post('http://localhost:4000/cart/add', {
        email: userEmail,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: existingItem ? 1 : product.quantity || 1,
      });

      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!userEmail) return;
    if (quantity < 1) {
      await removeFromCart(productId);
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/cart/update', {
        email: userEmail,
        productId,
        quantity,
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeFromCart = async (productId) => {
    if (!userEmail) return;
    try {
      const res = await axios.post('http://localhost:4000/cart/remove', {
        email: userEmail,
        productId,
      });
      setCartItems(res.data);
    } catch (err) {
      console.error('Failed to remove item:', err);
    }
  };

  const clearCart = async () => {
    if (!userEmail) return;
    try {
      await axios.post('http://localhost:4000/cart/clear', { email: userEmail });
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
