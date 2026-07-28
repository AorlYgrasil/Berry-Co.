import { prisma } from "./prisma";

/**
 * Wishlist is intentionally simple: it's a save-for-later list, not tied to
 * price or stock validation (unlike Cart). A user can wishlist an
 * out-of-stock or future pre-order item — that's the point of a wishlist.
 */

export async function getOrCreateWishlist(userId: string) {
  return prisma.wishlist.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}

export async function getWishlist(userId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  return prisma.wishlistItem.findMany({
    where: { wishlistId: wishlist.id },
    include: { product: true },
    orderBy: { addedAt: "desc" },
  });
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw Object.assign(new Error("PRODUCT_NOT_FOUND"), { status: 404 });
  }

  const wishlist = await getOrCreateWishlist(userId);

  // Idempotent: re-adding an already-wishlisted product is a no-op success,
  // not an error — the "Add to Wishlist" button doesn't need to know state.
  return prisma.wishlistItem.upsert({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    create: { wishlistId: wishlist.id, productId },
    update: {},
    include: { product: true },
  });
}

export async function removeFromWishlist(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  await prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, productId },
  });
}

/** Used to move a saved item straight into the cart ("Move to Cart" UX). */
export async function isProductWishlisted(userId: string, productId: string) {
  const wishlist = await getOrCreateWishlist(userId);
  const item = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });
  return Boolean(item);
}