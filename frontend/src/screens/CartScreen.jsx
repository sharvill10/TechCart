// CartScreen.js
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import CheckoutSteps from '../components/CheckoutSteps';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cartData = useSelector((state) => state.cart);
  const cartItems = cartData?.cartItems || [];
  const { userInfo } = useSelector((state) => state.auth);

  const handleQtyChange = (item, type) => {
    const newQty = type === "increase" ? item.qty + 1 : item.qty - 1;
    if (newQty > 0 && newQty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleProceedToCheckout = () => {
    if (userInfo) {
      navigate("/shipping");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <CheckoutSteps />
        
        {cartItems.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-md text-center">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
              </div>

              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-colors"
                  >
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                          {item.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                        <p className="text-lg font-bold text-blue-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                      <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-lg">
                        <button
                          onClick={() => handleQtyChange(item, "decrease")}
                          className="p-1 hover:bg-gray-200 rounded-md transition disabled:opacity-50"
                          disabled={item.qty <= 1}
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.qty}</span>
                        <button
                          onClick={() => handleQtyChange(item, "increase")}
                          className="p-1 hover:bg-gray-200 rounded-md transition disabled:opacity-50"
                          disabled={item.qty >= item.countInStock}
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      <p className="text-lg font-semibold text-gray-800 w-24 text-right">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>

                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3 bg-white p-6 rounded-xl shadow-md h-fit">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <p>Items Price:</p>
                  <p>${cartData.itemsPrice}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Shipping Price:</p>
                  <p>${cartData.shippingPrice}</p>
                </div>
                <div className="flex justify-between text-gray-600">
                  <p>Tax:</p>
                  <p>${cartData.taxPrice}</p>
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <p>Total Price:</p>
                  <p>${cartData.totalPrice}</p>
                </div>
              </div>

              {cartData.paymentMethod && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="text-gray-700">
                    Payment Method:{" "}
                    <span className="font-semibold">{cartData.paymentMethod}</span>
                  </p>
                </div>
              )}

              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-xl mt-6 font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;