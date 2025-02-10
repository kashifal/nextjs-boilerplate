'use client'
import { Eye, Pencil, Trash2, ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Link from 'next/link';

// Modal Component
const EditUserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    verified: user.verified
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(user._id, formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.verified ? 'ACTIVE' : 'BLOCKED'}
                onChange={(e) => setFormData({ ...formData, verified: e.target.value === 'ACTIVE' })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  useAdminAuth();
  useEffect(() => {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        setUsers(data.users);
      });
  }, []);

  const handleEdit = async (userId, updatedData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...updatedData
        })
      });

      if (response.ok) {
        const { user } = await response.json();
        setUsers(users.map(u => u._id === userId ? { ...u, ...user } : u));
        setSelectedUser(null); // Close modal
      }
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/user?id=${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter(user => user._id !== userId));
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen px-6 py-12 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 px-6 py-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  User name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Staked
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">$328.00,43</td>
                  <td className="px-6 py-4">$328.00,43</td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                          user.verified ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                        }`}
                        onClick={() => {
                          const newStatus = user.verified ? 'BLOCKED' : 'ACTIVE';
                          handleStatusChange(user._id, newStatus);
                        }}
                      >
                        {user.verified ? 'ACTIVE' : 'BLOCKED'}
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? 'Activated' : 'Inactive'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Link href={`/user-details/${user._id}`} className="p-2 bg-[#27A376] text-white rounded-lg hover:bg-emerald-200">
                        <Eye size={20} />
                      </Link>
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2 bg-[#2F78EE] text-white rounded-lg hover:bg-blue-200"
                      >
                        <Pencil size={20} />
                      </button>
                      <button 
                        onClick={() => handleDelete(user._id)}
                        className="p-2 bg-[#E03137] text-white rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {selectedUser && (
          <EditUserModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            onSave={handleEdit}
          />
        )}
      </div>
    </MainLayout>
  );
}