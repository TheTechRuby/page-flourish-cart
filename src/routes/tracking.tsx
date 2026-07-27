import { createFileRoute, Link } from "@tanstack/react-router";
import { PackageCheck, Search, Truck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getStatusConfig, getStoredOrders, updateOrderStatus, type Order, type OrderStatus } from "@/lib/order-tracking";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Alphabet Nigerian Publishers" },
      { name: "description", content: "Track your book order in real time with your order number or email address." },
    ],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const OWNER_ACCESS_CODE = "Management.alphabet.com";

  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("processing");
  const [message, setMessage] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");
  const [ownerAccessGranted, setOwnerAccessGranted] = useState(false);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [ownerError, setOwnerError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const value = query.trim().toLowerCase();
    const match = orders.find((order) => {
      const tracking = order.trackingNumber.toLowerCase();
      return tracking === value || order.email.toLowerCase() === value;
    });

    setResult(match ?? null);
    setStatus(match?.status ?? "processing");
    setMessage(match?.updates[match.updates.length - 1]?.message ?? "");
    setUpdateFeedback("");
  };

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;

    const updatedOrder = updateOrderStatus(result.trackingNumber, status, message);
    if (!updatedOrder) {
      setUpdateFeedback("We could not save that update. Please try again.");
      return;
    }

    setOrders((prev) => prev.map((order) => (order.trackingNumber === updatedOrder.trackingNumber ? updatedOrder : order)));
    setResult(updatedOrder);
    setUpdateFeedback("Order update saved successfully.");
  };

  const handleOwnerAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerPassword === OWNER_ACCESS_CODE) {
      setOwnerAccessGranted(true);
      setOwnerError("");
      setOwnerPassword("");
      return;
    }

    setOwnerError("Incorrect access code. Please try again.");
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border bg-gradient-soft p-8 shadow-card">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Order tracking</div>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Follow your delivery from checkout to doorstep.</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Enter your tracking number or email to see the latest status for your order.
            </p>
          </div>
          <Link to="/shop" className="text-sm font-medium text-primary hover:underline">
            Continue shopping
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 rounded-2xl border border-border bg-background/70 p-4 sm:flex-row">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try TRK-ABC123 or your email"
            className="h-11 flex-1"
          />
          <Button type="submit" className="h-11 sm:w-auto">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </form>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
          {result ? (
            <>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Live status</div>
                  <h2 className="mt-2 font-display text-2xl font-semibold">{result.trackingNumber}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusConfig(result.status)?.tone}`}>
                  {getStatusConfig(result.status)?.label}
                </span>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{result.updates[result.updates.length - 1]?.message ?? "Your order is on the way."}</p>
                    <p className="text-sm text-muted-foreground">Updated {new Date(result.placedAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {!ownerAccessGranted ? (
                <form onSubmit={handleOwnerAccess} className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
                  <p className="font-medium">Owner access</p>
                  <p className="mt-1 text-sm text-muted-foreground">Enter the owner access code to update order status.</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Input
                      type="password"
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      placeholder="Enter access code"
                    />
                    <Button type="submit" size="sm">Unlock</Button>
                  </div>
                  {ownerError ? <p className="mt-2 text-sm text-destructive">{ownerError}</p> : null}
                </form>
              ) : (
                <form onSubmit={handleStatusUpdate} className="mt-6 rounded-2xl border border-border bg-background/70 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">Owner update</p>
                      <p className="text-sm text-muted-foreground">Adjust the current order status and add a note.</p>
                    </div>
                    <Button type="submit" size="sm">Save update</Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1.2fr]">
                    <div>
                      <label className="mb-1 block text-sm font-medium">Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as OrderStatus)}
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm"
                      >
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">Note</label>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Leave a delivery update"
                      />
                    </div>
                  </div>

                  {updateFeedback ? <p className="mt-3 text-sm text-primary">{updateFeedback}</p> : null}
                </form>
              )}

              <div className="mt-6 space-y-3">
                {result.updates.map((update) => (
                  <div key={`${update.timestamp}-${update.message}`} className="flex gap-3 rounded-2xl border border-border p-3">
                    <div className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                      <PackageCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{getStatusConfig(update.status)?.label}</p>
                      <p className="text-sm text-muted-foreground">{update.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(update.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-secondary/20 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-display text-xl font-semibold">No order found yet</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Search with your tracking number or the email used at checkout. New orders appear here immediately after confirmation.
              </p>
            </div>
          )}
        </div>

        <aside className="rounded-3xl border border-border bg-secondary/20 p-6 shadow-card">
          <h3 className="font-display text-xl font-semibold">Need help?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Customer care is available from Monday to Friday to help with delivery issues, delays, or address updates.
          </p>
          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-2xl border border-border bg-background/70 p-3">
              <p className="font-medium">Support email</p>
              <p className="text-muted-foreground">support@alphabetpublishers.com</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/70 p-3">
              <p className="font-medium">Phone</p>
              <p className="text-muted-foreground">+234 803 048 3625</p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
