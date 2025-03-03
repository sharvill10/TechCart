import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, AtSign, KeyRound, AlertTriangle, Coffee, UserPlus } from 'lucide-react';
import { setCredentials } from '../slices/authSlice';
import { useRegisterMutation } from '../slices/userApiSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      setError(err?.data?.message || err.error || 'An error occurred');
      toast.error(err?.data?.message || err.error || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Logo/Header area */}
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-50 mb-4">
              <Coffee size={28} className="text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-1">Join Tech Cart and start shopping</p>
          </div>
          
          <div className="px-8 pb-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start gap-3">
                <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={submitHandler}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-gray-700 text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <AtSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">Password</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      required
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Password Guidelines */}
              <div className="mt-4 flex items-start space-x-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <AlertTriangle size={18} className="text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  Passwords must be at least 8 characters and include a combination of letters, numbers, and special characters.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition-colors font-semibold mt-6"
              >
                {isLoading ? 'Creating Account...' : (
                  <>
                    <UserPlus size={18} />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center mt-6 text-gray-600">
                Already have an account?{' '}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : '/login'}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;