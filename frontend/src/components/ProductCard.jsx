import { ShoppingCart, Eye } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../slices/cartSlice";

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  
  const handleAddCart = (item) => {
    dispatch(addToCart({ ...item, qty: 1 })); // ✅ Ensure 'qty' is passed
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 border border-gray-200 hover:shadow-lg">
      {/* Image Wrapper */}
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative bg-gradient-to-br from-blue-50 to-white p-2 sm:p-4 flex justify-center">
          <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-1 sm:p-2 transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-2 sm:p-4">
        {/* Title */}
        <Link 
          to={`/product/${product._id}`} 
          className="block hover:text-blue-600 transition-colors"
        >
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* Price & Stock - Always in a row */}
        <Link to={`/product/${product._id}`} className="block">
          <div className="flex flex-row items-center justify-between bg-blue-50 p-2 sm:p-3 rounded-lg my-2 sm:my-3">
            <span className="text-base sm:text-lg font-bold text-blue-700">
              ${product.price.toFixed(2)}
            </span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                product.countInStock > 0 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </Link>

        {/* Action Buttons - Stacked on all mobile sizes for better clickability */}
        <div className="flex flex-col space-y-2 mt-2 sm:mt-3">
          <button
            disabled={product.countInStock === 0}
            onClick={() => handleAddCart(product)}
            className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-xs font-semibold">Add to Cart</span>
          </button>

          <Link
            to={`/product/${product._id}`}
            className="w-full bg-gray-200 text-gray-800 py-2 px-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span className="text-xs font-semibold">View Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;