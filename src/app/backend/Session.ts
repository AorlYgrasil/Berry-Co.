import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { randomUUID } from "crypto";
import { prisma } from "./prisma";

// ----------------------------------------------------------------------------
// This mirrors the auth.ts / login flow visible in your admin screenshots
// (POST /api/auth/login, session-based dashboard access) but generalized for
// storefront customers. Swap the secret/cookie names for whatever your
// existing auth.ts already uses if you have one — this file just needs to
// expose getCurrentUserId() and getOrCreateGuestToken() for the routes below.
// ----------------------------------------------------------------------------

const SESSION_COOKIE = "deckdrop_session";
const GUEST_CART_COOKIE = "deckdrop_guest_cart";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-only-secret-change-me"
);

export interface SessionPayload {
  userId: string;
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
}

/** Reads and verifies the session cookie. Returns null if unauthenticated. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null; // expired / tampered token
  }
}

/** Convenience helper — throws a 401-shaped error object for route handlers to catch. */
export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw Object.assign(new Error("UNAUTHENTICATED"), { status: 401 });
  }
  return session;
}

export async function createSession(userId: string, role: SessionPayload["role"]) {
  const token = await new SignJWT({ userId, role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

// ----------------------------------------------------------------------------
// Guest cart support — lets someone add items to cart before Login/Sign up
// (top-nav shows this as optional), identified by an anonymous cookie token
// instead of a userId. Cart merges into the user's cart on login.
// ----------------------------------------------------------------------------

export async function getOrCreateGuestToken(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(GUEST_CART_COOKIE)?.value;
  if (existing) return existing;

  const token = randomUUID();
  jar.set(GUEST_CART_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return token;
}

/** Call this from your login route right after createSession(). */
export async function mergeGuestCartIntoUser(userId: string) {
  const jar = await cookies();
  const guestToken = jar.get(GUEST_CART_COOKIE)?.value;
  if (!guestToken) return;

  const guestCart = await prisma.cart.findUnique({
    where: { sessionToken: guestToken },
    include: { items: true },
  });
  if (!guestCart) return;

  const userCart = await prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });

  for (const item of guestCart.items) {
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: userCart.id, productId: item.productId } },
      create: {
        cartId: userCart.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPriceSnapshot: item.unitPriceSnapshot,
      },
      update: { quantity: { increment: item.quantity } },
    });
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
  jar.delete(GUEST_CART_COOKIE);
}