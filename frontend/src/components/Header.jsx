import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, Menu, X, ChevronDown, Package } from "lucide-react";
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
          {/* Logo */}
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
                  <ShoppingCart className="w-6 h-6" />
                  <span className="font-medium">Cart</span>
                  {count > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
                    <User className="w-5 h-5" />
                    <span className="font-medium">{userInfo.name}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/myorders"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4" />
                          <span>My Orders</span>
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          setIsUserDropdownOpen(false);
                          logoutHandler();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <Link
                    to="/login"
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                  >
                    <User className="w-5 h-5" />
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
                    <span className="font-medium">Admin</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {/* Admin Dropdown Menu */}
                  {isAdminDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 z-50">
                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsAdminDropdownOpen(false)}
                      >
                        Users
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
              <ShoppingCart className="w-6 h-6" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
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
                        className="text-xl font-medium hover:text-gray-300 transition-colors"
                        onClick={closeMenu}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/myorders"
                        className="text-xl font-medium hover:text-gray-300 transition-colors flex items-center space-x-2"
                        onClick={closeMenu}
                      >
                        <Package className="w-5 h-5" />
                        <span>My Orders</span>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          closeMenu();
                          logoutHandler();
                        }}
                        className="text-xl font-medium hover:text-gray-300 transition-colors"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
                      onClick={closeMenu}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Sign In</span>
                    </Link>
                  </li>
                )}
                
                {/* Admin Links - Mobile */}
                {userInfo && userInfo.isAdmin && (
                  <>
                    <li className="text-xl font-bold">Admin</li>
                    <li>
                      <Link
                        to="/admin/productlist"
                        className="text-xl font-medium hover:text-gray-300 transition-colors"
                        onClick={closeMenu}
                      >
                        Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/orderlist"
                        className="text-xl font-medium hover:text-gray-300 transition-colors"
                        onClick={closeMenu}
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/userlist"
                        className="text-xl font-medium hover:text-gray-300 transition-colors"
                        onClick={closeMenu}
                      >
                        Users
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