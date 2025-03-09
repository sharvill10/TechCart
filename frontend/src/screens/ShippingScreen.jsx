// ShippingScreen.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import { Home, MapPin, Mail, Globe, ArrowRight, Truck } from 'lucide-react';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define validation schema with Yup
  const validationSchema = Yup.object({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    postalCode: Yup.string().required('Postal code is required'),
    country: Yup.string().required('Country is required')
  });

  // Initial values from existing shipping address or empty strings
  const initialValues = {
    address: shippingAddress.address || '',
    city: shippingAddress.city || '',
    postalCode: shippingAddress.postalCode || '',
    country: shippingAddress.country || ''
  };

  const submitHandler = (values) => {
    dispatch(saveShippingAddress(values));
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
            
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submitHandler}
            >
              {({ errors, touched }) => (
                <Form className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="address">
                      Address
                    </label>
                    <div className="relative">
                      <Home size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <Field
                        type="text"
                        id="address"
                        name="address"
                        placeholder="Enter your street address"
                        className={`w-full py-3 pl-10 pr-3 border rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
                          errors.address && touched.address 
                            ? 'border-red-500 focus:ring-red-200 focus:border-red-400' 
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <ErrorMessage 
                      name="address" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-medium" htmlFor="city">
                        City
                      </label>
                      <div className="relative">
                        <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <Field
                          type="text"
                          id="city"
                          name="city"
                          placeholder="Enter your city"
                          className={`w-full py-3 pl-10 pr-3 border rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
                            errors.city && touched.city 
                              ? 'border-red-500 focus:ring-red-200 focus:border-red-400' 
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <ErrorMessage 
                        name="city" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-medium" htmlFor="postalCode">
                        Postal Code
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <Field
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          placeholder="Enter your postal code"
                          className={`w-full py-3 pl-10 pr-3 border rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
                            errors.postalCode && touched.postalCode 
                              ? 'border-red-500 focus:ring-red-200 focus:border-red-400' 
                              : 'border-gray-300'
                          }`}
                        />
                      </div>
                      <ErrorMessage 
                        name="postalCode" 
                        component="div" 
                        className="text-red-500 text-sm mt-1" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium" htmlFor="country">
                      Country
                    </label>
                    <div className="relative">
                      <Globe size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <Field
                        type="text"
                        id="country"
                        name="country"
                        placeholder="Enter your country"
                        className={`w-full py-3 pl-10 pr-3 border rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 ${
                          errors.country && touched.country 
                            ? 'border-red-500 focus:ring-red-200 focus:border-red-400' 
                            : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <ErrorMessage 
                      name="country" 
                      component="div" 
                      className="text-red-500 text-sm mt-1" 
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight size={18} />
                  </button>
                </Form>
              )}
            </Formik>
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