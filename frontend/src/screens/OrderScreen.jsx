import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlice";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  CreditCard,
  User,
  Mail,
  MapPin,
  ArrowLeft,
} from "lucide-react";

// Professional Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
  </div>
);

// Professional Status component
const StatusBadge = ({ type, children }) => {
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div
      className={`px-3 py-2 text-sm rounded-md border ${getTypeClasses()} inline-flex items-center`}
    >
      {type === "success" && <CheckCircle size={16} className="mr-2" />}
      {type === "danger" && <XCircle size={16} className="mr-2" />}
      {type === "warning" && <AlertTriangle size={16} className="mr-2" />}
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

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  // Format currency values
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });
  };

  // Format date values
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Payment handler
  async function handlePayment() {
    try {
      await payOrder({ orderId });
      refetch();
      toast.success("Payment processed successfully");
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Payment processing failed"
      );
    }
  }

  // Deliver handler
  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order marked as delivered");
    } catch (err) {
      toast.error(
        err?.data?.message || err.error || "Failed to update delivery status"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    {error?.data?.message ||
                      error.error ||
                      "An error occurred loading the order details."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                Order #{orderId.substring(orderId.length - 8)}
              </h1>
              <Link
                to="/profile"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Orders
              </Link>
            </div>
            <p className="text-gray-600 text-sm">
              Order ID: {orderId} • Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Overview */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Status
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start mb-4">
                    <CreditCard className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        Payment Status
                      </h3>
                      {order.isPaid ? (
                        <div className="space-y-1">
                          <StatusBadge type="success">Paid</StatusBadge>
                          <p className="text-sm text-gray-600 mt-1">
                            Paid on {formatDate(order.paidAt)}
                          </p>
                        </div>
                      ) : (
                        <StatusBadge type="danger">
                          Awaiting Payment
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <Truck className="h-6 w-6 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        Delivery Status
                      </h3>
                      {order.isDelivered ? (
                        <div className="space-y-1">
                          <StatusBadge type="success">Delivered</StatusBadge>
                          <p className="text-sm text-gray-600 mt-1">
                            Delivered on {formatDate(order.deliveredAt)}
                          </p>
                        </div>
                      ) : (
                        <StatusBadge type="warning">
                          Pending Delivery
                        </StatusBadge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Customer Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Customer
                      </h3>
                      <p className="font-medium text-gray-900">
                        {order.user.name}
                      </p>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        <a
                          href={`mailto:${order.user.email}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {order.user.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">
                        Shipping Address
                      </h3>
                      <p className="text-gray-900">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-gray-900">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-900">
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Items
                </h2>
              </div>
              <div className="p-6">
                {order.orderItems.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <p className="ml-3 text-sm">
                        This order does not contain any items.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <th className="px-4 py-3 w-16"></th>
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3 text-right">Price</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {order.orderItems.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-16 w-16 object-cover rounded border border-gray-200"
                              />
                            </td>
                            <td className="px-4 py-4">
                              <Link
                                to={`/product/${item.product}`}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                {item.name}
                              </Link>
                            </td>
                            <td className="px-4 py-4 text-right text-gray-900">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-4 py-4 text-center text-gray-900">
                              {item.qty}
                            </td>
                            <td className="px-4 py-4 text-right font-medium text-gray-900">
                              {formatCurrency(item.qty * item.price)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Summary
                </h2>
              </div>
              <div className="p-6">
                <dl className="space-y-3">
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="text-gray-900 font-medium">
                      {formatCurrency(order.itemsPrice)}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-600">Shipping</dt>
                    <dd className="text-gray-900 font-medium">
                      {formatCurrency(order.shippingPrice)}
                    </dd>
                  </div>
                  <div className="flex justify-between py-1 text-sm">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="text-gray-900 font-medium">
                      {formatCurrency(order.taxPrice)}
                    </dd>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between text-base">
                      <dt className="font-medium text-gray-900">Total</dt>
                      <dd className="font-bold text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </dd>
                    </div>
                  </div>
                </dl>

                {/* Payment Method */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                    <h3 className="text-sm font-medium text-gray-900">
                      Payment Method
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6">{order.paymentMethod}</p>

                  {/* Payment Actions */}
                  {!order.isPaid && (
                    <div>
                      {loadingPay ? (
                        <Loader />
                      ) : (
                        <button
                          onClick={handlePayment}
                          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Process Payment
                        </button>
                      )}
                    </div>
                  )}

                  {/* Admin Actions */}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <div className="mt-4">
                        {loadingDeliver ? (
                          <Loader />
                        ) : (
                          <button
                            onClick={deliverHandler}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Mark as Delivered
                          </button>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Help & Support Card */}
            <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Need Help?
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  If you have any questions about this order, please contact our
                  customer support team.
                </p>
                <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
