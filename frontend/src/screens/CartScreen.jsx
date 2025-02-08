import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, Trash2 } from "lucide-react";
import { addToCart, removeFromCart } from "../slices/cartSlice";

const CartScreen = () => {
  const dispatch = useDispatch();
  const cartData = useSelector((state) => state.cart);
  const cartItems = cartData?.cartItems || [];

  const handleQtyChange = (item, type) => {
    const newQty = type === "increase" ? item.qty + 1 : item.qty - 1;
    if (newQty > 0 && newQty <= item.countInStock) {
      dispatch(addToCart({ ...item, qty: newQty }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-600">Your cart is empty</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b py-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </h2>
                    <p className="text-sm text-gray-600">{item.brand}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <p className="text-gray-800 font-semibold">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQtyChange(item, "decrease")}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition disabled:opacity-50"
                      disabled={item.qty <= 1}
                    >
                      <Minus className="w-5 h-5 text-gray-600" />
                    </button>
                    <span className="text-lg font-semibold">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item, "increase")}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-200 transition disabled:opacity-50"
                      disabled={item.qty >= item.countInStock}
                    >
                      <Plus className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  <p className="text-gray-800 font-semibold">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between text-gray-600 mb-2">
                <p>Items Price:</p>
                <p>${cartData.itemsPrice}</p>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <p>Shipping Price:</p>
                <p>${cartData.shippingPrice}</p>
              </div>
              <div className="flex justify-between text-gray-600 mb-2">
                <p>Tax:</p>
                <p>${cartData.taxPrice}</p>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-800">
                <p>Total Price:</p>
                <p>${cartData.totalPrice}</p>
              </div>
              <div className="mt-4 text-gray-700">
                <p>
                  Payment Method:{" "}
                  <span className="font-semibold">
                    {cartData.paymentMethod}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;
