import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
} from "lucide-react";
import { setCredentials } from "../slices/authSlice";
import { useProfileMutation } from "../slices/userApiSlice";
import LoadingComponent from "../components/LoadingComponent";

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading }] = useProfileMutation();

  // Get current date for the "Member since" display
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Handle case when userInfo is null or not loaded yet
  if (!userInfo) {
    return (
  <LoadingComponent/>
    );
  }

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .test(
        "password-validation",
        "Password must include letters, numbers and special characters",
        function(value) {
          // Skip validation if password field is empty (not changing password)
          if (!value) return true;
          
          const hasLetter = /[a-zA-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value);

          
          return hasLetter && hasNumber && hasSpecial;
        }
      ),
    confirmPassword: Yup.string()
      .test("passwords-match", "Passwords must match", function(value) {
        return !this.parent.password || value === this.parent.password;
      })
  });

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await updateProfile({
        name: values.name,
        email: values.email,
        password: values.password || undefined, // Only send password if provided
      }).unwrap();
      
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
      setIsEditing(false); // Exit edit mode after successful update
      setSubmitting(false);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      setSubmitting(false);
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      

        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200 mb-6">
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
            <div className="flex flex-col md:flex-row md:items-center gap-6 pt-4 pb-6 border-b border-gray-200">
              {/* Avatar */}
              <div className={`w-24 h-24 rounded-full text-white flex items-center justify-center text-2xl font-bold shadow-md ${getAvatarColor(userInfo.name)}`}>
                {getInitials(userInfo.name)}
              </div>
              
              {/* Name and Email */}
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-800">{userInfo.name}</h2>
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
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
            </div>
          </div>
          
          <div className="p-6">
            <Formik
              initialValues={{
                name: userInfo.name || '',
                email: userInfo.email || '',
                password: '',
                confirmPassword: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-gray-700 text-sm font-medium">Full Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <Field
                          type="text"
                          id="name"
                          name="name"
                          disabled={!isEditing}
                          className={`w-full py-3 pl-10 pr-3 border rounded-lg ${
                            isEditing ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400" : "bg-gray-50 text-gray-600 border-gray-200"
                          } ${errors.name && touched.name ? "border-red-300" : ""} transition-colors`}
                        />
                        <ErrorMessage name="name" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email Address</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          disabled={!isEditing}
                          className={`w-full py-3 pl-10 pr-3 border rounded-lg ${
                            isEditing ? "bg-white border-blue-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400" : "bg-gray-50 text-gray-600 border-gray-200"
                          } ${errors.email && touched.email ? "border-red-300" : ""} transition-colors`}
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
                      </div>
                    </div>
                    
                    {isEditing && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="password" className="block text-gray-700 text-sm font-medium">New Password</label>
                          <div className="relative">
                            <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                            <Field
                              type="password"
                              id="password"
                              name="password"
                              placeholder="Leave blank to keep current"
                              className={`w-full py-3 pl-10 pr-3 border rounded-lg bg-white ${
                                errors.password && touched.password ? "border-red-300" : "border-blue-300"
                              } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-medium">Confirm New Password</label>
                          <div className="relative">
                            <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
                            <Field
                              type="password"
                              id="confirmPassword"
                              name="confirmPassword"
                              placeholder="Leave blank to keep current"
                              className={`w-full py-3 pl-10 pr-3 border rounded-lg bg-white ${
                                errors.confirmPassword && touched.confirmPassword ? "border-red-300" : "border-blue-300"
                              } focus:ring-2 focus:ring-blue-200 focus:border-blue-400`}
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs mt-1" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Password disclaimer */}
                  {isEditing && (
                    <div className="mt-4 flex items-start space-x-2 p-3 bg-amber-50 rounded-lg border border-amber-100">
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
                        disabled={isSubmitting || isLoading}
                        className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
                      >
                        {isSubmitting || isLoading ? (
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
                </Form>
              )}
            </Formik>
          </div>
        </div>
        
        {/* Additional Information Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Manage your privacy settings and control how your information is used across the platform.
              </p>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded border border-gray-300 transition-colors">
                Manage Settings
              </button>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Account Security</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Review your account security settings and enable additional protection for your account.
              </p>
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded border border-gray-300 transition-colors">
                View Security Options
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;