import { useState } from 'react';
import { 
  ShoppingCart, 
  CreditCard, 
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useGetProductDetailsQuery } from '../slices/productApiSlice';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1); 

  const {
    data: product,
    isLoading,
    isError,
    error
  } = useGetProductDetailsQuery({ productId });

  console.log(product);
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50">
        <div className="text-red-600 text-lg mb-4">
          {error?.data?.message || 'Error loading product'}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-blue-50">
        <div className="text-blue-600 text-lg mb-4">Product not found</div>
        <button
          onClick={() => navigate(-1)}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  const productImages = [
    product.image,
    ...(product.additionalImages || [])
  ].filter(Boolean);

  const handleImageChange = (direction) => {
    if (productImages.length <= 1) return;
    
    setSelectedImage((prev) => 
      direction === 'next' 
        ? (prev + 1) % productImages.length 
        : (prev - 1 + productImages.length) % productImages.length
    );
  };

  const handleQtyChange = (type) => {
    if (type === 'increase' && qty < product.countInStock) {
      setQty(qty + 1);
    }
    if (type === 'decrease' && qty > 1) {
      setQty(qty - 1);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 relative">
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 bg-white p-2 rounded-full shadow-md hover:bg-blue-50 transition"
      >
        <ChevronLeft className="w-6 h-6 text-blue-600" />
      </button>
      
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden relative">
          <div className="md:flex">
            <div className="md:w-1/2 relative bg-gradient-to-br from-blue-50 to-white p-2">
              <div className="relative h-[400px]">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-2"
                />
                {productImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => handleImageChange('prev')}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-blue-50 transition"
                    >
                      <ChevronLeft className="w-5 h-5 text-blue-600" />
                    </button>
                    <button 
                      onClick={() => handleImageChange('next')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-blue-50 transition"
                    >
                      <ChevronRight className="w-5 h-5 text-blue-600" />
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="md:w-1/2 p-6 space-y-6">
              <h1 className="text-3xl font-bold text-blue-900">{product.name}</h1>
              <p className="text-gray-600 text-base">{product.description}</p>
              
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-700">${(product?.price || 0).toFixed(2)}</div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${product?.countInStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product?.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              {/* Quantity Selector */}
              {product.countInStock > 0 && (
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <button 
                    onClick={() => handleQtyChange('decrease')}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition disabled:opacity-50"
                    disabled={qty <= 1}
                  >
                    <Minus className="w-5 h-5 text-blue-600" />
                  </button>
                  <span className="text-lg font-semibold">{qty}</span>
                  <button 
                    onClick={() => handleQtyChange('increase')}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 transition disabled:opacity-50"
                    disabled={qty >= product.countInStock}
                  >
                    <Plus className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              )}

              <div className="flex space-x-3 pt-3">
                <button 
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm font-semibold">Add to Cart</span>
                </button>
                <button 
                  disabled={product.countInStock === 0}
                  className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg hover:bg-blue-200 transition flex items-center justify-center space-x-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm font-semibold">Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
