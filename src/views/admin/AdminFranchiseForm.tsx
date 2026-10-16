import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { franchiseService, Franchise } from "../../services/data";
import { useToast } from "../../components/common/Toast";

const PUNE_ZONES = ["West Pune", "South Pune", "East Pune", "PCMC", "Satara", "Other Regional"];
const SERVICE_OPTIONS = [
  "Celebration Cakes",
  "Custom Gourmet Cakes",
  "Artisanal Pastries",
  "Eggless Specials",
  "Birthday Cakes",
  "Corporate Bulk Orders",
  "Quick Pickup",
  "Same Day Delivery",
];

const emptyOutlet: Omit<Franchise, "id"> = {
  name: "",
  outletName: "",
  slug: "",
  zone: "West Pune",
  address: "",
  city: "Pune",
  state: "Maharashtra",
  country: "India",
  latitude: 18.5204,
  longitude: 73.8567,
  phone: "+91 ",
  email: "",
  openingHours: "10:00 AM - 11:00 PM",
  manager: "",
  services: ["Celebration Cakes", "Eggless Specials"],
  description: "",
  active: true,
  established: String(new Date().getFullYear()),
};

export default function AdminFranchiseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const isEdit = Boolean(id);
  const [form, setForm] = useState<Omit<Franchise, "id">>(emptyOutlet);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit && id) {
      const f = franchiseService.get(id);
      if (f) {
        const { id: _, ...rest } = f;
        setForm(rest);
      }
    }
  }, [id, isEdit]);

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => {
    setForm((p) => {
      const next = { ...p, [k]: v };
      // Auto-suggest slug if name changes and slug wasn't manually customized
      if (k === "name" && !isEdit) {
        next.slug = String(v)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return next;
    });
  };

  const toggleService = (s: string) => {
    setForm((p) => ({
      ...p,
      services: p.services.includes(s) ? p.services.filter((x) => x !== s) : [...p.services, s],
    }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Outlet name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.phone.trim() || form.phone.trim() === "+91") e.phone = "Phone number is required";
    if (isNaN(form.latitude) || form.latitude < -90 || form.latitude > 90) e.latitude = "Invalid latitude";
    if (isNaN(form.longitude) || form.longitude < -180 || form.longitude > 180) e.longitude = "Invalid longitude";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      show("Please check the form for errors", "error");
      return;
    }

    const cleanSlug =
      form.slug?.trim() ||
      form.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const payload = {
      ...form,
      slug: cleanSlug,
      email: form.email.trim() || `${cleanSlug}@cakestory.com`,
    };

    if (isEdit && id) {
      franchiseService.update(id, payload);
      show(`${payload.name} updated successfully`, "success");
    } else {
      const created = franchiseService.create(payload);
      show(`${created.name} registered on public map`, "success");
    }
    navigate("/admin/franchises");
  };

  return (
    <AdminLayout title="">
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* ----------------- BREADCRUMBS ----------------- */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <Link to="/admin/franchises" className="hover:text-slate-800 transition">
            CakeStory ERP
          </Link>
          <span className="text-slate-400">&gt;</span>
          <Link to="/admin/franchises" className="hover:text-slate-800 transition uppercase">
            Outlets
          </Link>
          <span className="text-slate-400">&gt;</span>
          <span className="text-[#2563eb] font-semibold tracking-wide uppercase">
            {isEdit ? "Edit Outlet" : "Register Store"}
          </span>
        </div>

        {/* ----------------- TOP HEADER CARD ----------------- */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 border border-blue-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {isEdit ? `Edit Outlet: ${form.name || "Store"}` : "Register New Pune Outlet"}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure store identity, geolocation coordinates, contact helpline, and live map publication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <Link
              to="/admin/franchises"
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to Outlets</span>
            </Link>
            <button
              type="button"
              onClick={submit}
              className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>✓</span>
              <span>{isEdit ? "Update Store" : "Register Store"}</span>
            </button>
          </div>
        </div>

        {/* ----------------- FORM CONTAINER ----------------- */}
        <form onSubmit={submit} className="space-y-4">
          {/* Section 1: Store Identity & Zone */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Store Identity & Operational Zone
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Franchise Brand Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="e.g. CakeStory Desserts — Kothrud"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Area / Locality Name
                </label>
                <input
                  type="text"
                  value={form.outletName}
                  onChange={(e) => update("outletName", e.target.value)}
                  placeholder="e.g. Paud Road Flagship"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pune Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={form.zone}
                  onChange={(e) => update("zone", e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800 cursor-pointer"
                >
                  {PUNE_ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Slug{" "}
                  <span className="text-[11px] font-normal text-slate-400">
                    (/outlets/<span className="text-[#2563eb] font-mono font-bold">{form.slug || "slug"}</span>)
                  </span>
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => update("slug", e.target.value)}
                  placeholder="cakestory-kothrud"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 font-mono bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Physical Address & Map Coordinates */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Physical Location & Map Coordinates
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Shop 10, Commercial Complex, Near Vanaz Corner, Paud Road"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
                {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => update("state", e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Latitude <span className="text-rose-500">*</span>{" "}
                  <span className="text-[11px] font-normal text-slate-400 font-mono">(e.g. 18.5204)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => update("latitude", parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 font-mono bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
                {errors.latitude && <p className="text-[11px] text-rose-500 mt-1">{errors.latitude}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Longitude <span className="text-rose-500">*</span>{" "}
                  <span className="text-[11px] font-normal text-slate-400 font-mono">(e.g. 73.8567)</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => update("longitude", parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 font-mono bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
                {errors.longitude && <p className="text-[11px] text-rose-500 mt-1">{errors.longitude}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Contact & Operations Information */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Contact & Operations Information
              </h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 98230 12345"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 font-mono bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Opening Hours</label>
                <input
                  type="text"
                  value={form.openingHours}
                  onChange={(e) => update("openingHours", e.target.value)}
                  placeholder="10:00 AM - 11:00 PM"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Franchise Manager</label>
                <input
                  type="text"
                  value={form.manager || ""}
                  onChange={(e) => update("manager", e.target.value)}
                  placeholder="Manager / Team Name"
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Store Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Describe the outlet catchment area and key features..."
                  className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Available Store Capabilities */}
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Available Capabilities & Specialities
              </h2>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleService(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                      form.services.includes(s)
                        ? "bg-blue-50 text-[#2563eb] border-blue-300 font-semibold shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {form.services.includes(s) && "✓ "}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Status & Submission Footer */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => update("active", e.target.checked)}
                className="w-4 h-4 rounded text-[#2563eb] focus:ring-[#2563eb] border-slate-300 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Operational Store Status
                </span>
                <span className="text-[11px] text-slate-500 block">
                  When enabled, this outlet appears immediately on public Pune map and store directory.
                </span>
              </div>
            </label>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                to="/admin/franchises"
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                {isEdit ? "Update Store Profile" : "Register Store Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
