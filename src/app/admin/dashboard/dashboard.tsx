// Placeholder stats — replace with real database queries later.
const stats = [
  { label: 'Total Products', value: '—' },
  { label: 'Total Orders', value: '—' },
  { label: 'Total Customers', value: '—' },
  { label: 'Total Revenue', value: '₱—' },
  { label: 'Pending Orders', value: '—' },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4">
            <p className="text-xs text-gray-500 uppercase">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="font-semibold text-gray-800 mb-2">Recent Orders</h2>
        <p className="text-sm text-gray-400">
          Order data will appear here once the database is connected.
        </p>
      </div>
    </div>
  );
}