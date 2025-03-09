import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productApiSlice';


const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({ productId, name, price, image, brand, category, description, countInStock }).unwrap();
      toast.success('Product updated');
      refetch();
      navigate('/admin/productlist');
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
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <Link to='/admin/productlist' className='text-blue-500 hover:underline mb-4 inline-block'>
        Go Back
      </Link>
      <h1 className="text-2xl font-semibold mb-4">Edit Product</h1>
      {(loadingUpdate || isLoading) && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error.data.message}</p>}
      <form onSubmit={submitHandler} className="space-y-4">
        <input type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Enter price" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Enter image url" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-2 border rounded" />
        <input type="file" onChange={uploadFileHandler} className="w-full p-2 border rounded" />
        {loadingUpload && <p className="text-gray-500">Uploading...</p>}
        <input type="text" placeholder="Enter brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-2 border rounded" />
        <input type="number" placeholder="Enter countInStock" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Enter category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded" />
        <input type="text" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update</button>
      </form>
    </div>
  );
};

export default ProductEditScreen;
