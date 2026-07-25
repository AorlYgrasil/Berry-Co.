const stats = [
  { label: 'Total Products', value: '153' },
  { label: 'Total Orders', value: '5' },
  { label: 'Total Customers', value: '5' },
  { label: 'Total Revenue', value: '₱7,961.00' },
  { label: 'Pending Orders', value: '3' },
];

const recentOrders = [
  { id: 'ORD-20260412-D1B65D', customer: 'Ruspel Joshua Espinoza', total: '₱899.00', status: 'Pending', date: 'Apr 12, 2026' },
  { id: 'ORD-20260403-C10BC4', customer: 'kijo kijo', total: '₱4,821.00', status: 'Delivered', date: 'Apr 03, 2026' },
  { id: 'ORD-20260403-67F82E', customer: 'kijo kijo', total: '₱3,140.00', status: 'Delivered', date: 'Apr 02, 2026' },
  { id: 'ORD-20260403-C2B0DF', customer: 'kevin rio duran', total: '₱1,346.00', status: 'Pending', date: 'Apr 02, 2026' },
  { id: 'ORD-20260402-820F93', customer: 'kevin rio duran', total: '₱2,243.00', status: 'Pending', date: 'Apr 02, 2026' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Welcome back, Super Admin</p>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white">Super admin</span>
          <button className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Logout</button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <span className="text-sm text-gray-500">Last 7 days</span>
        </div>
        <div className="mt-5 overflow-hidden rounded-2xl">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Order #</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Total</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Status</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 text-sm text-gray-800">{order.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-800">{order.customer}</td>
                  <td className="px-4 py-4 text-sm text-gray-800">{order.total}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}