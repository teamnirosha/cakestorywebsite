import { useState, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  galleryService,
  GalleryReelItem,
  GallerySectionSettings,
} from "../../services/data";
import { useToast } from "../../components/common/Toast";

export default function AdminGallery() {
  const { show } = useToast();

  // Settings State
  const [settings, setSettings] = useState<GallerySectionSettings>(() =>
    galleryService.getSettings()
  );
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Reels State
  const [reels, setReels] = useState<GalleryReelItem[]>(() =>
    galleryService.listReels(true)
  );
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "enabled" | "disabled">("all");

  // Reel Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<GalleryReelItem | null>(null);
  const [formData, setFormData] = useState<{
    reelUrl: string;
    title: string;
    marathiTitle: string;
    videoUrl: string;
    thumbnail: string;
    category: string;
    categoryLabel: string;
    duration: string;
    description: string;
    enabled: boolean;
  }>({
    reelUrl: "",
    title: "",
    marathiTitle: "",
    videoUrl: "",
    thumbnail: "",
    category: "celebrations",
    categoryLabel: "Celebrations",
    duration: "0:20",
    description: "",
    enabled: true,
  });

  // Delete Confirmation State
  const [deleteConfirmReel, setDeleteConfirmReel] = useState<GalleryReelItem | null>(null);

  // Filtered Reels
  const filteredReels = useMemo(() => {
    let list = reels;
    if (statusFilter === "enabled") {
      list = list.filter((r) => r.enabled !== false);
    } else if (statusFilter === "disabled") {
      list = list.filter((r) => r.enabled === false);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.marathiTitle && r.marathiTitle.toLowerCase().includes(q)) ||
          r.reelUrl.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [reels, statusFilter, query]);

  // Handle Section Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      galleryService.updateSettings(settings);
      setIsSavingSettings(false);
      show("Instagram Gallery settings updated successfully!", "success");
    }, 250);
  };

  // Open Modal for Add
  const handleOpenAdd = () => {
    setEditingReel(null);
    setFormData({
      reelUrl: "",
      title: "",
      marathiTitle: "",
      videoUrl: "/videos/reels/reel-1.mp4",
      thumbnail: "/admin/images/AZ_01460.JPG",
      category: "celebrations",
      categoryLabel: "Celebrations",
      duration: "0:20",
      description: "",
      enabled: true,
    });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (reel: GalleryReelItem) => {
    setEditingReel(reel);
    setFormData({
      reelUrl: reel.reelUrl || "",
      title: reel.title || "",
      marathiTitle: reel.marathiTitle || "",
      videoUrl: reel.videoUrl || "",
      thumbnail: reel.thumbnail || "",
      category: reel.category || "celebrations",
      categoryLabel: reel.categoryLabel || "Celebrations",
      duration: reel.duration || "0:20",
      description: reel.description || "",
      enabled: reel.enabled !== false,
    });
    setIsModalOpen(true);
  };

  // Validate Instagram URL
  const isValidInstagramReelUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return (
        (parsed.hostname.includes("instagram.com") || parsed.hostname.includes("instagr.am")) &&
        url.includes("/reel/")
      );
    } catch {
      return false;
    }
  };

  // Submit Reel Form
  const handleSubmitReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reelUrl.trim()) {
      show("Please enter an Instagram Reel URL.", "error");
      return;
    }
    if (!isValidInstagramReelUrl(formData.reelUrl.trim())) {
      show("Please enter a valid Instagram Reel URL containing '/reel/'.", "warning");
      return;
    }
    if (!formData.title.trim()) {
      show("Please provide a title for the Reel.", "error");
      return;
    }

    if (editingReel) {
      galleryService.updateReel(editingReel.id, {
        ...formData,
      });
      show("Reel details updated successfully!", "success");
    } else {
      galleryService.addReel({
        ...formData,
      });
      show("New reel added to Instagram Gallery!", "success");
    }

    setReels(galleryService.listReels(true));
    setIsModalOpen(false);
  };

  // Toggle Reel Active State
  const handleToggleReel = (id: string) => {
    const updated = galleryService.toggleEnabled(id);
    setReels(galleryService.listReels(true));
    if (updated) {
      show(
        `Reel is now ${updated.enabled ? "Enabled (Live)" : "Disabled (Hidden)"}`,
        updated.enabled ? "success" : "info"
      );
    }
  };

  // Delete Reel
  const handleConfirmDelete = () => {
    if (!deleteConfirmReel) return;
    galleryService.deleteReel(deleteConfirmReel.id);
    setReels(galleryService.listReels(true));
    show(`Reel "${deleteConfirmReel.title}" deleted.`, "info");
    setDeleteConfirmReel(null);
  };

  // Move Reel
  const handleMove = (id: string, dir: "up" | "down") => {
    galleryService.moveReel(id, dir);
    setReels(galleryService.listReels(true));
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (
      window.confirm(
        "Are you sure you want to reset the Instagram Gallery and 5 initial reels to factory defaults? Any custom reels added will be cleared."
      )
    ) {
      galleryService.resetDefaults();
      setSettings(galleryService.getSettings());
      setReels(galleryService.listReels(true));
      show("Gallery and Reels reset to original 5 reels.", "info");
    }
  };

  return (
    <AdminLayout title="">
      <div className="space-y-6 max-w-6xl mx-auto pb-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-slate-400">&gt;</span>
          <span className="text-[#8c2243] font-semibold tracking-wide uppercase">
            Sweet Scenes Management
          </span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-pink-50 text-[#b51f50] flex items-center justify-center shrink-0 border border-pink-100">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Sweet Scenes & Reels
                </h1>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    settings.enabled
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}
                >
                  {settings.enabled ? "Section Active" : "Section Disabled"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize titles, manage reel videos, configure display orders, and control public homepage visibility.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
              title="Reset to 5 initial seed reels"
            >
              Reset to Defaults
            </button>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-[#361220] hover:bg-stone-900 text-white text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <span>+ Add New Reel</span>
            </button>
          </div>
        </div>

        {/* SECTION 1: Section Settings Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                1. Homepage Section Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize the texts, links, and operational controls rendered on the public landing page.
              </p>
            </div>
            <label className="inline-flex items-center gap-2.5 cursor-pointer">
              <span className="text-xs font-medium text-slate-600">Show Section on Homepage:</span>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                className="w-4 h-4 text-[#8c2243] rounded border-slate-300 focus:ring-[#8c2243]"
              />
            </label>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section Eyebrow Tag (English)
                </label>
                <input
                  type="text"
                  value={settings.eyebrow}
                  onChange={(e) => setSettings({ ...settings, eyebrow: e.target.value })}
                  placeholder="INSTAGRAM"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section Eyebrow Tag (Marathi)
                </label>
                <input
                  type="text"
                  value={settings.eyebrowMarathi || ""}
                  onChange={(e) => setSettings({ ...settings, eyebrowMarathi: e.target.value })}
                  placeholder="इन्स्टाग्राम"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Main Heading (English)
                </label>
                <input
                  type="text"
                  value={settings.heading}
                  onChange={(e) => setSettings({ ...settings, heading: e.target.value })}
                  placeholder="Moments That Make Life Sweeter"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Main Heading (Marathi)
                </label>
                <input
                  type="text"
                  value={settings.headingMarathi || ""}
                  onChange={(e) => setSettings({ ...settings, headingMarathi: e.target.value })}
                  placeholder="आयुष्याला अधिक गोड बनवणारे खास क्षण"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle Description (English)
                </label>
                <input
                  type="text"
                  value={settings.subtitle}
                  onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                  placeholder="From custom creations to happy celebrations..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Subtitle Description (Marathi)
                </label>
                <input
                  type="text"
                  value={settings.subtitleMarathi || ""}
                  onChange={(e) => setSettings({ ...settings, subtitleMarathi: e.target.value })}
                  placeholder="कस्टम केक्सपासून ते प्रत्येक आनंदाच्या क्षणांपर्यंत..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://www.instagram.com/cakestorydesserts/"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Button Action Label
                </label>
                <input
                  type="text"
                  value={settings.ctaLabel || ""}
                  onChange={(e) => setSettings({ ...settings, ctaLabel: e.target.value })}
                  placeholder="Follow @cakestorydesserts"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                />
              </div>
            </div>

            {/* Display Feature Toggles */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showHighlights !== false}
                  onChange={(e) => setSettings({ ...settings, showHighlights: e.target.checked })}
                  className="w-4 h-4 text-[#8c2243] rounded border-slate-300"
                />
                <span className="text-slate-700 font-medium">Show 4 Supporting Highlights</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoplay !== false}
                  onChange={(e) => setSettings({ ...settings, autoplay: e.target.checked })}
                  className="w-4 h-4 text-[#8c2243] rounded border-slate-300"
                />
                <span className="text-slate-700 font-medium">Auto-Play Active Video</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.defaultMuted !== false}
                  onChange={(e) => setSettings({ ...settings, defaultMuted: e.target.checked })}
                  className="w-4 h-4 text-[#8c2243] rounded border-slate-300"
                />
                <span className="text-slate-700 font-medium">Start Videos Muted (Browser Best Practice)</span>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-700 text-white font-semibold shadow-xs transition cursor-pointer flex items-center gap-2"
              >
                {isSavingSettings ? "Saving Settings..." : "Save Section Settings"}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: Reels Management List */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                2. Configured Instagram Reels ({reels.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Reorder, enable/disable, preview media, or update links and captions for each reel.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
              >
                <option value="all">All Reels ({reels.length})</option>
                <option value="enabled">Enabled Only ({reels.filter((r) => r.enabled !== false).length})</option>
                <option value="disabled">Disabled Only ({reels.filter((r) => r.enabled === false).length})</option>
              </select>

              <input
                type="text"
                placeholder="Search reels..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 w-44"
              />
            </div>
          </div>

          {filteredReels.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <p className="text-sm font-medium">No reels matching filter.</p>
              <button
                type="button"
                onClick={handleOpenAdd}
                className="mt-3 px-4 py-2 rounded-lg bg-[#361220] text-white text-xs font-semibold"
              >
                + Add First Reel
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredReels.map((reel, idx) => (
                <div
                  key={reel.id}
                  className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    reel.enabled === false ? "bg-slate-50/70 opacity-60" : "hover:bg-slate-50/40"
                  }`}
                >
                  {/* Left: Order Buttons & Video Preview */}
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1 items-center">
                      <button
                        type="button"
                        onClick={() => handleMove(reel.id, "up")}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        ▲
                      </button>
                      <span className="text-[11px] font-mono font-bold text-slate-500">
                        #{reel.order || idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMove(reel.id, "down")}
                        disabled={idx === filteredReels.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Video / Thumbnail preview box */}
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0 relative border border-slate-200">
                      {reel.videoUrl ? (
                        <video
                          src={reel.videoUrl}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px]">
                          No Media
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] text-white font-mono">
                        {reel.duration || "0:20"}
                      </div>
                    </div>

                    {/* Title and details */}
                    <div className="min-w-0 max-w-lg">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {reel.title}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            reel.enabled !== false
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {reel.enabled !== false ? "Live" : "Hidden"}
                        </span>
                      </div>

                      {reel.marathiTitle && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {reel.marathiTitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 line-clamp-1 mt-1">
                        {reel.description}
                      </p>

                      <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                        <a
                          href={reel.reelUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#b51f50] hover:underline flex items-center gap-1 font-mono text-[10.5px]"
                        >
                          <span>{reel.reelUrl.slice(0, 42)}...</span>
                          <span>↗</span>
                        </a>
                        {reel.videoUrl && (
                          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {reel.videoUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleReel(reel.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                        reel.enabled !== false
                          ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                          : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {reel.enabled !== false ? "Hide" : "Enable"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(reel)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmReel(reel)}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 text-xs font-semibold transition cursor-pointer"
                      title="Delete reel"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MODAL: Add / Edit Reel */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">
                  {editingReel ? "Edit Instagram Reel" : "Add New Instagram Reel"}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReel} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Instagram Reel URL <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.instagram.com/reel/Db-vla0uZuG/..."
                    value={formData.reelUrl}
                    onChange={(e) => setFormData({ ...formData, reelUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Must be a valid Instagram reel link containing /reel/
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Title (English) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A Little Sweetness, A Lot of Happiness!"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Title (Marathi)
                  </label>
                  <input
                    type="text"
                    placeholder="गोडवा थोडा, आनंद भरपूर!"
                    value={formData.marathiTitle}
                    onChange={(e) => setFormData({ ...formData, marathiTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Local Video File URL / Asset Path
                  </label>
                  <input
                    type="text"
                    placeholder="/videos/reels/reel-1.mp4"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Direct path to local MP4 video file (e.g. /videos/reels/reel-1.mp4 to reel-5.mp4)
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Description / Caption
                  </label>
                  <textarea
                    rows={3}
                    placeholder="From dreamy cakes to delicious desserts..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8c2243]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="0:20"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value,
                          categoryLabel: e.target.options[e.target.selectedIndex].text,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="celebrations">Celebrations</option>
                      <option value="custom-cakes">Custom Cakes</option>
                      <option value="bts">Behind The Scenes</option>
                      <option value="outlets">Outlet Moments</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enabled}
                      onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                      className="w-4 h-4 text-[#8c2243] rounded border-slate-300"
                    />
                    <span className="text-slate-800 font-semibold">Enable Reel on Public Website</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-[#361220] hover:bg-stone-900 text-white font-semibold shadow-xs transition"
                  >
                    {editingReel ? "Save Changes" : "Create Reel"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Delete Confirmation */}
        {deleteConfirmReel && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Delete Reel?</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Are you sure you want to remove &quot;{deleteConfirmReel.title}&quot; from the gallery? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmReel(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
