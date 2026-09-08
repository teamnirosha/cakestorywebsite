import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { cartService, CartItem } from "../services/data";
import { useToast } from "../components/common/Toast";
import CakeImage from "../components/common/CakeImage";

export default function Cart() {
  const [, force] = useState({});
  const navigate = useNavigate();
  const { show } = useToast();
  const items = cartService.list();
  const total = cartService.total();
  const shipping = items.length > 0 ? 5.99 : 0;
  const grand = total + shipping;

  const update = (id: string, qty: number) => {
    cartService.update(id, qty);
    force({});
  };
  const remove = (id: string, name: string) => {
    cartService.remove(id);
    force({});
    show(`${name} removed`, "info");
  };
  const checkout = () => {
    show("Demo checkout — order placed! 🎉");
    cartService.clear();
    force({});
    setTimeout(() => navigate("/"), 1500);
  };

  if (items.length === 0) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto glass rounded-3xl p-12 text-center mt-12">
          <div className="text-6xl mb-3">🛒</div>
          <h2 className="font-display text-2xl text-[#2a1d2e] mb-2">Your cart is empty</h2>
          <p className="text-sm text-[#5a4a5e] mb-5">Add some delicious creations to get started.</p>
          <Link to="/cakes" className="btn-primary">Browse Cakes</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-4xl md:text-5xl text-[#2a1d2e] mb-6">Your Cart</h1>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item: CartItem) => (
                <div key={item.id + JSON.stringify(item.meta || {})} className="glass rounded-3xl p-4 flex gap-4 items-center">
                  <CakeImage
                    src={item.image}
                    alt={item.name}
                    aspect="square"
                    fit="contain"
                    className="w-20 h-20 rounded-2xl flex-shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-[#2a1d2e] truncate">{item.name}</h3>
                    {item.meta && (
                      <p className="text-[10px] text-[#5a4a5e] mt-0.5">
                        {Object.entries(item.meta).filter(([k]) => k !== "message").slice(0, 3).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" • ")}
                      </p>
                    )}
                    <p className="text-[#ff5c97] font-semibold mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center glass-soft rounded-full">
                    <button onClick={() => update(item.id, item.quantity - 1)} className="w-8 h-8 text-sm">−</button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => update(item.id, item.quantity + 1)} className="w-8 h-8 text-sm">+</button>
                  </div>
                  <button onClick={() => remove(item.id, item.name)} className="w-9 h-9 rounded-full hover:bg-rose-100 text-rose-500">✕</button>
                </div>
              ))}
              <button onClick={() => { cartService.clear(); force({}); show("Cart cleared", "info"); }} className="text-sm text-rose-500 hover:underline mt-2">Clear cart</button>
            </div>

            <div className="lg:col-span-1">
              <div className="glass rounded-3xl p-6 sticky top-24">
                <h3 className="font-display text-xl text-[#2a1d2e] mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#5a4a5e]">Subtotal</span><span>${total.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-[#5a4a5e]">Delivery</span><span>${shipping.toFixed(2)}</span></div>
                </div>
                <div className="border-t border-white/60 my-3 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-[#2a1d2e]">Total</span>
                  <span className="font-display text-2xl text-[#ff5c97]">${grand.toFixed(2)}</span>
                </div>
                <button onClick={checkout} className="btn-primary w-full mt-3">Checkout →</button>
                <Link to="/cakes" className="block text-center text-xs text-[#5a4a5e] mt-3 hover:text-[#ff5c97]">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
