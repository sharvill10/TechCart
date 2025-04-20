import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import {
  AtSign,
  KeyRound,
  AlertTriangle,
  ArrowRight,
  Coffee,
  Eye,
  EyeOff,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SignInScreen = () => {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const submitHandler = async (values, { setSubmitting, setStatus }) => {
    try {
      const res = await login(values).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      const errorMessage =
        err?.data?.message || err.error || "An error occurred";
      setStatus({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
              <Coffee size={28} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
            <p className="text-gray-600 mt-1">
              Sign in to your Tech Cart account
            </p>
          </div>

          <div className="px-8 pb-8">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={submitHandler}
            >
              {({ isSubmitting, status, errors, touched }) => (
                <Form className="space-y-6">
                  {status && status.error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-start gap-3">
                      <AlertTriangle
                        size={18}
                        className="text-red-500 flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm">{status.error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label
                      className="block text-gray-700 text-sm font-medium"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <AtSign
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      />
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className={`w-full py-3 pl-10 pr-3 border ${
                          errors.email && touched.email
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-gray-300"
                        } rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label
                        className="block text-gray-700 text-sm font-medium"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <KeyRound
                        size={18}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500"
                      />
                      <Field
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className={`w-full py-3 pl-10 pr-12 border ${
                          errors.password && touched.password
                            ? "border-red-500 ring-1 ring-red-500"
                            : "border-gray-300"
                        } rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
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
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? (
                      "Signing In..."
                    ) : (
                      <>
                        <span>Sign In</span>
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
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
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
              <button className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
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
                Don't have an account?{" "}
                <Link
                  to={redirect ? `/register?redirect=${redirect}` : "/register"}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
