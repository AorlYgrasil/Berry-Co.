import type { Product, Order, OrderItem, Customer, AdminUser } from './types';

// Built directly from your category/subcategory checklist
const categoryTree = [
  {
    category: 'Trading Card Games',
    subcategories: [
      { name: 'Pokemon TCG', items: ['Single/Graded Cards', 'Elite Trainer Box', 'Booster Box', 'Battle Deck', 'Mini Tin'] },
      { name: 'Magic: The Gathering', items: ['Play Booster', 'Collector Booster', 'Commander Deck', 'Bundle Box', 'Starter Kit'] },
      { name: 'One Piece', items: ['OP Booster Pack', 'Starter Deck', 'Double Pack Set', 'Premium Collection', 'Graded Cards'] },
    ],
  },
  {
    category: 'Card Accessories',
    subcategories: [
      { name: 'Card Protection', items: ['Penny Sleeves', 'Matte Sleeves', 'Top Loaders', 'Magnet Holders', 'Perfect Fit Sleeves'] },
      { name: 'Storage', items: ['Deck Box', 'Card Binder', 'Storage Box', 'Card Case', 'Divider Case'] },
      { name: 'Play Accessories', items: ['Playmat', 'Dice Set', 'Damage Counters', 'Coin Flip Token', 'Playmat Tube'] },
    ],
  },
  {
    category: 'Anime & Collectibles',
    subcategories: [
      { name: 'Pins', items: ['Anime Character Pins', 'Enamel Pins', 'Game Logo Pins', 'Limited Edition Pins', 'Comic Characters Pins'] },
      { name: 'Keychains', items: ['Acrylic Keychains', 'Rubber Keychains', 'Metal Keychains', 'Glow in the Dark Keychains', 'Leather Keychain'] },
      { name: 'Figurines', items: ['Nendoroids', 'Prize Figures', 'Funko Pop', 'Mini Figure', 'Action Figure'] },
    ],
  },
];

function slugify(text: string) {
  return text.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateProducts(): Product[] {
  const products: Product[] = [];
  let index = 0;

  categoryTree.forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      sub.items.forEach((item) => {
        index += 1;
        const price = 150 + ((index * 47) % 1200);
        // every 7th item is deliberately low-stock, so the alert has something to show
        const stock = index % 7 === 0 ? (index % 5) + 1 : 15 + ((index * 11) % 120);

        products.push({
          id: `P${String(index).padStart(3, '0')}`,
          sku: `${slugify(sub.name).slice(0, 4)}-${slugify(item).slice(0, 8)}-${index}`,
          name: item,
          category: cat.category,
          subcategory: sub.name,
          price,
          stock,
          lowStockThreshold: 10,
          status: stock === 0 ? 'out_of_stock' : 'active',
        });
      });
    });
  });

  return products;
}

export const demoProducts: Product[] = generateProducts();

function buildOrder(
  id: string,
  orderNumber: string,
  customerName: string,
  customerEmail: string,
  itemsSpec: { productIndex: number; quantity: number }[],
  status: Order['status'],
  paymentStatus: Order['paymentStatus'],
  createdAt: string
): Order {
  const items: OrderItem[] = itemsSpec.map(({ productIndex, quantity }) => {
    const product = demoProducts[productIndex % demoProducts.length];
    return { productId: product.id, productName: product.name, quantity, price: product.price };
  });
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { id, orderNumber, customerName, customerEmail, items, totalAmount, status, paymentStatus, createdAt };
}

export const demoOrders: Order[] = [
  buildOrder('ORD001', 'ORD-20260412-D1B65D', 'Ruspel Joshua Espinoza', 'qrjvespinoza@tip.edu.ph', [{ productIndex: 1, quantity: 1 }], 'pending', 'pending', '2026-04-12'),
  buildOrder('ORD002', 'ORD-20260403-C10BC4', 'kijo kijo', 'qkrdduran@tip.edu.ph', [{ productIndex: 6, quantity: 2 }, { productIndex: 12, quantity: 1 }], 'delivered', 'paid', '2026-04-03'),
  buildOrder('ORD003', 'ORD-20260403-67FB2E', 'kijo kijo', 'qkrdduran@tip.edu.ph', [{ productIndex: 20, quantity: 3 }], 'delivered', 'paid', '2026-04-02'),
  buildOrder('ORD004', 'ORD-20260403-C2BDDF', 'kevin rio duran', 'kevinduran1017@gmail.com', [{ productIndex: 30, quantity: 1 }, { productIndex: 31, quantity: 1 }], 'pending', 'pending', '2026-04-02'),
  buildOrder('ORD005', 'ORD-20260402-820F93', 'kevin rio duran', 'kevinduran1017@gmail.com', [{ productIndex: 5, quantity: 2 }], 'pending', 'pending', '2026-04-02'),
  buildOrder('ORD006', 'ORD-20260415-A3F221', 'Maria Santos', 'maria.santos@gmail.com', [{ productIndex: 40, quantity: 1 }, { productIndex: 41, quantity: 2 }], 'processing', 'paid', '2026-04-15'),
  buildOrder('ORD007', 'ORD-20260416-B7C883', 'John Cruz', 'john.cruz@gmail.com', [{ productIndex: 15, quantity: 1 }], 'shipped', 'paid', '2026-04-16'),
  buildOrder('ORD008', 'ORD-20260410-E9A102', 'Anna Lopez', 'anna.lopez@gmail.com', [{ productIndex: 8, quantity: 1 }], 'cancelled', 'refunded', '2026-04-10'),
];

function aggregateCustomers(): Customer[] {
  const base: Omit<Customer, 'totalOrders' | 'totalSpent'>[] = [
    { id: 'C001', name: 'Ruspel Joshua Espinoza', email: 'qrjvespinoza@tip.edu.ph', phone: '09999999999', registeredAt: '2026-04-12', status: 'active' },
    { id: 'C002', name: 'kijo kijo', email: 'qkrdduran@tip.edu.ph', phone: '', registeredAt: '2026-04-02', status: 'active' },
    { id: 'C003', name: 'kevin rio duran', email: 'kevinduran1017@gmail.com', phone: '09510147361', registeredAt: '2026-04-02', status: 'active' },
    { id: 'C004', name: 'Maria Santos', email: 'maria.santos@gmail.com', phone: '09171234567', registeredAt: '2026-04-15', status: 'active' },
    { id: 'C005', name: 'John Cruz', email: 'john.cruz@gmail.com', phone: '09281234567', registeredAt: '2026-04-16', status: 'active' },
    { id: 'C006', name: 'Anna Lopez', email: 'anna.lopez@gmail.com', phone: '', registeredAt: '2026-04-10', status: 'suspended' },
  ];

  return base.map((customer) => {
    const orders = demoOrders.filter((o) => o.customerEmail === customer.email);
    return {
      ...customer,
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    };
  });
}

export const demoCustomers: Customer[] = aggregateCustomers();

export const demoAdminUsers: AdminUser[] = [
  { id: '1', name: 'Super Admin', username: 'superadmin', email: 'admin@berryco.com', role: 'super_admin', status: 'active' },
  { id: '2', name: 'Admin', username: 'admin', email: 'admin2@berryco.com', role: 'admin', status: 'active' },
  { id: '3', name: 'Staff', username: 'staff', email: 'staff@berryco.com', role: 'staff', status: 'active' },
];