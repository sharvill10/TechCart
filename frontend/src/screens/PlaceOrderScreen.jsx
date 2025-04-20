import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";
import LoadingComponent from "../components/LoadingComponent";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  ArrowRight,
  AlertTriangle,
  Package,
} from "lucide-react";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      setError("Please complete shipping address first");
      setTimeout(() => {
        navigate("/shipping");
      }, 2000);
    } else if (!cart.paymentMethod) {
      setError("Please select a payment method first");
      setTimeout(() => {
        navigate("/payment");
      }, 2000);
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order");
      setError(err?.data?.message || "Failed to place order");
    }
  };

  if (isLoading) return <LoadingComponent />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <CheckoutSteps step1 step2 step3 />

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/5 bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-semibold text-gray-800">
                Review Your Order
              </h1>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin size={20} className="text-blue-500" />
                  <h3 className="font-medium text-gray-800">
                    Shipping Address
                  </h3>
                </div>
                <p className="text-gray-600 pl-8">
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard size={20} className="text-blue-500" />
                  <h3 className="font-medium text-gray-800">Payment Method</h3>
                </div>
                <p className="text-gray-600 pl-8">{cart.paymentMethod}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Package size={20} className="text-blue-500" />
                  <h3 className="font-medium text-gray-800">Order Items</h3>
                </div>
                <div className="pl-8 space-y-3">
                  {cartItems.length === 0 ? (
                    <p className="text-gray-500">Your cart is empty</p>
                  ) : (
                    cartItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-md overflow-hidden">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.qty} × ₹{item.price} = ₹
                              {item.qty * item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <button
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span>Place Order</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="md:w-2/5 bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">₹{cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-medium">₹{cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span className="font-medium">₹{cart.taxPrice}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3 mt-3">
                  <span>Total:</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
                <h3 className="font-medium text-blue-800 mb-2">
                  Delivery Information
                </h3>
                <p className="text-sm text-blue-700">
                  Your order will be processed within 24 hours and delivery
                  typically takes 3-5 business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
