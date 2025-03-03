import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { CreditCard, ArrowRight, AlertTriangle, Wallet, WalletCards } from 'lucide-react';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (!shippingAddress.address) {
      setError('Please complete shipping address first');
      setTimeout(() => {
        navigate('/shipping');
      }, 2000);
    }
  }, [navigate, shippingAddress]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <CheckoutSteps step1 step2 />
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/5 bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <WalletCards className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Payment Method</h1>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-gray-700 text-sm font-medium">
                  Select Payment Method
                </label>
                
                <div className="space-y-3">
                  <div className="relative border border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors cursor-pointer">
                    <input
                      type="radio"
                      id="PayPal"
                      name="paymentMethod"
                      value="PayPal"
                      checked={paymentMethod === 'PayPal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="absolute right-4 top-4 w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="PayPal" className="flex items-center cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                      <Wallet size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">PayPal</p>
                        <p className="text-sm text-gray-500">Pay with your PayPal account</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="relative border border-gray-300 rounded-xl p-4 hover:border-blue-400 transition-colors cursor-pointer opacity-50">
                    <input
                      type="radio"
                      id="CreditCard"
                      name="paymentMethod"
                      value="CreditCard"
                      disabled
                      className="absolute right-4 top-4 w-4 h-4 accent-blue-600"
                    />
                    <label htmlFor="CreditCard" className="flex items-center cursor-not-allowed">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                        <CreditCard size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Credit Card</p>
                        <p className="text-sm text-gray-500">Coming soon</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
              >
                <span>Continue to Review</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
          
          <div className="md:w-2/5 bg-white p-6 rounded-xl shadow-md h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Information</h2>
            <div className="space-y-4">
              <p className="text-gray-600">Please select your preferred payment method to proceed with your order.</p>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-800 mb-2">Secure Payments</h3>
                <p className="text-sm text-blue-700">
                  All transactions are secure and encrypted. We never store your credit card information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;