import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

// Simple Loader component
const Loader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Simple Message component
const Message = ({ children, variant }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-400';
      case 'danger':
        return 'bg-red-100 text-red-700 border-red-400';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-400';
    }
  };

  return (
    <div className={`p-4 mb-4 border rounded-lg ${getVariantClasses()}`}>
      {children}
    </div>
  );
};

const OrderScreen = () => {
  const { id: orderId } = useParams();
  
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);
  
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  
  const { userInfo } = useSelector((state) => state.auth);

  // Test payment function
  async function onApproveTest() {
    try {
      await payOrder({ orderId });
      refetch();
      toast.success('Order is paid');
    } catch (err) {
      console.error('Payment error:', err);
      toast.error(err?.data?.message || err.error || 'Payment failed');
    }
  }

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order marked as delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Delivery status update failed');
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order {order._id}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Shipping</h2>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-blue-500">{order.user.email}</a></p>
            <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
            {order.isDelivered ? (
              <Message variant="success">Delivered on {order.deliveredAt}</Message>
            ) : (
              <Message variant="danger">Not Delivered</Message>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {order.isPaid ? (
              <Message variant="success">Paid on {order.paidAt}</Message>
            ) : (
              <Message variant="danger">Not Paid</Message>
            )}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <ul className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg" />
                    <Link to={`/product/${item.product}`} className="text-blue-500">{item.name}</Link>
                    <span>{item.qty} x ${item.price} = ${item.qty * item.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <ul className="space-y-2">
            <li className="flex justify-between"><span>Items</span> <span>${order.itemsPrice}</span></li>
            <li className="flex justify-between"><span>Shipping</span> <span>${order.shippingPrice}</span></li>
            <li className="flex justify-between"><span>Tax</span> <span>${order.taxPrice}</span></li>
            <li className="flex justify-between font-bold"><span>Total</span> <span>${order.totalPrice}</span></li>
          </ul>
          {!order.isPaid && (
            <div className="mt-4 p-4 border rounded-lg">
              {loadingPay && <Loader />}
              
              <button
                className="w-full mb-4 p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-bold"
                onClick={onApproveTest}
                disabled={loadingPay}
              >
                {loadingPay ? 'Processing...' : 'Pay Order'}
              </button>
            </div>
          )}
          
          {loadingDeliver && <Loader />}
          
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <button 
              onClick={deliverHandler} 
              className="w-full mt-4 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
              disabled={loadingDeliver}
            >
              {loadingDeliver ? 'Processing...' : 'Mark As Delivered'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;