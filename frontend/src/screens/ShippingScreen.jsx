// ShippingScreen.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { Home, MapPin, Mail, Globe, ArrowRight, Truck } from 'lucide-react';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <CheckoutSteps step1 />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/5 bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <Truck className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Shipping Details</h1>
            </div>
            
            <form onSubmit={submitHandler} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="address">
                  Address
                </label>
                <div className="relative">
                  <Home size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <input
                    type="text"
                    id="address"
                    placeholder="Enter your street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium" htmlFor="city">
                    City
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <input
                      type="text"
                      id="city"
                      placeholder="Enter your city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <input
                      type="text"
                      id="postalCode"
                      placeholder="Enter your postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-gray-700 text-sm font-medium" htmlFor="country">
                  Country
                </label>
                <div className="relative">
                  <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                  <input
                    type="text"
                    id="country"
                    placeholder="Enter your country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
              >
                <span>Continue to Payment</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
          
          <div className="md:w-2/5 bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Information</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Please provide your shipping details to ensure your order is delivered to the correct location.</p>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Important Note</h3>
                <p className="text-sm text-blue-700">
                  We currently ship to most countries worldwide. Standard shipping takes 3-5 business days depending on your location.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingScreen;
