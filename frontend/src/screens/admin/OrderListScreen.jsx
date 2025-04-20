import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  X,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Loader as LoaderIcon,
  Filter,
} from "lucide-react";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";

const Loader = () => (
  <div className="flex justify-center items-center py-12">
    <LoaderIcon className="animate-spin h-10 w-10 text-blue-600" />
    <span className="ml-3 text-gray-600 font-medium">Loading orders...</span>
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
        {variant === "danger" && <X className="h-5 w-5 mr-2 flex-shrink-0" />}
        {variant === "success" && (
          <Check className="h-5 w-5 mr-2 flex-shrink-0" />
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ isPaid, isDelivered }) => {
  if (isPaid && isDelivered) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
        Completed
      </span>
    );
  } else if (isPaid) {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
        Processing
      </span>
    );
  } else {
    return (
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
        Pending
      </span>
    );
  }
};

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filter, setFilter] = useState("all");

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

  const filteredOrders = orders
    ? orders
        .filter((order) => {
          if (filter === "paid" && !order.isPaid) return false;
          if (filter === "unpaid" && order.isPaid) return false;
          if (filter === "delivered" && !order.isDelivered) return false;
          if (filter === "undelivered" && order.isDelivered) return false;

          return (
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.user &&
              order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        })
        .sort((a, b) => {
          let fieldA, fieldB;

          switch (sortField) {
            case "createdAt":
              fieldA = new Date(a.createdAt);
              fieldB = new Date(b.createdAt);
              break;
            case "totalPrice":
              fieldA = a.totalPrice;
              fieldB = b.totalPrice;
              break;
            case "user":
              fieldA = a.user ? a.user.name.toLowerCase() : "";
              fieldB = b.user ? b.user.name.toLowerCase() : "";
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-600 mt-1 md:mt-0">
          {orders
            ? `${filteredOrders.length} of ${orders.length} orders`
            : "Loading orders..."}
        </p>
      </div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders by ID or customer name"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 appearance-none focus:ring-blue-500 focus:border-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Orders</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="delivered">Delivered</option>
              <option value="undelivered">Undelivered</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Filter className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message ||
            error.error ||
            "An error occurred while fetching orders"}
        </Message>
      ) : orders && orders.length === 0 ? (
        <Message variant="info">No orders found</Message>
      ) : (
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
                      <span>Order ID</span>
                      {getSortIcon("_id")}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("user")}
                  >
                    <div className="flex items-center">
                      <span>Customer</span>
                      {getSortIcon("user")}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      {getSortIcon("createdAt")}
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("totalPrice")}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      {getSortIcon("totalPrice")}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">
                      <span className="block truncate max-w-[120px]">
                        {order._id}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {order.user ? order.user.name : "Unknown User"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <StatusBadge
                        isPaid={order.isPaid}
                        isDelivered={order.isDelivered}
                      />
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {order.isPaid ? (
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-1.5" />
                          <span className="text-green-700">
                            {formatDate(order.paidAt)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="h-5 w-5 text-red-500 mr-1.5" />
                          <span className="text-red-700">Not paid</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {order.isDelivered ? (
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-1.5" />
                          <span className="text-green-700">
                            {formatDate(order.deliveredAt)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <X className="h-5 w-5 text-red-500 mr-1.5" />
                          <span className="text-red-700">Not delivered</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-medium">
                      <Link
                        to={`/order/${order._id}`}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-white">
              <p className="text-gray-500">
                No orders match your search criteria
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderListScreen;
