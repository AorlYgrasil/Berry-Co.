export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: 'active' | 'inactive' | 'out_of_stock';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  registeredAt: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'suspended';
}

export interface AdminUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'staff';
  status: 'active' | 'suspended';
}