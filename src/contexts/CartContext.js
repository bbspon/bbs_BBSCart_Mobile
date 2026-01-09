import React, { createContext, useContext, useState } from 'react';

// Create the context
const CartContext = createContext();

// Cart Provider
export const CartProvider = ({ children }) => {
  // Mock cart data for testing
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 59.99,
      quantity: 2,
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 129.99,
      quantity: 1,
    },
    {
      id: '3',
      name: 'Bluetooth Speaker',
      price: 39.99,
      quantity: 3,
    },
  ]);

  // Add item to cart
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Calculate total
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart
export const useCart = () => useContext(CartContext);
