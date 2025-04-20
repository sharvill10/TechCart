import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productApiSlice";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Image,
  Tag,
  Layers,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";

const Loader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    <span className="ml-3 text-gray-600 font-medium">
      Loading product data...
    </span>
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

  return (
    <div className={`p-5 mb-5 border rounded-lg ${getVariantClasses()}`}>
      <div className="flex items-start">
        <div>{children}</div>
      </div>
    </div>
  );
};

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success("Product updated successfully");
      refetch();
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/admin/productlist"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Product List
      </Link>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            Update product information and details
          </p>
        </div>

        {loadingUpdate && (
          <Message variant="info">
            <div className="flex items-center">
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Updating product information...
            </div>
          </Message>
        )}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message ||
              error.error ||
              "An error occurred while fetching product data"}
          </Message>
        ) : (
          <div className="p-6">
            <form onSubmit={submitHandler}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Package className="h-4 w-4 mr-2 text-gray-500" />
                      Product Name
                    </div>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-gray-500" />
                      Price
                    </div>
                  </label>
                  <input
                    type="number"
                    id="price"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="brand"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-gray-500" />
                      Brand
                    </div>
                  </label>
                  <input
                    type="text"
                    id="brand"
                    placeholder="Enter brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="countInStock"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-gray-500" />
                      Count In Stock
                    </div>
                  </label>
                  <input
                    type="number"
                    id="countInStock"
                    placeholder="Enter stock count"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Category
                    </div>
                  </label>
                  <input
                    type="text"
                    id="category"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Image className="h-4 w-4 mr-2 text-gray-500" />
                      Image URL
                    </div>
                  </label>
                  <input
                    type="text"
                    id="image"
                    placeholder="Enter image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label
                    htmlFor="imageFile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2 text-gray-500" />
                      Upload Image
                    </div>
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      id="imageFile"
                      onChange={uploadFileHandler}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
                    {loadingUpload && (
                      <div className="ml-3 flex items-center text-sm text-gray-600">
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Uploading...
                      </div>
                    )}
                  </div>
                  {image && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">
                        Current image:
                      </div>
                      <div className="h-20 w-20 border rounded-md overflow-hidden">
                        <img
                          src={image}
                          alt={name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-gray-500" />
                      Description
                    </div>
                  </label>
                  <textarea
                    id="description"
                    rows="4"
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  ></textarea>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end space-x-3">
                <Link
                  to="/admin/productlist"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  disabled={loadingUpdate}
                >
                  {loadingUpdate ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      Updating...
                    </span>
                  ) : (
                    "Update Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductEditScreen;
