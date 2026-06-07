import React, { createContext, useContext, useState, useEffect } from 'react';
import * as cartApi from '../services/cartService';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (isAuthenticated) {
      fetchServerCart();
    } else {
      loadLocalCart();
    }
  }, [isAuthenticated]);

  const fetchServerCart = async () => {
    try {
      setLoading(true);
      const res = await cartApi.getMyCart();
      const cart = res.result || res;
      setCartItems(cart.items || []);
      setTotalAmount(cart.totalAmount || 0);
    } catch (error) {
      console.error("Error fetching cart from server:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCart = () => {
    const localCart = JSON.parse(localStorage.getItem('elephant_cart')) || [];
    setCartItems(localCart);
    calculateLocalTotal(localCart);
    setLoading(false);
  };

  const calculateLocalTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalAmount(total);
  };

  const saveLocalCart = (items) => {
    localStorage.setItem('elephant_cart', JSON.stringify(items));
    setCartItems(items);
    calculateLocalTotal(items);
  };

  // productDetails should contain: productName, productImage, colorName, versionName, price
  const addToCart = async (variantId, quantity, productDetails = {}) => {
    if (isAuthenticated) {
      try {
        await cartApi.addToCart(variantId, quantity);
        await fetchServerCart(); // Refresh cart to get updated IDs and totals
      } catch (error) {
        console.error("Error adding to server cart:", error);
        throw error;
      }
    } else {
      const currentCart = [...cartItems];
      const existingItemIndex = currentCart.findIndex(item => item.variantId === variantId);
      
      if (existingItemIndex >= 0) {
        currentCart[existingItemIndex].quantity += quantity;
        currentCart[existingItemIndex].subTotal = currentCart[existingItemIndex].quantity * currentCart[existingItemIndex].price;
      } else {
        currentCart.push({
          id: Date.now(), // Fake ID for local cart
          variantId,
          quantity,
          subTotal: productDetails.price * quantity,
          ...productDetails
        });
      }
      saveLocalCart(currentCart);
    }
  };

  const updateQuantity = async (itemId, variantId, quantity) => {
    if (quantity < 1) return;
    
    if (isAuthenticated) {
      try {
        await cartApi.updateCartItem(itemId, variantId, quantity);
        await fetchServerCart();
      } catch (error) {
        console.error("Error updating server cart:", error);
      }
    } else {
      const currentCart = [...cartItems];
      const itemIndex = currentCart.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        currentCart[itemIndex].quantity = quantity;
        currentCart[itemIndex].subTotal = quantity * currentCart[itemIndex].price;
        saveLocalCart(currentCart);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    if (isAuthenticated) {
      try {
        await cartApi.removeFromCart(itemId);
        await fetchServerCart();
      } catch (error) {
        console.error("Error removing from server cart:", error);
      }
    } else {
      const currentCart = cartItems.filter(item => item.id !== itemId);
      saveLocalCart(currentCart);
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clearCart();
        await fetchServerCart();
      } catch (error) {
        console.error("Error clearing server cart:", error);
      }
    } else {
      saveLocalCart([]);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      totalAmount,
      cartCount,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      fetchServerCart // Exposed in case we need manual sync later (e.g. on login)
    }}>
      {children}
    </CartContext.Provider>
  );
};
