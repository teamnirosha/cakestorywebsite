import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { franchiseService, Franchise } from "../../services/data";
import { useToast } from "../../components/common/Toast";

export default function AdminFranchises() {
  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirm, setConfirm] = useState<Franchise | null>(null);
  const [, force] = useState({});
  const { show } = useToast();

  const all = franchiseService.list();
  const zones = useMemo(() => ["all", ...franchiseService.zones()], [all]);

  const list = useMemo(() => {
    let l = all;
    if (statusFilter !== "all") {
      l = l.filter((f) => (statusFilter === "active" ? f.active : !f.active));
    }
    if (zoneFilter !== "all") {
      l = l.filter((f) => f.zone === zoneFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      l = l.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.outletName.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          (f.zone && f.zone.toLowerCase().includes(q))
      );
    }
    return l.sort((a, b) => a.name.localeCompare(b.name));
  }, [all, statusFilter, zoneFilter, query]);

  const handleDelete = () => {
    if (!confirm) return;
    franchiseService.remove(confirm.id);
    setConfirm(null);
    force({});
    show(`${confirm.name} removed from outlets`, "info");
  };

  const toggleActive = (f: Franchise) => {
    const updated = franchiseService.toggleActive(f.id);
    force({});
    if (updated) {
      show(
        `${f.name} marked as ${updated.active ? "Operational" : "Temporarily Closed"}`,
        updated.active ? "success" : "warning"
      );
    }
  };

  return (
    <AdminLayout
      title="Outlet Network Management"
      subtitle="Manage CakeStory Desserts Pune franchise stores, map locations, and store profile URLs."
      action={
        <Link
          to="/admin/franchises/add"
          className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition flex items-center gap-1.5"
        >
          <span>+</span> Add New Outlet
        </Link>
      }
    >
      {/* Search & Filter Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4 flex flex-col md:flex-row gap-3 shadow-xs">
        <div className="flex-1 relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by outlet name, area, or address..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:border-pink-500 focus:outline-none transition"
          />
        </div>

        <select
          value={zoneFilter}
          onChange={(e) => setZoneFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer font-medium text-slate-700"
        >
          <option value="all">All Pune Zones ({all.length})</option>
          {zones.filter((z) => z !== "all").map((z) => (
            <option key={z} value={z}>
              Zone: {z}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none cursor-pointer font-medium text-slate-700"
        >
          <option value="all">All Status</option>
          <option value="active">Operational Only</option>
          <option value="inactive">Closed Only</option>
        </select>
      </div>

      {/* Outlet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900">{list.length}</strong> of{" "}
            <strong className="text-slate-900">{all.length}</strong> total outlets
          </span>
          <span className="text-[11px]">All updates immediately reflect on the public map</span>
        </div>

        {list.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="text-3xl mb-2">🏪</div>
            <div className="text-sm font-semibold text-slate-800">No outlets found matching criteria</div>
            <p className="text-xs text-slate-400 mt-1">Try changing search query or zone filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">Store / Outlet</th>
                  <th className="py-3 px-4 font-semibold">Pune Zone</th>
                  <th className="py-3 px-4 font-semibold">Contact & Hours</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-sm shrink-0">
                          🏪
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{f.name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{f.address}</div>
                          <div className="text-[10px] text-slate-400 font-mono">/{f.slug || f.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {f.zone || "Pune Central"}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">{f.city}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>📞 {f.phone}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">🕐 {f.openingHours}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleActive(f)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition ${
                          f.active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                        }`}
                        title="Click to toggle operational status"
                      >
                        {f.active ? "● Operational" : "○ Closed"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      {/* CRITICAL: Open outlet page in NEW BROWSER TAB */}
                      <a
                        href={`/outlets/${f.slug || f.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-pink-600 font-semibold px-2 py-1 rounded hover:bg-slate-100 transition mr-2"
                        title="Open Outlet Page in New Tab"
                      >
                        <span>View Page</span>
                        <span>↗</span>
                      </a>
                      <Link
                        to={`/admin/franchises/edit/${f.id}`}
                        className="text-blue-600 hover:underline font-semibold mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setConfirm(f)}
                        className="text-rose-500 hover:text-rose-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setConfirm(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-3xl mb-2 text-center">⚠️</div>
            <h3 className="text-base font-bold text-slate-900 text-center">Delete {confirm.name}?</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              This outlet will be permanently removed from the public map and outlet directory.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="flex-1 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs"
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
