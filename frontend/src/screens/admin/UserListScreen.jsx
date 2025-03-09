import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/userApiSlice';
import { Check, Edit, X, Trash2, Search, ChevronDown, ChevronUp, Shield, Mail } from 'lucide-react';

// Enhanced Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
    <span className="ml-3 text-gray-600 font-medium">Loading users...</span>
  </div>
);

// Enhanced Message component
const Message = ({ variant, children }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'info':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className={`p-5 mb-5 border rounded-lg ${getVariantClasses()}`}>
      <div className="flex items-start">
        {variant === 'danger' && <X className="h-5 w-5 mr-2 flex-shrink-0" />}
        {variant === 'success' && <Check className="h-5 w-5 mr-2 flex-shrink-0" />}
        <div>{children}</div>
      </div>
    </div>
  );
};

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();
  
  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('all');

  const deleteHandler = async (id, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await deleteUser(id);
        toast.success(`User "${userName}" deleted successfully`);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error || 'Error deleting user');
      }
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />;
    }
    return null;
  };

  // Filter and sort users
  const filteredUsers = users ? users.filter(user => {
    // Apply admin/regular user filter
    if (filter === 'admin' && !user.isAdmin) return false;
    if (filter === 'regular' && user.isAdmin) return false;
    
    // Apply search filter
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }).sort((a, b) => {
    // Apply sorting
    let fieldA, fieldB;
    
    switch (sortField) {
      case 'name':
        fieldA = a.name.toLowerCase();
        fieldB = b.name.toLowerCase();
        break;
      case 'email':
        fieldA = a.email.toLowerCase();
        fieldB = b.email.toLowerCase();
        break;
      case 'isAdmin':
        fieldA = a.isAdmin ? 1 : 0;
        fieldB = b.isAdmin ? 1 : 0;
        break;
      default:
        fieldA = a[sortField];
        fieldB = b[sortField];
    }
    
    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-1 md:mt-0">
          {users ? `${filteredUsers.length} of ${users.length} users` : 'Loading users...'}
        </p>
      </div>

      {loadingDelete && <Message variant="info">Deleting user...</Message>}
      
      {/* Filters and search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search users by name, email, or ID"
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
              <option value="all">All Users</option>
              <option value="admin">Admins Only</option>
              <option value="regular">Regular Users</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Shield className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error || 'An error occurred while fetching users'}
        </Message>
      ) : users && users.length === 0 ? (
        <Message variant="info">No users found</Message>
      ) : (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('_id')}
                  >
                    <div className="flex items-center">
                      <span>ID</span>
                      {getSortIcon('_id')}
                    </div>
                  </th>
                  <th 
                    className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      <span>Name</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="py-3.5 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('email')}
                  >
                    <div className="flex items-center">
                      <span>Email</span>
                      {getSortIcon('email')}
                    </div>
                  </th>
                  <th 
                    className="py-3.5 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('isAdmin')}
                  >
                    <div className="flex items-center justify-center">
                      <span>Admin</span>
                      {getSortIcon('isAdmin')}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-sm text-gray-500 font-mono">
                      <span className="block truncate max-w-[120px]">{user._id}</span>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      <a 
                        href={`mailto:${user.email}`} 
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <Mail className="h-4 w-4 mr-1 inline" />
                        {user.email}
                      </a>
                    </td>
                    <td className="py-4 px-4 text-sm text-center">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-4 w-4 mr-1" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <X className="h-4 w-4 mr-1" /> Regular
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right text-sm font-medium">
                      {!user.isAdmin && (
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/user/${user._id}/edit`}
                            className="bg-gray-100 text-gray-700 p-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            title="Edit User"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => deleteHandler(user._id, user.name)}
                            className="bg-red-100 text-red-700 p-2 rounded-md hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            title="Delete User"
                            disabled={loadingDelete}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 bg-white">
              <p className="text-gray-500">No users match your search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserListScreen;