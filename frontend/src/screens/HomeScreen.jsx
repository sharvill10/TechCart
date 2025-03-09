import React from "react";
import { ProductCard } from "../components/ProductCard";
import { useGetProductsQuery } from "../slices/productApiSlice";
import { Clock, AlertCircle } from "lucide-react";

const HomeScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
            <p className="text-center text-blue-800 font-medium">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center justify-center space-x-2 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <p className="text-center font-medium">Error loading products: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header with Breadcrumb */}
      {/* Page Header with Breadcrumb */}
<div className="mb-8">
  <div className="flex flex-col space-y-2">
   
    <h1 className="text-2xl font-semibold text-gray-900">
      Latest Products
    </h1>
    <p className="text-gray-600">Discover our newest collection of high-quality products</p>
  </div>
</div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products?.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full bg-white shadow-md rounded-lg p-8 text-center text-gray-600">
              No products available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;