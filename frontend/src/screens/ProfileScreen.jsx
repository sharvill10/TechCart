import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { 
  User, 
  Mail, 
  Shield, 
  Edit2, 
  Save, 
  X, 
  CheckCircle, 
  Calendar, 
  Clock,
  Award,
  Settings,
  AlertCircle,
  Package,
  Calendar as CalendarIcon,
  DollarSign,
  Truck,
  CreditCard,
  ExternalLink,
  FileText
} from "lucide-react";
import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/userApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlice";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useProfileMutation();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetMyOrdersQuery();

  // Get current date for the "Member since" display
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Only update form data when userInfo exists and changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [userInfo]);

  // Handle case when userInfo is null or not loaded yet
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <div className="flex items-center justify-center space-x-2">
            <Clock className="w-6 h-6 text-blue-600 animate-pulse" />
            <p className="text-center text-blue-800 font-medium">Loading profile information...</p>
          </div>
        </div>
      </div>
    );
  }

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    // Reset form data when canceling edit
    if (isEditing) {
      setFormData({
        name: userInfo.name || '',
        email: userInfo.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    try {
      const res = await updateProfile({
        name: formData.name,
        email: formData.email,
        password: formData.password || undefined, // Only send password if provided
      }).unwrap();
      
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Generate avatar background color based on name
  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 
      'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700',
      'bg-sky-500', 'bg-sky-600', 'bg-sky-700', 'bg-sky-800'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Get avatar initials
  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Function to format price
  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          {/* Header with gradient pattern instead of banner */}
          <div className="px-6 pt-6 pb-0 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={toggleEditMode}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-md ${
                  isEditing 
                    ? "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } transition-all`}
              >
                {isEditing ? (
                  <>
                    <X size={16} />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit2 size={16} />
                    <span>Edit Profile</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Profile Info with horizontal layout */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4 pb-6 border-b border-gray-100">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-md ${getAvatarColor(userInfo.name)}`}>
                {getInitials(userInfo.name)}
              </div>
              
              {/* Name and Email */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>
                <div className="flex items-center space-x-2 text-gray-500 mt-1">
                  <Mail size={16} />
                  <span>{userInfo.email}</span>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className={`${userInfo.isAdmin ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"} px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1`}>
                    {userInfo.isAdmin ? (
                      <>
                        <Award size={14} />
                        <span>Administrator</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        <span>User</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Profile Info */}
            <div className="py-4 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Calendar size={16} className="text-blue-600" />
                <span className="text-blue-800 text-sm">Member since {currentDate}</span>
              </div>
              
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle size={16} className="text-green-600" />
                <span className="text-green-800 text-sm">Email verified</span>
              </div>
            </div>
          </div>
        </div>
          
        {/* Profile Form Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">Account Settings</h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full py-3 pl-10 pr-3 border rounded-xl ${
                        isEditing ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400" : "bg-gray-50 text-gray-600 border-gray-200"
                      } transition-colors`}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-gray-700 text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full py-3 pl-10 pr-3 border rounded-xl ${
                        isEditing ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400" : "bg-gray-50 text-gray-600 border-gray-200"
                      } transition-colors`}
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-medium">New Password</label>
                      <div className="relative">
                        <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Leave blank to keep current"
                          className="w-full py-3 pl-10 pr-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-gray-700 text-sm font-medium">Confirm New Password</label>
                      <div className="relative">
                        <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Leave blank to keep current"
                          className="w-full py-3 pl-10 pr-3 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Password disclaimer */}
              {isEditing && (
                <div className="mt-4 flex items-start space-x-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800">
                    Passwords must be at least 8 characters and include a combination of letters, numbers, and special characters.
                    Leave both password fields blank if you don't want to change your password.
                  </p>
                </div>
              )}
              
              {isEditing && (
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-colors font-semibold"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <Clock className="animate-spin mr-2 h-5 w-5" />
                        Updating...
                      </span>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Orders Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Package className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">My Orders</h3>
            </div>
            
            {ordersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                <p className="text-blue-800">Loading your orders...</p>
              </div>
            ) : ordersError ? (
              <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl flex items-center space-x-2">
                <AlertCircle size={18} className="text-red-600" />
                <p>{ordersError?.data?.message || ordersError.error || "An error occurred loading your orders."}</p>
              </div>
            ) : orders && orders.length === 0 ? (
              <div className="bg-blue-50 border border-blue-100 text-blue-800 p-6 rounded-xl flex flex-col items-center justify-center">
                <Package className="w-12 h-12 text-blue-500 mb-3" />
                <p className="text-center font-medium">You haven't placed any orders yet.</p>
                <Link to="/" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-full rounded-xl overflow-hidden">
                  <div className="bg-gray-50 p-4">
                    <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-600">
                      <div className="col-span-2">ID</div>
                      <div className="col-span-2">DATE</div>
                      <div className="col-span-2">TOTAL</div>
                      <div className="col-span-2">PAID</div>
                      <div className="col-span-2">DELIVERED</div>
                      <div className="col-span-2 text-right">ACTIONS</div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                        <div className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-2 font-mono text-xs text-gray-600">{order._id}</div>
                          <div className="col-span-2 flex items-center">
                            <CalendarIcon size={14} className="text-gray-400 mr-1" />
                            <span className="text-sm">{order.createdAt.substring(0, 10)}</span>
                          </div>
                          <div className="col-span-2 font-medium text-gray-800 flex items-center">
                            <DollarSign size={14} className="text-green-600 mr-1" />
                            {formatPrice(order.totalPrice)}
                          </div>
                          <div className="col-span-2">
                            {order.isPaid ? (
                              <div className="flex items-center">
                                <span className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                                  <CreditCard size={12} />
                                  <span>{order.paidAt.substring(0, 10)}</span>
                                </span>
                              </div>
                            ) : (
                              <span className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-md text-xs">
                                <X size={12} />
                                <span>Not Paid</span>
                              </span>
                            )}
                          </div>
                          <div className="col-span-2">
                            {order.isDelivered ? (
                              <div className="flex items-center">
                                <span className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs">
                                  <Truck size={12} />
                                  <span>{order.deliveredAt.substring(0, 10)}</span>
                                </span>
                              </div>
                            ) : (
                              <span className="flex items-center space-x-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs">
                                <Clock size={12} />
                                <span>Pending</span>
                              </span>
                            )}
                          </div>
                          <div className="col-span-2 text-right">
                            <Link
                              to={`/order/${order._id}`}
                              className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                            >
                              <FileText size={14} />
                              <span>Details</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;