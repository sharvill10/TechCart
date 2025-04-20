import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  AtSign,
  KeyRound,
  Eye,
  EyeOff,
  Coffee,
  ArrowRight,
} from "lucide-react";
import { setCredentials } from "../slices/authSlice";
import { useRegisterMutation } from "../slices/userApiSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[A-Za-z]/, "Password must contain a letter")
      .matches(/\d/, "Password must contain a number")
      .matches(/[@$!%*?&#]/, "Password must contain a special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const submitHandler = async (values, { setSubmitting }) => {
    try {
      const res = await register(values).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error || "An error occurred");
    }
    setSubmitting(false);
  };

  // // Handle OAuth authentication
  // const handleOAuthSignup = (provider) => {
  //   // Redirect to backend OAuth endpoint
  //   window.location.href = `/api/users/oauth/${provider}?redirect=${redirect}`;
  // };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
              <Coffee size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-1">
              Join Tech Cart and start shopping
            </p>
          </div>

          <div className="px-8 pb-8">
            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={submitHandler}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      />
                      <Field
                        type="text"
                        name="name"
                        className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Enter your name"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <AtSign
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      />
                      <Field
                        type="email"
                        name="email"
                        className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <KeyRound
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      />
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Create a password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <KeyRound
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      />
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="w-full py-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="p"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                // onClick={() => handleOAuthSignup('google')}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Google
                </span>
              </button>
              <button 
                // onClick={() => handleOAuthSignup('facebook')}
                className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-blue-600 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-sm font-medium text-gray-700">
                  Facebook
                </span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  to={redirect ? `/login?redirect=${redirect}` : "/login"}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
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