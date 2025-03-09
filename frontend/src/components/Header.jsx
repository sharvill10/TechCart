import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, UserCircle, Menu, X, ChevronDown, Package, Shield } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../slices/authSlice";
import { useLogoutMutation } from "../slices/userApiSlice";
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  
  const cart = useSelector((state) => state.cart);
  const count = cart?.cartItems?.length || 0;
  const { userInfo } = useSelector((state) => state.auth);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);
  const toggleAdminDropdown = () => setIsAdminDropdownOpen(!isAdminDropdownOpen);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      // Reset cart state when user logs out
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-[#111827] text-white shadow-lg relative z-50">
      <div className="container mx-auto px-4 py-4 max-w-screen-xl">
        <div className="flex items-center justify-between">
          {/* Logo - Keeping original */}
          <Link
            to="/"
            className="flex items-center space-x-3 max-w-xs"
            onClick={closeMenu}
          >
            <img
              src="/images/tech-cart-logo-final.png"
              alt="Tech Cart Logo"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <h1 className="text-lg md:text-xl font-bold">Tech Cart</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8">
              <li>
                <Link
                  to="/"
                  className="hover:text-gray-300 transition-colors"
                >
                  <span className="font-medium">Home</span>
                </Link>
              </li>
              <li className="relative">
                <Link
                  to="/cart"
                  className="flex items-center space-x-2 hover:text-gray-300 transition-colors"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Cart</span>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                      {count > 9 ? "9+" : count}
                    </span>
                  )}
                </Link>
              </li>
              
              {/* User Authentication - Desktop */}
              {userInfo ? (
                <li className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center space-x-2 hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">{userInfo.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <UserCircle className="w-4 h-4 text-gray-700" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/myorders"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <Package className="w-4 h-4 text-gray-700" />
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logoutHandler();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                </li>
              )}
              
              {/* Admin Dropdown - Desktop */}
              {userInfo && userInfo.isAdmin && (
                <li className="relative">
                  <button
                    onClick={toggleAdminDropdown}
                    className="flex items-center space-x-2 hover:text-gray-300 transition-colors focus:outline-none"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Admin Dropdown Menu */}
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M21 12H3M12 3v18" />
                        </svg>
                        <span>Products</span>
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4" />
                          <path d="M9 17l-5 5H4v-4l5-5" />
                          <path d="M14 17l5 5h-4v-4l-5-5" />
                        </svg>
                        <span>Orders</span>
                      </Link>
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                        <span>Users</span>
                      </Link>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Cart Icon for Mobile */}
            <Link to="/cart" className="relative" onClick={closeMenu}>
              <ShoppingBag className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>

            {/* Hamburger/Close Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`fixed inset-0 bg-[#111827] transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "translate-x-full"
            } md:hidden`}
            style={{ top: "60px" }}
          >
            <nav className="h-full">
              <ul className="flex flex-col items-center justify-center h-full space-y-8 py-8 max-w-md mx-auto">
                <li>
                  <Link
                    to="/"
                    className="text-xl font-medium hover:text-gray-300 transition-colors"
                    onClick={closeMenu}
                  >
                    Home
                  </Link>
                </li>
                
                {/* User Authentication - Mobile */}
                {userInfo ? (
                  <>
                    <li>
                      <Link
                        to="/profile"
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-3"
                        onClick={closeMenu}
                      >
                        <UserCircle className="w-6 h-6" />
                        <span>Profile</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/myorders"
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-3"
                        onClick={closeMenu}
                      >
                        <Package className="w-6 h-6" />
                        <span>My Orders</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          closeMenu();
                          logoutHandler();
                        }}
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-3"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors shadow-sm"
                      onClick={closeMenu}
                    >
                      <UserCircle className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </Link>
                  </li>
                )}
                
                {/* Admin Links - Mobile */}
                {userInfo && userInfo.isAdmin && (
                  <>
                    <li className="text-xl font-bold flex items-center space-x-3">
                      <Shield className="w-6 h-6" />
                      <span>Admin</span>
                    </li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-3 pl-8"
                        onClick={closeMenu}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <path d="M21 12H3M12 3v18" />
                        </svg>
                        <span>Products</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-3 pl-8"
                        onClick={closeMenu}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4" />
                          <path d="M9 17l-5 5H4v-4l5-5" />
                          <path d="M14 17l5 5h-4v-4l-5-5" />
                        </svg>
                        <span>Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-3 pl-8"
                        onClick={closeMenu}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                        </svg>
                        <span>Users</span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;