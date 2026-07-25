'use client';

import { useMemo, useState } from 'react';
import { demoProducts } from '@/lib/demo-data';
import type { Product } from '@/lib/types';

const categories = ['All', ...Array.from(new Set(demoProducts.map((p) => p.category)))];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftStock, setDraftStock] = useState(0);
  const [savedId, setSavedId] = useState<string | null>(null);

  const lowStockItems = useMemo(() => products.filter((p) => p.stock <= p.lowStockThreshold), [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, categoryFilter, search]);

  function startEdit(product: Product) {
    setEditingId(product.id);
    setDraftStock(product.stock);
  }

  function saveStock(id: string) {
    // TODO: replace with a real API call once the database is connected
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: draftStock, status: draftStock === 0 ? 'out_of_stock' : 'active' } : p
      )
    );
    setEditingId(null);
    setSavedId(id);
    setTimeout(() => setSavedId(null), 1500);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Management</h1>

      {lowStockItems.length > 0 && (
        <div className="mb-5 bg-orange-50 border border-orange-300 rounded-lg px-4 py-3 flex items-start gap-2">
          <span className="text-orange-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-orange-700">
              {lowStockItems.length} product{lowStockItems.length > 1 ? 's are' : ' is'} running low on stock
            </p>
            <p className="text-xs text-orange-600">{lowStockItems.map((p) => p.name).join(', ')}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const isLow = product.stock <= product.lowStockThreshold;
              const isEditing = editingId === product.id;
              return (
                <tr key={product.id} className="border-t">
                  <td className="px-4 py-3 text-gray-500">{product.sku}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 text-gray-500">{product.subcategory}</td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <input
                        type="number"
                        min={0}
                        value={draftStock}
                        onChange={(e) => setDraftStock(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className={isLow ? 'text-red-600 font-semibold' : 'text-gray-800'}>{product.stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium text-white ${
                        product.status === 'active' ? 'bg-green-600' : product.status === 'out_of_stock' ? 'bg-red-600' : 'bg-gray-400'
                      }`}
                    >
                      {product.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button onClick={() => saveStock(product.id)} className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1.5 rounded">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3 py-1.5 rounded">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(product)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded">
                        Update Stock
                      </button>
                    )}
                    {savedId === product.id && <span className="ml-2 text-xs text-green-600">Saved!</span>}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400">No products match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}