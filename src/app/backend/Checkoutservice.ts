import { prisma } from "./prisma";
import { generateOrderNumber } from "./orderNumber";
import { Prisma } from "@prisma/client";

export interface CheckoutInput {
  userId: string; // checkout requires a logged-in user (guests must sign in/up first)
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string; // e.g. "card", "gcash", "cod" — left generic on purpose
  shippingFee?: number;
}

/**
 * Checkout is the one place where correctness matters most, so everything
 * happens inside a single Prisma transaction:
 *   1. Re-fetch the cart fresh (never trust client-side totals).
 *   2. Re-validate EVERY line against current availability/stock/pre-order
 *      window — prices and stock can change between "view cart" and
 *      "click checkout".
 *   3. Decrement stockQty for IN_STOCK / ON_SALE items (pre-orders don't
 *      decrement stock the same way — see note below).
 *   4. Snapshot product name + price onto OrderItem so the order stays
 *      accurate even if the product is edited/discontinued later.
 *   5. Create the Order with status PENDING — matching the "Pending" badge
 *      already shown in your admin's Recent Orders table.
 *   6. Empty the cart.
 * If any step fails, the whole transaction rolls back — no partial orders,
 * no stock silently vanishing.
 */
export async function checkout(input: CheckoutInput) {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId: input.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw Object.assign(new Error("Your cart is empty."), { status: 400 });
    }

    let subtotal = new Prisma.Decimal(0);
    const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

    for (const item of cart.items) {
      const product = item.product;

      if (!product.isActive) {
        throw Object.assign(
          new Error(`"${product.name}" is no longer available and was removed from checkout.`),
          { status: 409 }
        );
      }

      const isPreOrder = product.availability === "PRE_ORDER";

      if (isPreOrder) {
        const now = new Date();
        const opened = !product.preOrderStart || now >= product.preOrderStart;
        const closed = product.preOrderEnd ? now > product.preOrderEnd : false;
        if (!opened || closed) {
          throw Object.assign(
            new Error(`Pre-order window for "${product.name}" has closed.`),
            { status: 409 }
          );
        }
        // Pre-orders are NOT decremented from stockQty here — they represent
        // future manufacturing/allocation, typically tracked separately by
        // the admin (see Inventory / Orders tabs in the dashboard) rather
        // than physical on-hand stock.
      } else if (product.availability === "OUT_OF_STOCK") {
        throw Object.assign(new Error(`"${product.name}" is out of stock.`), {
          status: 409,
        });
      } else {
        // IN_STOCK or ON_SALE — must have real stock, and we decrement it
        // atomically inside this same transaction to prevent overselling
        // when two customers check out the same last unit simultaneously.
        const updated = await tx.product.updateMany({
          where: { id: product.id, stockQty: { gte: item.quantity } },
          data: { stockQty: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw Object.assign(
            new Error(`"${product.name}" just sold out — please update your cart.`),
            { status: 409 }
          );
        }
      }

      const unitPrice = product.price; // always use current DB price, not the stale snapshot
      const lineTotal = unitPrice.mul(item.quantity);
      subtotal = subtotal.add(lineTotal);

      orderItemsData.push({
        productId: product.id,
        productNameSnapshot: product.name,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        isPreOrder,
      });
    }

    const shippingFee = new Prisma.Decimal(input.shippingFee ?? 0);
    const total = subtotal.add(shippingFee);

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: input.userId,
        status: "PENDING",
        subtotal,
        shippingFee,
        total,
        shippingAddress: input.shippingAddress as unknown as Prisma.InputJsonValue,
        paymentMethod: input.paymentMethod,
        paymentStatus: "UNPAID",
        items: { createMany: { data: orderItemsData } },
      },
      include: { items: true },
    });

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  });
}