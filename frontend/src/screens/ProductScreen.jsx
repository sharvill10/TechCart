import { useState } from 'react';
import { 
  ShoppingCart, 
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Star,
  Heart,
  Share2
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { useGetProductDetailsQuery } from '../slices/productApiSlice';
import LoadingComponent from '../components/LoadingComponent';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  const {
    data: product,
    isLoading,
    isError,
    error
  } = useGetProductDetailsQuery(productId);

  if (isLoading) {
    return <LoadingComponent />;
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
  
  const selectImage = (index) => {
    setSelectedImage(index);
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
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-medium text-gray-800 truncate">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Image gallery */}
            <div className="md:w-1/2 bg-white">
              <div className="relative h-96 md:h-[500px] bg-gray-50">
                <img 
                  src={productImages[selectedImage]} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4"
                />
                
                {productImages.length > 1 && (
                  <>
                    <button 
                      onClick={() => handleImageChange('prev')}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={() => handleImageChange('next')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100 transition"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Thumbnail gallery */}
              {productImages.length > 1 && (
                <div className="flex justify-center gap-2 p-4 overflow-x-auto">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(index)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                        selectedImage === index ? 'border-blue-500 shadow-md' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="md:w-1/2 p-6 md:p-8 space-y-6">
              {/* Product header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {product.brand}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleFavorite}
                      className={`p-2 rounded-full ${
                        isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                      } hover:bg-gray-200 transition`}
                      aria-label="Add to favorites"
                    >
                      <Heart 
                        className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} 
                      />
                    </button>
                    <button
                      className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                      aria-label="Share product"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-4 h-4 ${
                          index < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.rating.toFixed(1)} ({product.numReviews} reviews)
                  </span>
                </div>
              </div>
              
              {/* Price and stock */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-3xl font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.countInStock > 10 
                  ? 'bg-green-100 text-green-800' 
                  : product.countInStock > 0
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.countInStock > 10 
                    ? 'In Stock' 
                    : product.countInStock > 0
                      ? `Only ${product.countInStock} left`
                      : 'Out of Stock'}
                </div>
              </div>
              
              {/* Tabs */}
              <div>
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'description'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab('specs')}
                    className={`px-4 py-2 font-medium text-sm ${
                      activeTab === 'specs'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Specifications
                  </button>
                </div>
                
                <div className="py-4">
                  {activeTab === 'description' && (
                    <p className="text-gray-700">{product.description}</p>
                  )}
                  
                  {activeTab === 'specs' && (
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Brand</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Category</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-500">Listed on</span>
                        <span className="font-medium">{formatDate(product.createdAt)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Simplified Quantity selector */}
              {product.countInStock > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Quantity</span>
                  <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-gray-200">
                    <button 
                      onClick={() => handleQtyChange('decrease')}
                      className="h-8 w-8 flex items-center justify-center bg-white hover:bg-gray-50 transition disabled:opacity-50"
                      disabled={qty <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4 text-gray-500" />
                    </button>
                    <div className="px-4 h-8 flex items-center justify-center bg-white border-l border-r border-gray-200">
                      <span className="font-medium text-gray-800">{qty}</span>
                    </div>
                    <button 
                      onClick={() => handleQtyChange('increase')}
                      className="h-8 w-8 flex items-center justify-center bg-white hover:bg-gray-50 transition disabled:opacity-50"
                      disabled={qty >= product.countInStock}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to cart button */}
              <div className="pt-2">
                <button 
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Add to Cart</span>
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