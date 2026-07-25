'use client';

import { useState } from 'react';
import { demoCustomers, demoAdminUsers } from '@/lib/demo-data';
import type { Customer, AdminUser } from '@/lib/types';

export default function UsersPage() {
  const [tab, setTab] = useState<'customers' | 'admins'>('customers');
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [admins, setAdmins] = useState<AdminUser[]>(demoAdminUsers);
  const [search, setSearch] = useState('');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', username: '', email: '', role: 'staff' as AdminUser['role'] });

  function toggleCustomerStatus(id: string) {
    // TODO: replace with a real API call once the database is connected
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' } : c)));
  }

  function deleteAdmin(id: string) {
    if (!confirm('Remove this admin account?')) return;
    // TODO: replace with a real API call once the database is connected
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  }

  function addAdmin() {
    if (!newAdmin.name || !newAdmin.username || !newAdmin.email) return;
    // TODO: replace with a real API call once the database is connected
    setAdmins((prev) => [...prev, { id: crypto.randomUUID(), status: 'active', ...newAdmin }]);
    setNewAdmin({ name: '', username: '', email: '', role: 'staff' });
    setShowAddAdmin(false);
  }

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management</h1>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setTab('customers')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${tab === 'customers' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
        >
          Customer Accounts
        </button>
        <button
          onClick={() => setTab('admins')}
          className={`px-4 py-2 text-sm font-medium rounded-md ${tab === 'admins' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
        >
          Admin Accounts
        </button>
      </div>

      {tab === 'customers' && (
        <>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm w-72 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Total Spent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">{c.name}</td>
                    <td className="px-4 py-3 text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-gray-500">{c.phone || 'N/A'}</td>
                    <td className="px-4 py-3">{c.totalOrders}</td>
                    <td className="px-4 py-3">₱{c.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${c.status === 'active' ? 'bg-green-600' : 'bg-red-500'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleCustomerStatus(c.id)}
                        className={`text-white text-xs px-3 py-1.5 rounded ${c.status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                      >
                        {c.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'admins' && (
        <>
          <button onClick={() => setShowAddAdmin(true)} className="mb-4 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md">
            + Add New Admin
          </button>

          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                    <td className="px-4 py-3 text-gray-500">{a.username}</td>
                    <td className="px-4 py-3 text-gray-500">{a.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium capitalize">{a.role.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${a.status === 'active' ? 'bg-green-600' : 'bg-red-500'}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteAdmin(a.id)}
                        disabled={a.role === 'super_admin'}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs px-3 py-1.5 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Add New Admin</h2>
            <div className="space-y-3">
              <input type="text" placeholder="Full name" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="text" placeholder="Username" value={newAdmin.username} onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <input type="email" placeholder="Email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
              <select value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as AdminUser['role'] })} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={addAdmin} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-md">Add Admin</button>
              <button onClick={() => setShowAddAdmin(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm py-2 rounded-md">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}