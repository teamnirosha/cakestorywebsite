import { useState } from "react";
import { Link } from "react-router-dom";
import cakeList from "../../data/cakes.json";
import CakeImage from "../common/CakeImage";

export interface CakeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  flavor: string;
  size: string;
  tags: string[];
  rating: number;
}

const typedCakes = cakeList as CakeItem[];

// Pick the premier showcase cakes backed by verified photography
const SHOWCASE_IDS = [
  "cake-001", // Belgian Chocolate Truffle (1.jpg)
  "cake-002", // Fresh Strawberry Gateau (12.jpg)
  "cake-009", // Royal Dutch Chocolate Mousse (DSC03187.JPG)
  "cake-007", // Glazed Fresh Fruit Gateau (AZ_01683.JPG)
  "cake-008", // Festive Pistachio Saffron Bake (AZ_01692.JPG)
  "cake-011", // Velvet Rose & Raspberry (DSC08617.JPG)
];

const showcaseCakes = typedCakes.filter((c) => SHOWCASE_IDS.includes(c.id));

export default function CakeShowcase() {
  const [selectedId, setSelectedId] = useState<string>(showcaseCakes[0]?.id || "cake-001");

  const currentCake = showcaseCakes.find((c) => c.id === selectedId) || showcaseCakes[0];

  return (
    <section className="reveal-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-transparent via-white/70 to-transparent">
      {/* Ambient background glow */}
      <div className="blob w-96 h-96 -top-20 -left-20 bg-rose-200/25" />
      <div className="blob w-96 h-96 -bottom-20 -right-20 bg-amber-100/30" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">
              <span className="w-2 h-2 rounded-full bg-[#e63971]" />
              Artisanal Cake Collection
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold tracking-tight">
              Crafted for Celebrations. <span className="font-editorial gradient-text">Rooted in Taste.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 leading-relaxed">
              Every CakeStory dessert is baked 100% vegetarian with pharmaceutical batch precision at our central Pune hub. Explore our signature flavours engineered for lasting customer loyalty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cakes"
              className="btn-ghost !py-3 !px-6 text-xs sm:text-sm font-bold shadow-xs whitespace-nowrap"
            >
              <span>View All 24+ Cakes</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Interactive Spotlight Stage */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Main Selected Cake Stage (Left 7 Cols) */}
          <div className="lg:col-span-7">
            <div className="glass-card p-6 sm:p-8 bg-white/90 border border-white shadow-xl relative overflow-hidden transition-all duration-300">
              <div className="grid sm:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* Cake Photography with Stable 3:4 Aspect Framing */}
                <div className="sm:col-span-6 relative">
                  <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-inner bg-rose-50/50 flex items-center justify-center border border-rose-100/60">
                    <CakeImage
                      key={currentCake.id}
                      src={currentCake.image}
                      alt={currentCake.name}
                      aspect="3/4"
                      fit="cover"
                      hoverZoom
                      priority
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover"
                    />

                    {/* Pure Veg Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                        100% Eggless
                      </span>
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#1c121e]/85 backdrop-blur-md text-white text-xs font-bold shadow-md">
                      ₹{currentCake.price}
                    </div>
                  </div>
                </div>

                {/* Cake Metadata & Sensory Narrative */}
                <div className="sm:col-span-6 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#e63971] bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 inline-block mb-2">
                      {currentCake.category}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1d2e] leading-snug">
                      {currentCake.name}
                    </h3>
                    <div className="text-xs font-semibold text-[#8c7a90] mt-1">
                      Flavour Profile: <span className="text-[#2a1d2e] font-bold">{currentCake.flavor}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                    {currentCake.description}
                  </p>

                  {/* Ingredients Pills */}
                  <div>
                    <div className="text-[11px] font-bold text-[#2a1d2e] uppercase tracking-wider mb-2">
                      Key Recipe Elements
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCake.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="px-2.5 py-1 rounded-lg bg-rose-50/70 border border-rose-100 text-[11px] text-[#5a4a5e] font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Size & Action */}
                  <div className="pt-2 flex items-center justify-between gap-4 border-t border-rose-100/60">
                    <span className="text-xs text-[#8c7a90] font-medium">
                      Standard Size: <strong className="text-[#2a1d2e]">{currentCake.size}</strong>
                    </span>
                    <Link
                      to={`/cakes/${currentCake.id}`}
                      className="btn-primary !py-2.5 !px-5 !text-xs !font-bold shadow-md"
                    >
                      <span>Explore Cake</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selector Carousel / Grid of Companion Cakes (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8c7a90] mb-2 px-1">
              Select A Signature Creation:
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {showcaseCakes.map((cake) => {
                const isSelected = cake.id === currentCake.id;
                return (
                  <button
                    key={cake.id}
                    onClick={() => setSelectedId(cake.id)}
                    className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 flex items-center gap-3.5 border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63971] ${
                      isSelected
                        ? "glass-card border-[#e63971] bg-white shadow-md translate-x-1"
                        : "glass-soft border-white/70 bg-white/60 hover:bg-white hover:border-rose-200"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-2xs border border-rose-100/80 bg-rose-50 flex items-center justify-center">
                      <CakeImage
                        src={cake.image}
                        alt={cake.name}
                        aspect="square"
                        fit="cover"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-display font-bold text-sm text-[#2a1d2e] truncate">
                          {cake.name}
                        </h4>
                        <span className="text-xs font-bold text-[#e63971] shrink-0">
                          ₹{cake.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5a4a5e] truncate mt-0.5">
                        {cake.flavor} • {cake.size}
                      </p>
                    </div>

                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#e63971] shrink-0 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
