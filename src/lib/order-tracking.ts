export type OrderStatus = "processing" | "packed" | "shipped" | "delivered";

export type OrderItem = {
  id: string;
  title: string;
  qty: number;
  price: number;
};

export type Order = {
  id: string;
  trackingNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  placedAt: string;
  status: OrderStatus;
  updates: Array<{
    status: OrderStatus;
    message: string;
    timestamp: string;
  }>;
};

const STORAGE_KEY = "alphabet-orders";

export function createTrackingNumber() {
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TRK-${suffix}`;
}

export function getStoredOrders(): Order[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function addOrder(order: Order) {
  const orders = [order, ...getStoredOrders()];
  saveOrders(orders);
  return orders;
}

export function getStatusConfig(status: OrderStatus) {
  return {
    processing: {
      label: "Processing",
      tone: "bg-muted text-muted-foreground",
      step: 0,
    },
    packed: {
      label: "Packed",
      tone: "bg-primary/10 text-primary",
      step: 1,
    },
    shipped: {
      label: "Shipped",
      tone: "bg-amber-500/10 text-amber-700",
      step: 2,
    },
    delivered: {
      label: "Delivered",
      tone: "bg-emerald-600/10 text-emerald-700",
      step: 3,
    },
  }[status];
}
