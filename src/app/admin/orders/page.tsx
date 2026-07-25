'use client';

import { useMemo, useState } from 'react';
import { demoOrders } from '@/lib/demo-data';
import type { Order } from '@/lib/types';

const statusOptions: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-orange-500',
  processing: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-600',
  cancelled: 'bg-red-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(
    () => (statusFilter === 'all' ? orders : orders.filter((o) => o.status === statusFilter)),
    [orders, statusFilter]
  );

  function updateStatus(id: string, status: Order['status']) {
    // TODO: replace with a real API call once the database is connected
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  function processRefund(id: string) {
    if (!confirm('Mark this order as cancelled and refunded?')) return;
    // TODO: replace with a real API call once the database is connected
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'cancelled', paymentStatus: 'refunded' } : o)));
    setSelectedOrder((prev) => (prev && prev.id === id ? { ...prev, status: 'cancelled', paymentStatus: 'refunded' } : prev));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', ...statusOptions] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize border ${
              statusFilter === s ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">Order #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-3 text-purple-700">{order.orderNumber}</td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-4 py-3">₱{order.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium text-white capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{order.paymentStatus}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setSelectedOrder(order)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">No orders in this status.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="px-5 py-4 border-b flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">{selectedOrder.orderNumber}</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="p-5 space-y-4 text-sm">
              <div>
                <p className="text-gray-500">Customer</p>
                <p className="font-medium text-gray-800">{selectedOrder.customerName}</p>
                <p className="text-gray-500">{selectedOrder.customerEmail}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-2">Items</p>
                <div className="border rounded-md divide-y">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between px-3 py-2">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>₱{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-semibold px-1 pt-2">
                  <span>Total</span>
                  <span>₱{selectedOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Update Status</p>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder.id, e.target.value as Order['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md capitalize"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => window.print()} className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-sm py-2 rounded-md">
                  Print Invoice
                </button>
                <button
                  onClick={() => processRefund(selectedOrder.id)}
                  disabled={selectedOrder.paymentStatus === 'refunded'}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm py-2 rounded-md"
                >
                  {selectedOrder.paymentStatus === 'refunded' ? 'Refunded' : 'Refund Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}