import React, { useEffect, useState } from 'react';
import './Cart.css';
import { useCart } from './CartContext';
import axios from 'axios';

const Cart = () => {
  const { cartItems = [], updateQuantity, removeFromCart, clearCart, fetchCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState('saved');
  const [selectedPayment, setSelectedPayment] = useState('Debit Card');
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    pin: '',
    state: '',
    country: 'India',
  });
  const [savedNewAddress, setSavedNewAddress] = useState('');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const saveNewAddress = () => {
    const { street, city, pin, state, country } = newAddress;
    if (!street || !city || !pin || !state) {
      alert('Please fill all fields');
      return;
    }
    const fullAddress = `${street}, ${city}, ${pin}, ${state}, ${country}`;
    setSavedNewAddress(fullAddress);
    setSelectedAddress('savedNew');
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
    0
  );
  const delivery = 200;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + delivery + gst;

  const handleCompleteOrder = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to place an order');
      return;
    }

    let address = '';
    if (selectedAddress === 'saved') {
      address = 'woodly, CraftHouse, Kerala, India';
    } else if (selectedAddress === 'savedNew') {
      address = savedNewAddress;
    } else {
      alert('Please select or add an address');
      return;
    }

    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    try {
      await axios.post('http://localhost:4000/order/place', {
        email: userEmail,
        items: cartItems,
        total,
        address,
        paymentMethod: selectedPayment,
      });

      clearCart();
      alert('✅ Order placed successfully!');
    } catch (err) {
      console.error('Order placement failed:', err);
      alert('❌ Failed to place order');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo">Woodly</div>
        <div className="subtitle">Handcrafted with Love & Nature</div>
      </div>

      <div className="checkout-container">
        <div className="payment-form">
          {/* Address Form */}
          <h2 className="section-title">Delivery Address</h2>
          <div className={`saved-address ${selectedAddress === 'saved' ? 'selected' : ''}`} onClick={() => setSelectedAddress('saved')}>
            <div className="address-header">Home Address</div>
            <div className="address-details">woodly<br />CraftHouse<br />Kerala, India</div>
          </div>

          {savedNewAddress && (
            <div className={`saved-address ${selectedAddress === 'savedNew' ? 'selected' : ''}`} onClick={() => setSelectedAddress('savedNew')}>
              <div className="address-header">New Address</div>
              <div className="address-details">{savedNewAddress}</div>
            </div>
          )}

          <div className={`saved-address ${selectedAddress === 'new' ? 'selected' : ''}`} onClick={() => setSelectedAddress('new')}>
            <div className="address-header">+ Add New Address</div>
          </div>

          {selectedAddress === 'new' && (
            <div className="new-address-form">
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" name="street" value={newAddress.street} onChange={handleAddressChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input type="text" name="city" value={newAddress.city} onChange={handleAddressChange} />
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input type="text" name="pin" value={newAddress.pin} onChange={handleAddressChange} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <select name="state" value={newAddress.state} onChange={handleAddressChange}>
                    <option value="">Select State</option>
                    <option>Kerala</option>
                    <option>Tamil Nadu</option>
                    <option>Karnataka</option>
                    <option>Maharashtra</option>
                    <option>Gujarat</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" value="India" readOnly />
                </div>
              </div>
              <button className="save-address-btn" onClick={saveNewAddress}>Save Address</button>
            </div>
          )}

          {/* Payment */}
          <h2 className="section-title">Payment Method</h2>
          <div className="payment-methods">
            {['Debit Card', 'Credit Card', 'UPI', 'Cash on Delivery'].map((method) => (
              <div key={method} className={`payment-method ${selectedPayment === method ? 'selected' : ''}`} onClick={() => setSelectedPayment(method)}>
                <div className="payment-icon" />
                <div>{method}</div>
              </div>
            ))}
          </div>

          {['Debit Card', 'Credit Card'].includes(selectedPayment) && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="Name on Card" />
              </div>
            </>
          )}

          {selectedPayment === 'UPI' && (
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" placeholder="yourname@paytm" />
            </div>
          )}

          {selectedPayment === 'Cash on Delivery' && (
            <div className="cod-box">
              <p>Cash on Delivery</p>
              <p>Pay when you receive your wooden crafts</p>
            </div>
          )}

          <button className="pay-button" onClick={handleCompleteOrder}>
            Complete Order - ₹{total.toLocaleString()}
          </button>
        </div>

        {/* Cart Summary */}
        <div className="order-summary">
          <h3 className="summary-title">Your Cart</h3>

          {cartItems.length === 0 ? (
            <p className="empty-cart-msg">Your cart is empty.</p>
          ) : (
            <>
              {cartItems.map((item) => (
                <div className="order-item" key={item._id || item.productId}>
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <div className="item-name">{item.name}</div>
                    <div className="item-desc">Eco-friendly wooden product</div>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                    </div>
                    <button className="delete-btn" onClick={() => removeFromCart(item.productId)}>Remove</button>
                  </div>
                  <div className="item-price">₹{item.price.toLocaleString()}</div>
                </div>
              ))}

              <div className="cart-actions">
                <button className="clear-cart-btn" onClick={clearCart}>Empty Cart</button>
              </div>

              <div className="summary-row"><span>Subtotal:</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="summary-row"><span>Delivery:</span><span>₹{delivery}</span></div>
              <div className="summary-row"><span>GST (18%):</span><span>₹{gst}</span></div>
              <div className="summary-row total"><span>Total:</span><span>₹{total.toLocaleString()}</span></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
