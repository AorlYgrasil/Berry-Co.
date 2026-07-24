import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'summary';

    // Overall store summary
    if (type === 'summary') {
      const totalOrders = await prisma.order.count();
      const totalProducts = await prisma.product.count();

      const revenueResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
      });

      return NextResponse.json({
        totalOrders,
        totalProducts,
        totalRevenue: revenueResult._sum.totalAmount || 0,
      });
    }

    // Revenue broken down by top-level category
    // e.g. Trading Card Games vs Card Accessories vs Anime & Collectibles
    if (type === 'revenue-by-category') {
      const categories = await prisma.category.findMany({
        include: {
          subcategories: {
            include: {
              products: {
                include: { orderItems: true },
              },
            },
          },
        },
      });

      const result = categories.map((category) => {
        let revenue = 0;
        let unitsSold = 0;

        category.subcategories.forEach((sub) => {
          sub.products.forEach((product) => {
            product.orderItems.forEach((item) => {
              revenue += item.price * item.quantity;
              unitsSold += item.quantity;
            });
          });
        });

        return { category: category.name, revenue, unitsSold };
      });

      return NextResponse.json({ categories: result });
    }

    // Best-selling products, e.g. "Pokemon Booster Box" vs "MTG Play Booster"
    if (type === 'best-sellers') {
      const topProducts = await prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 10,
      });

      const productsWithDetails = await Promise.all(
        topProducts.map(async (item) => {
          const product = await prisma.product.findUnique({
            where: { id: item.productId },
            include: { subcategory: { include: { category: true } } },
          });

          return {
            productName: product?.name,
            subcategory: product?.subcategory.name,
            category: product?.subcategory.category.name,
            unitsSold: item._sum.quantity,
          };
        })
      );

      return NextResponse.json({ topProducts: productsWithDetails });
    }

    // Low stock alerts, grouped by subcategory
    // e.g. flag when Elite Trainer Boxes or Booster Boxes run low
    if (type === 'low-stock') {
      const lowStockProducts = await prisma.product.findMany({
        where: { stock: { lte: 10 } },
        include: { subcategory: { include: { category: true } } },
        orderBy: { stock: 'asc' },
      });

      const formatted = lowStockProducts.map((p) => ({
        product: p.name,
        subcategory: p.subcategory.name,
        category: p.subcategory.category.name,
        stock: p.stock,
      }));

      return NextResponse.json({ lowStock: formatted });
    }

    // Recent orders
    if (type === 'recent-orders') {
      const orders = await prisma.order.findMany({
        include: { items: { include: { product: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return NextResponse.json({ orders });
    }

    return NextResponse.json({ error: 'Unknown report type' }, { status: 400 });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}