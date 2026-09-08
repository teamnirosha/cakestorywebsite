import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Cake3D from "../components/three/Cake3D";
import { cartService } from "../services/data";
import { useToast } from "../components/common/Toast";

const SHAPES = [
  { id: "round", label: "Round", emoji: "⭕", price: 0 },
  { id: "square", label: "Square", emoji: "⬛", price: 5 },
  { id: "heart", label: "Heart", emoji: "💗", price: 8 },
  { id: "tier", label: "Tiered", emoji: "🎂", price: 15 },
];

const SIZES = [
  { id: "small", label: "Small (500g)", serves: "4-6", price: 0 },
  { id: "medium", label: "Medium (1kg)", serves: "8-10", price: 20 },
  { id: "large", label: "Large (2kg)", serves: "15-20", price: 45 },
  { id: "xl", label: "XL (3kg)", serves: "25-30", price: 75 },
];

const FLAVORS = [
  { id: "vanilla", label: "Vanilla", emoji: "🤍", price: 0 },
  { id: "chocolate", label: "Chocolate", emoji: "🍫", price: 5 },
  { id: "red-velvet", label: "Red Velvet", emoji: "❤️", price: 8 },
  { id: "strawberry", label: "Strawberry", emoji: "🍓", price: 6 },
  { id: "mango", label: "Mango", emoji: "🥭", price: 8 },
  { id: "coffee", label: "Coffee", emoji: "☕", price: 6 },
];

const CREAMS = [
  { id: "buttercream", label: "Buttercream", price: 0 },
  { id: "fondant", label: "Fondant", price: 12 },
  { id: "whipped", label: "Whipped Cream", price: 4 },
  { id: "creamcheese", label: "Cream Cheese", price: 8 },
];

const TOPPINGS = [
  { id: "berries", label: "Fresh Berries", price: 6 },
  { id: "chocolate", label: "Chocolate Shavings", price: 4 },
  { id: "sprinkles", label: "Rainbow Sprinkles", price: 2 },
  { id: "nuts", label: "Mixed Nuts", price: 5 },
  { id: "gold", label: "Edible Gold", price: 15 },
  { id: "macarons", label: "Mini Macarons", price: 10 },
];

const DECORATIONS = [
  { id: "flowers", label: "Sugar Flowers", price: 15 },
  { id: "candles", label: "Birthday Candles", price: 2 },
  { id: "topper", label: "Custom Topper", price: 8 },
  { id: "photo", label: "Photo Print", price: 12 },
  { id: "pearls", label: "Edible Pearls", price: 6 },
];

const THEMES = [
  { id: "classic", label: "Classic", color: "from-pink-200 to-rose-200" },
  { id: "modern", label: "Modern", color: "from-blue-200 to-indigo-200" },
  { id: "rustic", label: "Rustic", color: "from-amber-200 to-orange-200" },
  { id: "whimsical", label: "Whimsical", color: "from-purple-200 to-pink-200" },
];

export default function CustomCake() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [shape, setShape] = useState("round");
  const [size, setSize] = useState("medium");
  const [flavor, setFlavor] = useState("vanilla");
  const [cream, setCream] = useState("buttercream");
  const [toppings, setToppings] = useState<string[]>([]);
  const [decorations, setDecorations] = useState<string[]>([]);
  const [theme, setTheme] = useState("classic");
  const [message, setMessage] = useState("");

  const total = useMemo(() => {
    let p = 39.99;
    p += SHAPES.find((s) => s.id === shape)?.price || 0;
    p += SIZES.find((s) => s.id === size)?.price || 0;
    p += FLAVORS.find((f) => f.id === flavor)?.price || 0;
    p += CREAMS.find((c) => c.id === cream)?.price || 0;
    p += toppings.reduce((s, t) => s + (TOPPINGS.find((x) => x.id === t)?.price || 0), 0);
    p += decorations.reduce((s, d) => s + (DECORATIONS.find((x) => x.id === d)?.price || 0), 0);
    return p;
  }, [shape, size, flavor, cream, toppings, decorations]);

  const toggle = (list: string[], setter: (v: string[]) => void, id: string) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const addToCart = () => {
    const label = `Custom ${SHAPES.find(s => s.id === shape)?.label} - ${FLAVORS.find(f => f.id === flavor)?.label}`;
    cartService.add(
      {
        id: `custom-${Date.now()}`,
        type: "custom",
        name: label,
        price: total,
        image: "1.jpg",
        meta: { shape, size, flavor, cream, toppings, decorations, theme, message },
      },
      1
    );
    show("Custom cake added to cart!");
    navigate("/cart");
  };

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-[#ff5c97] text-xs font-semibold mb-3">
              ✨ CUSTOM CAKE STUDIO
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#2a1d2e] mb-3">Design Your Dream Cake</h1>
            <p className="text-[#5a4a5e]">Build it, see it live, and add it to your cart in minutes.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-5">
              <Group title="Shape" emoji="🔵">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SHAPES.map((s) => (
                    <Card key={s.id} active={shape === s.id} onClick={() => setShape(s.id)}>
                      <div className="text-2xl">{s.emoji}</div>
                      <div className="text-sm font-semibold">{s.label}</div>
                      {s.price > 0 && <div className="text-[10px] text-[#ff5c97]">+${s.price}</div>}
                    </Card>
                  ))}
                </div>
              </Group>

              <Group title="Size" emoji="📏">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SIZES.map((s) => (
                    <Card key={s.id} active={size === s.id} onClick={() => setSize(s.id)}>
                      <div className="text-sm font-semibold">{s.label}</div>
                      <div className="text-[10px] text-[#5a4a5e]">Serves {s.serves}</div>
                      {s.price > 0 && <div className="text-[10px] text-[#ff5c97]">+${s.price}</div>}
                    </Card>
                  ))}
                </div>
              </Group>

              <Group title="Flavor" emoji="🍰">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FLAVORS.map((f) => (
                    <Card key={f.id} active={flavor === f.id} onClick={() => setFlavor(f.id)}>
                      <div className="text-2xl">{f.emoji}</div>
                      <div className="text-sm font-semibold">{f.label}</div>
                      {f.price > 0 && <div className="text-[10px] text-[#ff5c97]">+${f.price}</div>}
                    </Card>
                  ))}
                </div>
              </Group>

              <Group title="Cream / Frosting" emoji="🥛">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CREAMS.map((c) => (
                    <Card key={c.id} active={cream === c.id} onClick={() => setCream(c.id)}>
                      <div className="text-sm font-semibold">{c.label}</div>
                      {c.price > 0 && <div className="text-[10px] text-[#ff5c97]">+${c.price}</div>}
                    </Card>
                  ))}
                </div>
              </Group>

              <Group title="Toppings" emoji="🍓">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TOPPINGS.map((t) => (
                    <Card key={t.id} active={toppings.includes(t.id)} onClick={() => toggle(toppings, setToppings, t.id)}>
                      <div className="text-sm font-semibold">{t.label}</div>
                      <div className="text-[10px] text-[#ff5c97]">+${t.price}</div>
                    </Card>
                  ))}
                </div>
              </Group>

              <Group title="Decorations" emoji="🎀">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DECORATIONS.map((d) => (
                    <Card key={d.id} active={decorations.includes(d.id)} onClick={() => toggle(decorations, setDecorations, d.id)}>
                      <div className="text-sm font-semibold">{d.label}</div>
                      <div className="text-[10px] text-[#ff5c97]">+${d.price}</div>
                    </Card>
                  ))}
                </div>
              </Group>

              <Group title="Theme" emoji="🎨">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {THEMES.map((t) => (
                    <button key={t.id} onClick={() => setTheme(t.id)} className={`rounded-2xl p-3 border-2 transition ${theme === t.id ? "border-[#ff5c97] scale-105" : "border-transparent"} bg-gradient-to-br ${t.color}`}>
                      <div className="text-sm font-semibold text-[#2a1d2e]">{t.label}</div>
                    </button>
                  ))}
                </div>
              </Group>

              <Group title="Message on Cake" emoji="💌">
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="e.g. Happy Birthday Sarah!" maxLength={50} className="input-field" />
                <p className="text-[10px] text-[#5a4a5e] mt-1">{message.length}/50 characters</p>
              </Group>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                <div className="glass rounded-[2rem] p-4">
                  <Cake3D height={300} />
                </div>
                <div className="glass rounded-3xl p-5">
                  <h3 className="font-display text-xl text-[#2a1d2e] mb-3">Your Cake</h3>
                  <ul className="text-sm text-[#5a4a5e] space-y-1.5 mb-4">
                    <li>Shape: <span className="text-[#2a1d2e] font-medium">{SHAPES.find((s) => s.id === shape)?.label}</span></li>
                    <li>Size: <span className="text-[#2a1d2e] font-medium">{SIZES.find((s) => s.id === size)?.label}</span></li>
                    <li>Flavor: <span className="text-[#2a1d2e] font-medium">{FLAVORS.find((f) => f.id === flavor)?.label}</span></li>
                    <li>Cream: <span className="text-[#2a1d2e] font-medium">{CREAMS.find((c) => c.id === cream)?.label}</span></li>
                    {toppings.length > 0 && <li>Toppings: <span className="text-[#2a1d2e] font-medium">{toppings.length} selected</span></li>}
                    {decorations.length > 0 && <li>Decorations: <span className="text-[#2a1d2e] font-medium">{decorations.length} selected</span></li>}
                    {message && <li>Message: <span className="text-[#2a1d2e] font-medium italic">"{message}"</span></li>}
                  </ul>
                  <div className="border-t border-white/60 pt-3 flex items-center justify-between mb-3">
                    <span className="text-sm text-[#5a4a5e]">Estimated Price</span>
                    <span className="font-display text-3xl text-[#ff5c97]">${total.toFixed(2)}</span>
                  </div>
                  <button onClick={addToCart} className="btn-primary w-full">Add to Cart →</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Group({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5">
      <h3 className="font-display text-lg text-[#2a1d2e] mb-3 flex items-center gap-2">
        <span>{emoji}</span> {title}
      </h3>
      {children}
    </div>
  );
}

function Card({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-3 text-left border-2 transition ${active ? "border-[#ff5c97] bg-white shadow-md scale-[1.02]" : "border-white/40 bg-white/40 hover:bg-white/70"}`}
    >
      {children}
    </button>
  );
}
