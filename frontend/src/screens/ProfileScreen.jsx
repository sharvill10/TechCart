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
  AlertCircle
} from "lucide-react";
import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/userApiSlice";

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

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4">
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
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
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
      </div>
    </div>
  );
};

export default ProfileScreen;