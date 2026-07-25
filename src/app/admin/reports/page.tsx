'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { demoOrders, demoProducts, demoCustomers } from '@/lib/demo-data';

export default function ReportsPage() {
  const totalRevenue = useMemo(() => demoOrders.reduce((sum, o) => sum + o.totalAmount, 0), []);
  const totalOrders = demoOrders.length;
  const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

  const revenueByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    demoOrders.forEach((order) => {
      order.items.forEach((item) => {
        const product = demoProducts.find((p) => p.id === item.productId);
        if (!product) return;
        map[product.category] = (map[product.category] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(map).map(([category, revenue]) => ({ category, revenue }));
  }, []);

  const bestSellers = useMemo(() => {
    const map: Record<string, { name: string; category: string; unitsSold: number; revenue: number }> = {};
    demoOrders.forEach((order) => {
      order.items.forEach((item) => {
        const product = demoProducts.find((p) => p.id === item.productId);
        if (!product) return;
        if (!map[product.id]) map[product.id] = { name: product.name, category: product.category, unitsSold: 0, revenue: 0 };
        map[product.id].unitsSold += item.quantity;
        map[product.id].revenue += item.price * item.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
  }, []);

  const topCustomers = useMemo(() => [...demoCustomers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5), []);

  const repeatCustomerRate = useMemo(() => {
    const repeat = demoCustomers.filter((c) => c.totalOrders > 1).length;
    return demoCustomers.length ? Math.round((repeat / demoCustomers.length) * 100) : 0;
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales & Analytics Reports</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">₱{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">Total Orders</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">Avg Order Value</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">₱{avgOrderValue.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-5 mb-8">
        <h2 className="font-semibold text-gray-800 mb-4">Revenue by Category</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueByCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => `₱${value.toLocaleString()}`} />
            <Bar dataKey="revenue" fill="#9333ea" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-4">Best-Selling Products</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Product</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Units Sold</th>
                <th className="pb-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSellers.map((p) => (
                <tr key={p.name} className="border-b last:border-0">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2 text-gray-500">{p.category}</td>
                  <td className="py-2">{p.unitsSold}</td>
                  <td className="py-2">₱{p.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="font-semibold text-gray-800 mb-1">Customer Insights</h2>
          <p className="text-xs text-gray-500 mb-4">{repeatCustomerRate}% of customers are repeat buyers</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Customer</th>
                <th className="pb-2">Orders</th>
                <th className="pb-2">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.totalOrders}</td>
                  <td className="py-2">₱{c.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}