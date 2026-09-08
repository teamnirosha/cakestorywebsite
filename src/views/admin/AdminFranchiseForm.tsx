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
    <AdminLayout
      title={isEdit ? "Edit Outlet Profile" : "Register New Pune Outlet"}
      subtitle="Data saved here updates the public website, Leaflet map markers, and individual outlet URL."
    >
      <form onSubmit={submit} className="max-w-4xl space-y-6">
        {/* Core Details */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Store Identity & Zone
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Franchise Brand Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. CakeStory Desserts — Kothrud"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
              {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Area / Locality Name
              </label>
              <input
                type="text"
                value={form.outletName}
                onChange={(e) => update("outletName", e.target.value)}
                placeholder="e.g. Paud Road Flagship"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pune Zone <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.zone}
                onChange={(e) => update("zone", e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 bg-white focus:outline-none focus:border-pink-500"
              >
                {PUNE_ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL Slug (/outlets/<span className="text-pink-600 font-mono font-bold">{form.slug || "slug"}</span>)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="cakestory-kothrud"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 font-mono focus:outline-none focus:border-pink-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Used for individual outlet website URL</p>
            </div>
          </div>
        </div>

        {/* Location & Map Coordinates */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Physical Address & OpenStreetMap Coordinates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Shop 10, Commercial Complex, Near Vanaz Corner, Paud Road"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
              {errors.address && <p className="text-[10px] text-rose-500 mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Latitude <span className="text-rose-500">*</span> (e.g. 18.5204)
              </label>
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => update("latitude", parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-mono"
              />
              {errors.latitude && <p className="text-[10px] text-rose-500 mt-1">{errors.latitude}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Longitude <span className="text-rose-500">*</span> (e.g. 73.8567)
              </label>
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => update("longitude", parseFloat(e.target.value) || 0)}
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 font-mono"
              />
              {errors.longitude && <p className="text-[10px] text-rose-500 mt-1">{errors.longitude}</p>}
            </div>
          </div>
        </div>

        {/* Contact & Operations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Contact & Operations Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="+91 98230 12345"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
              {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opening Hours</label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => update("openingHours", e.target.value)}
                placeholder="10:00 AM - 11:00 PM"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Franchise Manager</label>
              <input
                type="text"
                value={form.manager || ""}
                onChange={(e) => update("manager", e.target.value)}
                placeholder="Manager Name"
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Store Description</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Describe the outlet catchment and offerings..."
                className="w-full text-xs px-3 py-2 border rounded-lg border-slate-200 focus:outline-none focus:border-pink-500 resize-none"
              />
            </div>

            <div className="sm:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-2">Available Capabilities</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_OPTIONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleService(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition ${
                      form.services.includes(s)
                        ? "bg-pink-50 text-pink-700 border-pink-300 font-semibold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {form.services.includes(s) && "✓ "}
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="sm:col-span-3 pt-2">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => update("active", e.target.checked)}
                  className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 border-slate-300"
                />
                <span className="text-xs font-semibold text-slate-800">
                  Operational (Checked = live on public map & directory)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow-sm transition"
          >
            {isEdit ? "Update Outlet" : "Save & Publish Outlet"}
          </button>
          <Link
            to="/admin/franchises"
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-4 py-2.5 rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
