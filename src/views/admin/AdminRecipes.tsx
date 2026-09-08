import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { recipeService, Recipe } from "../../services/data";
import { Link } from "react-router-dom";
import CakeImage from "../../components/common/CakeImage";

export default function AdminRecipes() {
  const recipes = recipeService.list();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  const categories = ["all", ...Array.from(new Set(recipes.map((r) => r.category)))];

  const filtered = selectedCategory === "all"
    ? recipes
    : recipes.filter((r) => r.category === selectedCategory);

  return (
    <AdminLayout
      title="Recipe Formulations & SOPs"
      subtitle="Standardized central bakery formulations, ingredient ratios, and production SOPs."
      action={
        <Link
          to="/admin/catalog"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
        >
          <span>🎂</span>
          <span>View Catalog</span>
        </Link>
      }
    >
      {/* Informational banner about image mapping */}
      <div className="mb-5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-base">
            📖
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Dynamic Asset Resolution Active</div>
            <div className="text-[11px] text-slate-500">
              Recipe images dynamically resolved from <code className="bg-slate-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono text-[10px]">public/admin/images/</code> via central resolver.
            </div>
          </div>
        </div>
        <div className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
          Formulations: {recipes.length} Standardized SOPs
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            {cat === "all" ? "All Formulations" : cat}
          </button>
        ))}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col hover:border-slate-300 transition"
          >
            <div className="flex gap-3 mb-3">
              {/* Dynamic Image with Fallback */}
              <CakeImage
                src={r.image}
                alt={r.name}
                aspect="square"
                fit="contain"
                badge={r.image}
                badgePosition="bottom-left"
                badgeClassName="!font-mono !text-[8px] !bg-slate-900/80 !text-white px-1 py-0.5 max-w-[90%] truncate"
                className="w-24 h-24 rounded-lg border border-slate-200/80 shrink-0 bg-slate-50"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                    {r.code}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {r.difficulty}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 truncate">{r.name}</h3>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{r.description}</p>
              </div>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 py-2 px-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] mb-3">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Yield</span>
                <span className="font-medium text-slate-700">{r.batchYield}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-semibold">Bake Time</span>
                <span className="font-medium text-slate-700">{r.bakeTime}</span>
              </div>
            </div>

            {/* Ingredients preview */}
            <div className="mb-3">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Ingredients ({r.ingredients.length})
              </span>
              <div className="flex flex-wrap gap-1">
                {r.ingredients.slice(0, 3).map((ing, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                    {ing}
                  </span>
                ))}
                {r.ingredients.length > 3 && (
                  <span className="text-[10px] text-slate-400 self-center">+{r.ingredients.length - 3} more</span>
                )}
              </div>
            </div>

            <button
              onClick={() => setActiveRecipe(r)}
              className="mt-auto w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition text-center"
            >
              View Full SOP & Specifications →
            </button>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 animate-fadeIn">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <CakeImage
                  src={activeRecipe.image}
                  alt={activeRecipe.name}
                  aspect="square"
                  fit="contain"
                  className="w-16 h-16 rounded-xl border border-slate-200 shrink-0 bg-slate-50"
                />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-mono font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded border border-pink-100">
                      {activeRecipe.code}
                    </span>
                    <span className="text-[11px] text-slate-500">{activeRecipe.category}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{activeRecipe.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveRecipe(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {activeRecipe.description}
            </p>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs mb-5">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Yield</span>
                <span className="font-bold text-slate-800">{activeRecipe.batchYield}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Prep Time</span>
                <span className="font-bold text-slate-800">{activeRecipe.prepTime}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bake Time</span>
                <span className="font-bold text-slate-800">{activeRecipe.bakeTime}</span>
              </div>
            </div>

            {/* Ingredients */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Standardized Ingredients Formula
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {activeRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SOP Steps */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Standard Operating Procedure (SOP)
              </h4>
              <ol className="space-y-2 text-xs text-slate-700">
                {activeRecipe.sopSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs text-slate-500">
              <span className="font-mono text-[10px]">Asset: {activeRecipe.image}</span>
              <button
                onClick={() => setActiveRecipe(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition"
              >
                Close Formulation
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
