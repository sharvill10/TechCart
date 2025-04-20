import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/productApiSlice";

const Loader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    <span className="ml-3 text-gray-600 font-medium">Loading products...</span>
  </div>
);

const Message = ({ variant, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "danger":
        return "bg-red-50 text-red-700 border-red-200";
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "info":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />;
      case "success":
        return <Plus className="h-5 w-5 mr-2 flex-shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className={`p-5 mb-5 border rounded-lg ${getVariantClasses()}`}>
      <div className="flex items-start">
        {getIcon()}
        <div>{children}</div>
      </div>
    </div>
  );
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
};

const ProductListScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery({});
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const deleteHandler = async (id, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await deleteProduct(id);
        toast.success(`Product "${productName}" deleted successfully`);
        refetch();
      } catch (err) {
        toast.error(
          err?.data?.message || err.error || "Error deleting product"
        );
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        const result = await createProduct().unwrap();
        toast.success("Product created successfully");
        refetch();
        // Optionally redirect to edit the newly created product
        // navigate(`/admin/product/${result._id}/edit`);
      } catch (err) {
        toast.error(
          err?.data?.message || err.error || "Error creating product"
        );
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === "asc" ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return null;
  };

  const categories = products
    ? [
        "all",
        ...new Set(products.map((product) => product.category).filter(Boolean)),
      ]
    : ["all"];

  const filteredProducts = products
    ? products
        .filter((product) => {
          if (categoryFilter !== "all" && product.category !== categoryFilter)
            return false;

          return (
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product._id.toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
        .sort((a, b) => {
          let fieldA, fieldB;

          switch (sortField) {
            case "price":
              fieldA = parseFloat(a.price);
              fieldB = parseFloat(b.price);
              break;
            case "name":
              fieldA = a.name.toLowerCase();
              fieldB = b.name.toLowerCase();
              break;
            case "brand":
              fieldA = a.brand.toLowerCase();
              fieldB = b.brand.toLowerCase();
              break;
            case "category":
              fieldA = a.category.toLowerCase();
              fieldB = b.category.toLowerCase();
              break;
            default:
              fieldA = a[sortField];
              fieldB = b[sortField];
          }

          if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
          if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
          return 0;
        })
    : [];

  const isProcessing = isLoading || loadingCreate || loadingDelete;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
        <div className="mt-4 md:mt-0">
          <button
            onClick={createProductHandler}
            disabled={isProcessing}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={18} /> Create Product
          </button>
        </div>
      </div>

      {loadingCreate && (
        <Message variant="info">Creating new product...</Message>
      )}
      {loadingDelete && <Message variant="info">Deleting product...</Message>}

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products by name, brand, or ID"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {categories.length > 1 && (
          <div className="relative">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 appearance-none focus:ring-blue-500 focus:border-blue-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message ||
            error.error ||
            "An error occurred while fetching products"}
        </Message>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {products
                ? `${filteredProducts.length} of ${products.length} products`
                : "No products found"}
            </p>
          </div>

          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("_id")}
                    >
                      <div className="flex items-center">
                        <span>ID</span>
                        {getSortIcon("_id")}
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center">
                        <span>Product Name</span>
                        {getSortIcon("name")}
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center">
                        <span>Price</span>
                        {getSortIcon("price")}
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center">
                        <span>Category</span>
                        {getSortIcon("category")}
                      </div>
                    </th>
                    <th
                      className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort("brand")}
                    >
                      <div className="flex items-center">
                        <span>Brand</span>
                        {getSortIcon("brand")}
                      </div>
                    </th>
                    <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4 text-sm text-gray-500 font-mono">
                          <span className="block truncate max-w-[120px]">
                            {product._id}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {product.category ? (
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                              {product.category}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {product.brand || "—"}
                        </td>
                        <td className="py-4 px-4 text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/product/${product._id}/edit`}
                              className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                              title="Edit Product"
                            >
                              <Edit size={18} />
                            </Link>
                            <button
                              onClick={() =>
                                deleteHandler(product._id, product.name)
                              }
                              className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              title="Delete Product"
                              disabled={loadingDelete}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        {searchTerm || categoryFilter !== "all"
                          ? "No products match your search criteria."
                          : 'No products found. Click "Create Product" to add one.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
