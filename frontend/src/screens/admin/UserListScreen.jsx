import React from 'react';


import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { useDeleteUserMutation, useGetUsersQuery } from '../../slices/userApiSlice';
import { Check, Edit, LucideTimerReset, Trash } from 'lucide-react';

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold my-4">Users</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error?.data?.message || error.error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">NAME</th>
                <th className="py-2 px-4 border">EMAIL</th>
                <th className="py-2 px-4 border">ADMIN</th>
                <th className="py-2 px-4 border"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{user._id}</td>
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                  </td>
                  <td className="py-2 px-4 border text-center">
                    {user.isAdmin ? (
                      <Check className="inline text-green-500" />
                    ) : (
                      <LucideTimerReset className="inline text-red-500" />
                    )}
                  </td>
                  <td className="py-2 px-4 border">
                    {!user.isAdmin && (
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/user/${user._id}/edit`}
                          className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                        >
                          <Edit className="text-gray-700" />
                        </Link>
                        <button
                          className="bg-red-500 p-2 rounded hover:bg-red-600"
                          onClick={() => deleteHandler(user._id)}
                        >
                          <Trash className="text-white" />
                        </button>
                      </div>
                    )}
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

export default UserListScreen;