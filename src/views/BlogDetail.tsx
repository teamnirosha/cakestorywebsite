import { useParams, Link, Navigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { blogService } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import CakeImage from "../components/common/CakeImage";

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { openModal } = useFranchiseModal();
  const post = id ? blogService.get(id) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <PageShell>
      <div className="pt-6 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              to="/blog"
              className="text-xs font-bold text-[#ff5c97] hover:underline flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to Insights & Articles</span>
            </Link>
          </div>

          <div className="mb-8">
            <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97] mb-3">
              {post.category || "Brand Article"}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#2a1d2e] leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-[#5a4a5e]">
              <span>Published by <strong className="text-[#2a1d2e]">{post.author}</strong></span>
              <span>•</span>
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <CakeImage
            src={post.image}
            alt={post.title}
            aspect="16/9"
            fit="cover"
            priority={true}
            className="w-full rounded-3xl mb-10 shadow-xl border border-white max-h-[460px]"
          />

          <div className="glass rounded-3xl p-6 sm:p-10 bg-white/90 border border-white shadow-md text-sm sm:text-base text-[#5a4a5e] leading-relaxed space-y-6">
            {post.content.split("\n\n").map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Franchise CTA Bottom Box */}
          <div className="mt-12 text-center glass rounded-3xl p-8 bg-gradient-to-br from-pink-500/10 via-rose-300/10 to-amber-200/10 border border-white shadow-md">
            <h3 className="font-display text-xl font-bold text-[#2a1d2e] mb-2">
              Interested in Growing With CakeStory Desserts?
            </h3>
            <p className="text-xs sm:text-sm text-[#5a4a5e] max-w-md mx-auto mb-5">
              Experience the benefits of our standardized manufacturing and turnkey franchise support across Pune.
            </p>
            <button onClick={openModal} className="btn-primary !py-3 !px-6 text-xs sm:text-sm font-bold shadow-md">
              Start Your Franchise Journey →
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
