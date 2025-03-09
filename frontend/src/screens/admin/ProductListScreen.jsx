import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCreateProductMutation, useDeleteProductMutation, useGetProductsQuery } from '../../slices/productApiSlice';

// Simple Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin h-8 w-8 border-4 border-gray-700 border-t-transparent rounded-full"></div>
  </div>
);

// Simple Message component
const Message = ({ variant, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-4 mb-4 border rounded ${getVariantClasses()}`}>
      {children}
    </div>
  );
};

const ProductListScreen = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery({});
  
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  
  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };
  
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  
  const createProductHandler = async () => {
    if (window.confirm('Are you sure you want to create a new product?')) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={createProductHandler}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Create Product
        </button>
      </div>

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data.message}</Message>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">NAME</th>
                <th className="py-3 px-4 text-left">PRICE</th>
                <th className="py-3 px-4 text-left">CATEGORY</th>
                <th className="py-3 px-4 text-left">BRAND</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
            {Array.isArray(data) && data.length > 0 ? (
  data.map((product, index) => (
    <tr key={index} className="hover:bg-gray-50">
      <td className="py-3 px-4">{product._id}</td>
      <td className="py-3 px-4">{product.name}</td>
      <td className="py-3 px-4">${product.price}</td>
      <td className="py-3 px-4">{product.category}</td>
      <td className="py-3 px-4">{product.brand}</td>
      <td className="py-3 px-4 flex gap-2">
        <Link
          to={`/admin/product/${product._id}/edit`}
          className="bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-100"
        >
          <Edit size={16} />
        </Link>
        <button
          onClick={() => deleteHandler(product._id)}
          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
        >
          <Trash2 size={16} />
        </button>
      </td>
    </tr>
  ))
) : (
  <tr>
    <td colSpan="6" className="py-3 px-4 text-center">
      No products found.
    </td>
  </tr>
)}



            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductListScreen;