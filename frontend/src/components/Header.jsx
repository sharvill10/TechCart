import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useSelector } from "react-redux";

const Header = () => {
  const cart = useSelector((state) => state.cart);
  const count = cart?.cartItems?.length || 0; // Get cart item count safely

  return (
    <header className="bg-blue-900 text-white p-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <h1 className="text-2xl font-bold tracking-wide">Tech Cart</h1>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-8 items-center text-lg">
            {/* Cart Icon with Count */}
            <li className="relative">
              <Link to="/cart" className="flex items-center space-x-2 hover:text-blue-200 transition">
                <ShoppingCart className="w-7 h-7" />
                <span className="font-medium">Cart</span>
                {count > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </Link>
            </li>

            {/* Sign In Button */}
            <li>
              <Link to="/signin" className="flex items-center space-x-2 hover:text-blue-200 transition">
                <User className="w-7 h-7" />
                <span className="font-medium">Sign In</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
