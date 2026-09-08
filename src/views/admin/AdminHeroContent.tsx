import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  contentService,
  SiteContent,
  HeroStatistic,
  HeroSupportingCard,
  HeroFloatingBadge,
  CoreStrengthCard,
} from "../../services/data";
import { useToast } from "../../components/common/Toast";
import { CAKESTORY_FILENAMES } from "../../utils/imageResolver";
import CakeImage from "../../components/common/CakeImage";

export default function AdminHeroContent() {
  const { show } = useToast();
  const [content, setContent] = useState<SiteContent>(() => contentService.get());
  const [activeTab, setActiveTab] = useState<"hero" | "stats" | "visual" | "strengths">("hero");

  // Local helper for hero updates
  const updateHeroField = <K extends keyof SiteContent["homeHero"]>(field: K, value: SiteContent["homeHero"][K]) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        [field]: value,
      },
    }));
  };

  const updateStoryHeroField = (field: "imageAsset" | "caption", value: string) => {
    setContent((prev) => ({
      ...prev,
      storyHero: {
        ...(prev.storyHero || { imageAsset: "AZ_01460.JPG", caption: "Central Kitchen Craftsmanship & Fresh Gourmet Ingredients" }),
        [field]: value,
      },
    }));
  };

  const updateFranchiseHeroField = (field: "imageAsset" | "caption", value: string) => {
    setContent((prev) => ({
      ...prev,
      franchiseHero: {
        ...(prev.franchiseHero || { imageAsset: "1.jpg", caption: "High-Demand Signature Retail Cakes for Pune Outlets" }),
        [field]: value,
      },
    }));
  };

  // Local helper for primary CTA
  const updatePrimaryCta = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        primaryCta: {
          ...prev.homeHero.primaryCta,
          [field]: value,
        },
      },
    }));
  };

  // Local helper for secondary CTA
  const updateSecondaryCta = (field: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        secondaryCta: {
          ...prev.homeHero.secondaryCta,
          [field]: value,
        },
      },
    }));
  };

  // Statistics handlers
  const updateStat = (id: string, field: keyof HeroStatistic, value: any) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        statistics: prev.homeHero.statistics.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      },
    }));
  };

  const addStat = () => {
    const newStat: HeroStatistic = {
      id: `stat-${Date.now()}`,
      value: "10+",
      label: "NEW METRIC",
      description: "Franchise growth indicator",
      active: true,
    };
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        statistics: [...prev.homeHero.statistics, newStat],
      },
    }));
  };

  const removeStat = (id: string) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        statistics: prev.homeHero.statistics.filter((s) => s.id !== id),
      },
    }));
  };

  // Supporting cards handlers
  const updateSupportingCard = (id: string, field: keyof HeroSupportingCard, value: any) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        supportingCards: prev.homeHero.supportingCards.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      },
    }));
  };

  // Floating badges handlers
  const updateFloatingBadge = (id: string, field: keyof HeroFloatingBadge, value: any) => {
    setContent((prev) => ({
      ...prev,
      homeHero: {
        ...prev.homeHero,
        floatingBadges: prev.homeHero.floatingBadges.map((b) => (b.id === id ? { ...b, [field]: value } : b)),
      },
    }));
  };

  // Core strengths handlers
  const updateCoreStrengthCard = (id: string, field: keyof CoreStrengthCard, value: any) => {
    setContent((prev) => ({
      ...prev,
      coreStrengths: {
        ...prev.coreStrengths,
        cards: prev.coreStrengths.cards.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      },
    }));
  };

  // Save changes
  const handleSave = () => {
    contentService.save(content);
    show("Home Hero & Content saved successfully! Changes are live.", "success");
  };

  // Reset to seed defaults
  const handleReset = () => {
    if (confirm("Reset all Home Hero content and statistics to default values?")) {
      contentService.resetSeed();
      setContent(contentService.get());
      show("Content reset to seed defaults", "info");
    }
  };

  return (
    <AdminLayout
      title="Home Hero & Dynamic Content"
      subtitle="Manage front-page franchise hero copy, dynamic business statistics, visuals, and core strengths."
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5"
          >
            <span>💾</span>
            <span>Save Live Changes</span>
          </button>
        </div>
      }
    >
      {/* Information Banner */}
      <div className="mb-5 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 text-base">
            ✨
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Dynamic Front-Page CMS Active</div>
            <div className="text-[11px] text-slate-500">
              All edits update the central JSON data store and immediately synchronize with the public Home page.
            </div>
          </div>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-pink-600 hover:text-pink-700 hover:underline flex items-center gap-1"
        >
          <span>Preview Home Page</span>
          <span>↗</span>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-5 overflow-x-auto">
        {[
          { id: "hero", label: "Hero Copy & CTAs", icon: "📝" },
          { id: "stats", label: "Hero Statistics", icon: "📊" },
          { id: "visual", label: "3D Visual & Badges", icon: "🎨" },
          { id: "strengths", label: "Core Strengths (Why CakeStory)", icon: "🏆" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: HERO COPY & CTAs */}
      {activeTab === "hero" && (
        <div className="space-y-5">
          {/* Main Hero Messaging */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Hero Brand & Headline Messaging
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Top Badge Text (e.g. Brand & Locality Tag)
                </label>
                <input
                  type="text"
                  value={content.homeHero.badgeText}
                  onChange={(e) => updateHeroField("badgeText", e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Main Heading (Prefix Text)
                  </label>
                  <input
                    type="text"
                    value={content.homeHero.headingPrefix}
                    onChange={(e) => updateHeroField("headingPrefix", e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Highlighted Heading (Pink Gradient Span)
                  </label>
                  <input
                    type="text"
                    value={content.homeHero.headingHighlight}
                    onChange={(e) => updateHeroField("headingHighlight", e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-bold text-pink-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hero Pitch / Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={content.homeHero.description}
                  onChange={(e) => updateHeroField("description", e.target.value)}
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Communicates CakeStory's expansion, entrepreneurship opportunity, and operational support.
                </p>
              </div>
            </div>
          </div>

          {/* Call To Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Hero Call to Action Buttons
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary CTA */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Primary CTA (Button)</span>
                  <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-semibold">
                    Conversion Driver
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={content.homeHero.primaryCta.label}
                    onChange={(e) => updatePrimaryCta("label", e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Trigger Action</label>
                  <select
                    value={content.homeHero.primaryCta.action}
                    onChange={(e) => updatePrimaryCta("action", e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white font-medium"
                  >
                    <option value="modal">Open Franchise Enquiry Modal</option>
                    <option value="link">Navigate to Page URL</option>
                  </select>
                </div>
                {content.homeHero.primaryCta.action === "link" && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Path / URL</label>
                    <input
                      type="text"
                      value={content.homeHero.primaryCta.link || "/franchise"}
                      onChange={(e) => updatePrimaryCta("link", e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Secondary CTA */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Secondary CTA (Ghost Button)</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    Exploration
                  </span>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Button Label</label>
                  <input
                    type="text"
                    value={content.homeHero.secondaryCta.label}
                    onChange={(e) => updateSecondaryCta("label", e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Route</label>
                  <input
                    type="text"
                    value={content.homeHero.secondaryCta.link}
                    onChange={(e) => updateSecondaryCta("link", e.target.value)}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STATISTICS */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Dynamic Business Credibility Counters
                </h3>
                <p className="text-[11px] text-slate-500">
                  These statistics appear below the Hero CTA on the Home page. Toggle active status or add custom metrics.
                </p>
              </div>
              <button
                onClick={addStat}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
              >
                <span>+</span>
                <span>Add Statistic</span>
              </button>
            </div>

            <div className="space-y-3">
              {content.homeHero.statistics.map((stat, idx) => (
                <div
                  key={stat.id}
                  className={`p-3.5 rounded-xl border transition flex flex-col md:flex-row md:items-center gap-3 ${
                    stat.active ? "bg-white border-slate-200 shadow-xs" : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <div className="w-28">
                      <label className="block text-[9px] uppercase font-semibold text-slate-400 mb-0.5">Value</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStat(stat.id, "value", e.target.value)}
                        placeholder="e.g. 12+"
                        className="w-full text-xs font-bold px-2.5 py-1.5 border rounded-lg border-slate-200 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-[9px] uppercase font-semibold text-slate-400 mb-0.5">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => updateStat(stat.id, "label", e.target.value)}
                      placeholder="e.g. PUNE OUTLETS"
                      className="w-full text-xs font-semibold px-2.5 py-1.5 border rounded-lg border-slate-200"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[9px] uppercase font-semibold text-slate-400 mb-0.5">
                      Short Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={stat.description || ""}
                      onChange={(e) => updateStat(stat.id, "description", e.target.value)}
                      placeholder="e.g. Growing local network"
                      className="w-full text-xs px-2.5 py-1.5 border rounded-lg border-slate-200"
                    />
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-4">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={stat.active}
                        onChange={(e) => updateStat(stat.id, "active", e.target.checked)}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span>{stat.active ? "Active" : "Hidden"}</span>
                    </label>

                    <button
                      onClick={() => removeStat(stat.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-slate-100 text-xs"
                      title="Remove statistic"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VISUAL & BADGES */}
      {activeTab === "visual" && (
        <div className="space-y-5">
          {/* Authentic CakeStory Photography across Home, Story & Franchise */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                Authentic CakeStory Photography (JSON Controlled)
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage the real bakery product photography featured on Home, Our Story, and Franchise pages without code edits.
              </p>
            </div>

            {/* 1. Home Hero Photography */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🏠</span> Home Page Hero Image
                </span>
                <span className="text-[10px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-semibold">
                  Home Visual
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Select Real CakeStory Image (from admin/images/)
                    </label>
                    <select
                      value={content.homeHero.visual.imageAsset || "14.JPG"}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          homeHero: {
                            ...prev.homeHero,
                            visual: { ...prev.homeHero.visual, type: "image", imageAsset: e.target.value },
                          },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white font-mono"
                    >
                      {CAKESTORY_FILENAMES.map((file) => (
                        <option key={file} value={file}>
                          {file}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Image Caption / Alt Text
                    </label>
                    <input
                      type="text"
                      value={content.homeHero.visual.caption || ""}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          homeHero: {
                            ...prev.homeHero,
                            visual: { ...prev.homeHero.visual, caption: e.target.value },
                          },
                        }))
                      }
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white"
                      placeholder="e.g. Signature Artisanal 2-Tier CakeStory Celebration Cake"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-xl border border-slate-200">
                  <CakeImage
                    src={content.homeHero.visual.imageAsset || "14.JPG"}
                    alt="Home Hero Preview"
                    aspect="square"
                    fit="contain"
                    className="w-36 h-36 rounded-xl shadow-xs border border-slate-100 mb-1.5"
                  />
                  <div className="text-[10px] font-mono text-slate-500">
                    {content.homeHero.visual.imageAsset || "14.JPG"}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Our Story Hero Photography */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>📖</span> Our Story Page Hero Image
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                  Story Visual
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Select Real CakeStory Image (from admin/images/)
                    </label>
                    <select
                      value={content.storyHero?.imageAsset || "AZ_01460.JPG"}
                      onChange={(e) => updateStoryHeroField("imageAsset", e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white font-mono"
                    >
                      {CAKESTORY_FILENAMES.map((file) => (
                        <option key={file} value={file}>
                          {file}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Image Caption / Alt Text
                    </label>
                    <input
                      type="text"
                      value={content.storyHero?.caption || ""}
                      onChange={(e) => updateStoryHeroField("caption", e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white"
                      placeholder="e.g. Central Kitchen Craftsmanship & Fresh Gourmet Ingredients"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-xl border border-slate-200">
                  <CakeImage
                    src={content.storyHero?.imageAsset || "AZ_01460.JPG"}
                    alt="Story Hero Preview"
                    aspect="square"
                    fit="contain"
                    className="w-36 h-36 rounded-xl shadow-xs border border-slate-100 mb-1.5"
                  />
                  <div className="text-[10px] font-mono text-slate-500">
                    {content.storyHero?.imageAsset || "AZ_01460.JPG"}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Franchise Hero Photography */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span>🏪</span> Franchise Page Hero Image
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                  Franchise Visual
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Select Real CakeStory Image (from admin/images/)
                    </label>
                    <select
                      value={content.franchiseHero?.imageAsset || "1.jpg"}
                      onChange={(e) => updateFranchiseHeroField("imageAsset", e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white font-mono"
                    >
                      {CAKESTORY_FILENAMES.map((file) => (
                        <option key={file} value={file}>
                          {file}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Image Caption / Alt Text
                    </label>
                    <input
                      type="text"
                      value={content.franchiseHero?.caption || ""}
                      onChange={(e) => updateFranchiseHeroField("caption", e.target.value)}
                      className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white"
                      placeholder="e.g. High-Demand Signature Retail Cakes for Pune Outlets"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-3 bg-white rounded-xl border border-slate-200">
                  <CakeImage
                    src={content.franchiseHero?.imageAsset || "1.jpg"}
                    alt="Franchise Hero Preview"
                    aspect="square"
                    fit="contain"
                    className="w-36 h-36 rounded-xl shadow-xs border border-slate-100 mb-1.5"
                  />
                  <div className="text-[10px] font-mono text-slate-500">
                    {content.franchiseHero?.imageAsset || "1.jpg"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supporting Cards */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Hero Capability Mini-Cards (Inside Visual Container)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.homeHero.supportingCards.map((card) => (
                <div key={card.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{card.icon}</span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={card.active}
                        onChange={(e) => updateSupportingCard(card.id, "active", e.target.checked)}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Icon & Title</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={card.icon}
                        onChange={(e) => updateSupportingCard(card.id, "icon", e.target.value)}
                        className="w-12 text-center text-xs px-2 py-1 border rounded-lg bg-white border-slate-200"
                      />
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateSupportingCard(card.id, "title", e.target.value)}
                        className="flex-1 text-xs font-bold px-2 py-1 border rounded-lg bg-white border-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Description</label>
                    <input
                      type="text"
                      value={card.description}
                      onChange={(e) => updateSupportingCard(card.id, "description", e.target.value)}
                      className="w-full text-xs px-2 py-1 border rounded-lg bg-white border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Badges */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Floating Trust Badges
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.homeHero.floatingBadges.map((badge) => (
                <div key={badge.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Position: {badge.position}
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={badge.active}
                        onChange={(e) => updateFloatingBadge(badge.id, "active", e.target.checked)}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Icon</label>
                      <input
                        type="text"
                        value={badge.icon}
                        onChange={(e) => updateFloatingBadge(badge.id, "icon", e.target.value)}
                        className="w-full text-center text-xs px-2 py-1 border rounded-lg bg-white border-slate-200"
                      />
                    </div>
                    <div className="col-span-3">
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Title</label>
                      <input
                        type="text"
                        value={badge.title}
                        onChange={(e) => updateFloatingBadge(badge.id, "title", e.target.value)}
                        className="w-full text-xs font-bold px-2 py-1 border rounded-lg bg-white border-slate-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Subtitle</label>
                    <input
                      type="text"
                      value={badge.subtitle}
                      onChange={(e) => updateFloatingBadge(badge.id, "subtitle", e.target.value)}
                      className="w-full text-xs px-2 py-1 border rounded-lg bg-white border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CORE STRENGTHS */}
      {activeTab === "strengths" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              "Why CakeStory?" Section Headers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Badge</label>
                <input
                  type="text"
                  value={content.coreStrengths.badge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      coreStrengths: { ...prev.coreStrengths, badge: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={content.coreStrengths.title}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      coreStrengths: { ...prev.coreStrengths, title: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={content.coreStrengths.subtitle}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      coreStrengths: { ...prev.coreStrengths, subtitle: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-2 border-b border-slate-100">
              Franchise Partner Core Strength Cards ({content.coreStrengths.cards.length} Total)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.coreStrengths.cards.map((card, idx) => (
                <div
                  key={card.id}
                  className={`p-4 rounded-xl border transition space-y-2.5 ${
                    card.active ? "bg-slate-50/70 border-slate-200" : "bg-slate-100/60 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                      Card #{idx + 1}
                    </span>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={card.active}
                        onChange={(e) => updateCoreStrengthCard(card.id, "active", e.target.checked)}
                        className="rounded text-pink-600 focus:ring-pink-500"
                      />
                      <span>Active</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={card.icon}
                      onChange={(e) => updateCoreStrengthCard(card.id, "icon", e.target.value)}
                      className="w-12 text-center text-xs px-2 py-1.5 border rounded-lg bg-white border-slate-200"
                    />
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => updateCoreStrengthCard(card.id, "title", e.target.value)}
                      className="flex-1 text-xs font-bold px-2.5 py-1.5 border rounded-lg bg-white border-slate-200"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => updateCoreStrengthCard(card.id, "description", e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border rounded-lg bg-white border-slate-200 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>CakeStory Dynamic Content System</div>
        <button onClick={handleSave} className="text-pink-600 font-bold hover:underline">
          Save All Changes Live →
        </button>
      </div>
    </AdminLayout>
  );
}
