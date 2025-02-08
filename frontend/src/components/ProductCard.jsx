import { ShoppingCart, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200">
      <div className="relative bg-gradient-to-br from-blue-50 to-white p-2">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-md rounded-full hover:bg-white transition-all shadow">
          <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors duration-200" />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-1">
          <Link to={`/product/${product._id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        {/* Price & Stock */}
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-2">
          <span className="text-lg font-bold text-blue-700">${product.price.toFixed(2)}</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              product.countInStock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          disabled={product.countInStock === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          <span className="text-xs font-semibold">Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
