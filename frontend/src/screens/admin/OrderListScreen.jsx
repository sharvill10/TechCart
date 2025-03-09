import React from 'react';
import { Link } from 'react-router-dom';
import { X, Loader as LoaderIcon } from 'lucide-react';
import { useGetOrdersQuery } from '../../slices/ordersApiSlice';

// Simple Loader component using Lucide
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <LoaderIcon className="animate-spin h-8 w-8 text-gray-700" />
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

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">USER</th>
                <th className="py-3 px-4 text-left">DATE</th>
                <th className="py-3 px-4 text-left">TOTAL</th>
                <th className="py-3 px-4 text-left">PAID</th>
                <th className="py-3 px-4 text-left">DELIVERED</th>
                <th className="py-3 px-4 text-left"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{order._id}</td>
                  <td className="py-3 px-4">{order.user && order.user.name}</td>
                  <td className="py-3 px-4">{order.createdAt.substring(0, 10)}</td>
                  <td className="py-3 px-4">${order.totalPrice}</td>
                  <td className="py-3 px-4">
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <X size={16} className="text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <X size={16} className="text-red-500" />
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Link
                      to={`/order/${order._id}`}
                      className="bg-white border border-gray-300 text-gray-700 py-1 px-3 rounded text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;