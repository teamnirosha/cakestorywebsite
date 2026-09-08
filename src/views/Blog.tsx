import { useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { blogService } from "../services/data";
import CakeImage from "../components/common/CakeImage";

export default function Blog() {
  const posts = blogService.list();
  const rawCategories = Array.from(new Set(posts.map((p) => p.category || "General").filter(Boolean)));
  const categories = ["All Insights", ...rawCategories];
  const [activeCat, setActiveCat] = useState("All Insights");

  const filtered =
    activeCat === "All Insights" ? posts : posts.filter((p) => p.category === activeCat);

  return (
    <PageShell>
      <div className="pt-6 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
              Brand & Franchise Insights
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2a1d2e] mb-4">
              Behind the CakeStory Desserts Model
            </h1>
            <p className="text-sm sm:text-base text-[#5a4a5e] max-w-2xl mx-auto leading-relaxed">
              Explore our manufacturing philosophy, hygiene discipline, Pune expansion strategy, and why standardized baking builds lasting customer trust.
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  activeCat === cat
                    ? "bg-[#2a1d2e] text-white shadow-md scale-105"
                    : "bg-white/70 text-[#5a4a5e] hover:bg-white/95 border border-white/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug || post.id}`}
                className="glass rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col bg-white/80 border border-white"
              >
                <CakeImage
                  src={post.image}
                  alt={post.title}
                  aspect="16/10"
                  fit="cover"
                  hoverZoom
                  badge={post.category || "Insight"}
                  badgePosition="top-left"
                  badgeClassName="!bg-white/90 !text-[#ff5c97] shadow-xs"
                  className="w-full rounded-t-3xl"
                />
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs font-bold text-slate-400 mb-2">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                  <h2 className="text-lg font-display font-bold text-[#2a1d2e] mb-2 leading-snug group-hover:text-[#ff5c97] transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-[#5a4a5e] text-xs sm:text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#2a1d2e] border-t border-slate-100 pt-3">
                    <span>By {post.author}</span>
                    <span className="text-[#ff5c97] group-hover:translate-x-1 transition-transform">
                      Read Article →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
