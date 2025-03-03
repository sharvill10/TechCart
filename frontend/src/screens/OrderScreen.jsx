import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
// import Message from '../components/Message';
// import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);
//   const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

//   useEffect(() => {
//     if (!errorPayPal && !loadingPayPal && paypal?.clientId) {
//       const loadPaypalScript = async () => {
//         // paypalDispatch({
//         //   type: 'resetOptions',
//         //   value: { 'client-id': paypal.clientId, currency: 'USD' },
//         // });
//         paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
//       };
//       if (order && !order.isPaid && !window.paypal) {
//         loadPaypalScript();
//       }
//     }
//   }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  const onApprove = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [{ amount: { value: order.totalPrice } }],
    }).then(orderID => orderID);
  };

  const onError = (err) => toast.error(err.message);

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
   <></>
  ) : error ? (
    <></>
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
            {/* {order.isDelivered ? <Message variant="success">Delivered on {order.deliveredAt}</Message> : <Message variant="danger">Not Delivered</Message>} */}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            {/* {order.isPaid ? <Message variant="success">Paid on {order.paidAt}</Message> : <Message variant="danger">Not Paid</Message>} */}
          </div>
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <h2>Order is empty</h2>
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
          {/* {!order.isPaid && (
            <div className="mt-4">
              {loadingPay && <Loader />}
              {isPending ? <Loader /> : <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />}
            </div>
          )} */}
          {loadingDeliver &&<></> }
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <button onClick={deliverHandler} className="w-full mt-4 p-2 bg-blue-500 text-white rounded-lg">Mark As Delivered</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;