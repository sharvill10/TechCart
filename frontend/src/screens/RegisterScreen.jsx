import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, AtSign, KeyRound, Eye, EyeOff, Coffee, ArrowRight } from 'lucide-react';
import { setCredentials } from '../slices/authSlice';
import { useRegisterMutation } from '../slices/userApiSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Full Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Za-z]/, 'Password must contain a letter')
      .matches(/\d/, 'Password must contain a number')
      .matches(/[@$!%*?&#]/, 'Password must contain a special character')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const submitHandler = async (values, { setSubmitting }) => {
    try {
      const res = await register(values).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'An error occurred');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
              <Coffee size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-1">Join Tech Cart and start shopping</p>
          </div>

          <div className="px-8 pb-8">
            <Formik
              initialValues={{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
              }} 
              validationSchema={validationSchema}
              onSubmit={submitHandler}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <Field
                        type="text"
                        name="name"
                        className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Enter your name"
                      />
                    </div>
                    <ErrorMessage name="name" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Email Address</label>
                    <div className="relative">
                      <AtSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <Field
                        type="email"
                        name="email"
                        className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage name="email" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Password</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <Field
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">Confirm Password</label>
                    <div className="relative">
                      <KeyRound size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                      <Field
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="p" className="text-red-600 text-sm" />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? 'Creating Account...' : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
