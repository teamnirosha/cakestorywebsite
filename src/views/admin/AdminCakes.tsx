import { useState, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { cakeService, Cake } from "../../services/data";
import { useToast } from "../../components/common/Toast";
import CakeImage from "../../components/common/CakeImage";

const AVAILABLE_IMAGES = [
  { value: "1.jpg", label: "1.jpg (Signature Chocolate Drip Cake)" },
  { value: "12.jpg", label: "12.jpg (Fresh Strawberry Gateau)" },
  { value: "14.JPG", label: "14.JPG (Artisan Piped Celebration Tier)" },
  { value: "5.png", label: "5.png (Triple Layered Fusion Delight)" },
  { value: "A7401344.jpeg", label: "A7401344.jpeg (Black Forest Artisan Classic)" },
  { value: "AZ_01460.JPG", label: "AZ_01460.JPG (Royal Pistachio & Rose Rasmalai)" },
  { value: "AZ_01683.JPG", label: "AZ_01683.JPG (Blueberry Velvet Cheesecake)" },
  { value: "AZ_01692.JPG", label: "AZ_01692.JPG (Belgian Dark Truffle Standard)" },
  { value: "DSC03187.JPG", label: "DSC03187.JPG (Pineapple Glaze Heritage Bakes)" },
  { value: "DSC08534.JPG", label: "DSC08534.JPG (Butterscotch Crunch Specialty)" },
  { value: "DSC08617.JPG", label: "DSC08617.JPG (Mango Passion Summer Edition)" },
];

const DEFAULT_CATEGORIES = [
  "Signature Cakes",
  "Celebration Cakes",
  "Custom Bakes",
  "Fusion Specials",
  "Cheesecakes",
  "Pastries & Slices",
  "Cupcakes & Small Bakes",
];

const emptyProduct: Omit<Cake, "id"> = {
  name: "",
  category: "Signature Cakes",
  categoryId: "cat-signature",
  description: "",
  price: 549,
  image: "1.jpg",
  ingredients: ["Central Kitchen Sponge", "Whipped Cream"],
  flavor: "Chocolate Truffle",
  size: "500g / 1kg",
  availability: "in-stock",
  featured: false,
  tags: ["bestseller", "eggless"],
  rating: 4.8,
  color: "pink",
  status: "active",
};

export default function AdminCakes() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [formData, setFormData] = useState<Omit<Cake, "id">>(emptyProduct);
  const [customImage, setCustomImage] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Cake | null>(null);

  // Force re-render on data modification
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  const { show } = useToast();
  const allCakes = cakeService.list();

  // Dynamic Categories from data
  const dynamicCategories = useMemo(() => {
    const fromData = Array.from(new Set(allCakes.map((c) => c.category).filter(Boolean)));
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...fromData]));
  }, [allCakes]);

  // Filtered List
  const filteredCakes = useMemo(() => {
    return allCakes.filter((c) => {
      const matchesQuery =
        !query.trim() ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.flavor.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase());

      const matchesCat = categoryFilter === "all" || c.category === categoryFilter;

      const isActive = c.status ? c.status === "active" : c.availability !== "out-of-stock";
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesQuery && matchesCat && matchesStatus;
    });
  }, [allCakes, query, categoryFilter, statusFilter]);

  // KPI Calculations
  const totalCount = allCakes.length;
  const activeCount = allCakes.filter((c) =>
    c.status ? c.status === "active" : c.availability !== "out-of-stock"
  ).length;
  const inactiveCount = totalCount - activeCount;
  const avgPrice = totalCount
    ? Math.round(allCakes.reduce((acc, c) => acc + (Number(c.price) || 0), 0) / totalCount)
    : 0;

  // Open Create Modal
  const openCreateModal = () => {
    setEditingCake(null);
    setFormData(emptyProduct);
    setCustomImage(false);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cake: Cake) => {
    setEditingCake(cake);
    const { id: _, ...rest } = cake;
    const isStandard = AVAILABLE_IMAGES.some((img) => img.value === cake.image);
    setCustomImage(!isStandard);
    setFormData({
      ...rest,
      status: cake.status || (cake.availability === "out-of-stock" ? "inactive" : "active"),
    });
    setModalOpen(true);
  };

  // Save Modal (Create / Edit)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      show("Product name is required", "error");
      return;
    }
    if (!formData.image.trim()) {
      show("Product image is required", "error");
      return;
    }
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      show("Please enter a valid price", "error");
      return;
    }

    if (editingCake) {
      cakeService.update(editingCake.id, {
        ...formData,
        price: Number(formData.price),
      });
      show(`Updated "${formData.name}" successfully`, "success");
    } else {
      cakeService.create({
        ...formData,
        price: Number(formData.price),
      });
      show(`Added "${formData.name}" to Product Catalog`, "success");
    }

    setModalOpen(false);
    refresh();
  };

  // Toggle Status
  const handleToggleStatus = (cake: Cake) => {
    const updated = cakeService.toggleStatus(cake.id);
    if (updated) {
      const isNowActive = updated.status === "active";
      show(
        `"${cake.name}" is now ${isNowActive ? "Active" : "Inactive"}`,
        isNowActive ? "success" : "info"
      );
      refresh();
    }
  };

  // Delete Product
  const handleDelete = () => {
    if (!deleteConfirm) return;
    const success = cakeService.delete(deleteConfirm.id);
    if (success) {
      show(`Deleted "${deleteConfirm.name}" from catalog`, "info");
      refresh();
    }
    setDeleteConfirm(null);
  };

  return (
    <AdminLayout
      title="Product Catalog"
      subtitle="Central product master & image mapping. Products managed here serve as single source of truth."
      action={
        <button
          onClick={openCreateModal}
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>+</span> Add Product
        </button>
      }
    >
      {/* 1. ERP KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total SKUs</span>
            <span className="text-base p-1.5 rounded-md bg-pink-50 text-pink-600">🎂</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-display">{totalCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Catalog items registered</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Products</span>
            <span className="text-base p-1.5 rounded-md bg-emerald-50 text-emerald-600">✅</span>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2 font-display">{activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Available for distribution</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inactive / Drafts</span>
            <span className="text-base p-1.5 rounded-md bg-amber-50 text-amber-600">⏸️</span>
          </div>
          <div className="text-2xl font-bold text-slate-700 mt-2 font-display">{inactiveCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Out of stock or paused</div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Price</span>
            <span className="text-base p-1.5 rounded-md bg-blue-50 text-blue-600">₹</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-display">₹{avgPrice}</div>
          <div className="text-[11px] text-slate-500 mt-1">Standard retail benchmark</div>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product name, SKU, flavor..."
              className="w-full pl-8 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-pink-500 bg-slate-50/50"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-pink-500 bg-white"
          >
            <option value="all">All Categories ({totalCount})</option>
            {dynamicCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")}
            className="px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-pink-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only ({activeCount})</option>
            <option value="inactive">Inactive Only ({inactiveCount})</option>
          </select>
        </div>

        {/* View Mode Toggle & Counter */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredCakes.length}</strong> of {totalCount}
          </span>
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode("table")}
              title="Table View"
              className={`px-2 py-1 text-xs rounded-md transition ${
                viewMode === "table" ? "bg-white shadow-xs font-semibold text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ☰ Table
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Grid View"
              className={`px-2 py-1 text-xs rounded-md transition ${
                viewMode === "grid" ? "bg-white shadow-xs font-semibold text-slate-900" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              ⊞ Grid
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRODUCT CATALOG CONTENT (TABLE OR COMPACT GRID) */}
      {filteredCakes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-display font-bold text-base text-slate-800">No products match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, category filter, or status filter.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setCategoryFilter("all");
              setStatusFilter("all");
            }}
            className="mt-4 text-xs font-semibold text-pink-600 hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : viewMode === "table" ? (
        /* TABLE VIEW (Information-Dense ERP Layout) */
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product / SKU</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Image Asset</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCakes.map((cake) => {
                  const isActive = cake.status ? cake.status === "active" : cake.availability !== "out-of-stock";
                  return (
                    <tr key={cake.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Product details + Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shrink-0 flex items-center justify-center p-0.5">
                            <CakeImage
                              src={cake.image}
                              alt={cake.name}
                              aspect="square"
                              fit="contain"
                              className="w-full h-full"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <span>{cake.name}</span>
                              {cake.featured && (
                                <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">{cake.flavor || cake.description}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cake.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {cake.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900 text-sm">₹{cake.price}</span>
                        <div className="text-[10px] text-slate-400">{cake.size || "Standard"}</div>
                      </td>

                      {/* Image Asset filename */}
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] bg-pink-50 text-pink-700 px-2 py-0.5 rounded border border-pink-100 max-w-[140px] truncate block">
                          {cake.image}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(cake)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer border ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Click to toggle active/inactive status"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`} />
                          <span>{isActive ? "Active" : "Inactive"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(cake)}
                            className="px-2.5 py-1 text-xs font-semibold text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(cake)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW (Compact ERP Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCakes.map((cake) => {
            const isActive = cake.status ? cake.status === "active" : cake.availability !== "out-of-stock";
            return (
              <div
                key={cake.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 flex flex-col hover:border-slate-300 transition"
              >
                <div className="relative w-full aspect-square rounded-lg border border-slate-200/80 bg-slate-50 overflow-hidden mb-3 p-2 flex items-center justify-center">
                  <CakeImage
                    src={cake.image}
                    alt={cake.name}
                    aspect="square"
                    fit="contain"
                    className="w-full h-full"
                  />
                  <span
                    className={`absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-bold text-xs text-slate-900 line-clamp-1">{cake.name}</h3>
                    <span className="font-bold text-xs text-slate-900 shrink-0">₹{cake.price}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-2 truncate">
                    {cake.category} • <span className="font-mono text-[10px] text-slate-400">{cake.image}</span>
                  </div>

                  <div className="mt-auto pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleToggleStatus(cake)}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-medium"
                    >
                      {isActive ? "Pause" : "Activate"}
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(cake)}
                        className="text-pink-600 hover:text-pink-700 font-semibold px-2 py-0.5 rounded hover:bg-pink-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(cake)}
                        className="text-rose-600 hover:text-rose-700 font-semibold px-2 py-0.5 rounded hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. ADD / EDIT PRODUCT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  {editingCake ? `Edit Product: ${editingCake.name}` : "Add New Product SKU"}
                </h3>
                <p className="text-xs text-slate-500">
                  Product details and image references are stored centrally.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Belgian Dark Chocolate Truffle"
                  required
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 bg-white"
                  >
                    {dynamicCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Standard Retail Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="e.g. 599"
                    required
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>
              </div>

              {/* Flavor & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Flavor Profile</label>
                  <input
                    type="text"
                    value={formData.flavor}
                    onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
                    placeholder="e.g. Dark Chocolate Ganache"
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Standard Size</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. 500g / 1kg"
                    className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              {/* PRODUCT IMAGE SELECTION & LIVE PREVIEW (CRITICAL REQUIREMENT) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Product Image Asset <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomImage(!customImage)}
                    className="text-[11px] text-pink-600 hover:underline font-semibold"
                  >
                    {customImage ? "← Choose from Presets" : "Custom Filename / URL →"}
                  </button>
                </div>

                <div className="flex items-start gap-4">
                  {/* Image Preview Box */}
                  <div className="w-20 h-20 rounded-xl border border-slate-200 bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center shadow-xs">
                    <CakeImage
                      src={formData.image}
                      alt="Preview"
                      aspect="square"
                      fit="contain"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {!customImage ? (
                      <div>
                        <select
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 bg-white font-mono"
                        >
                          {AVAILABLE_IMAGES.map((img) => (
                            <option key={img.value} value={img.value}>
                              {img.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Standardized CakeStory product photography stored in <code className="text-pink-600 bg-pink-50 px-1 py-0.2 rounded font-mono">public/admin/images/</code>
                        </p>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="text"
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          placeholder="e.g. 1.jpg or /images/products/my-cake.webp"
                          className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-mono"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Enter filename located in public directory or valid image path.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description & Ingredients</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter product culinary details and description..."
                  className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              {/* Status & Featured */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-pink-600 focus:ring-pink-500"
                  />
                  <span className="text-xs font-medium text-slate-700">Mark as Featured Product</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-600">Status:</span>
                  <select
                    value={formData.status || "active"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="text-xs px-2.5 py-1 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 bg-white font-medium"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="inactive">Inactive (Paused)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg shadow-xs transition cursor-pointer"
                >
                  {editingCake ? "Save Changes" : "Add to Catalog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DELETE CONFIRMATION MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xl mb-3">
              🗑️
            </div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Delete "{deleteConfirm.name}"?
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This product record will be permanently removed from the central Product Catalog. Outlets and franchise data will remain completely unaffected.
            </p>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
