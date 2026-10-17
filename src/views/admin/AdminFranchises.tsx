import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { franchiseService, Franchise } from "../../services/data";
import { useToast } from "../../components/common/Toast";
import { getOutletUrl } from "../../utils/outletRouting";

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
          f.phone.includes(q) ||
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
        `${f.name} marked as ${updated.active ? "Active" : "Inactive"}`,
        updated.active ? "success" : "warning"
      );
    }
  };

  return (
    <AdminLayout title="">
      <div className="space-y-4">
        {/* ----------------- TOP STORE MANAGEMENT CARD ----------------- */}
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
                Store Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage store outlets, contact information, operational Pune zones, and live status.
              </p>
            </div>
          </div>

          <Link
            to="/admin/franchises/add"
            className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition inline-flex items-center gap-1.5 self-start sm:self-auto shrink-0 cursor-pointer"
          >
            <span>+</span>
            <span>Register New Store</span>
          </Link>
        </div>

        {/* ----------------- SEARCH & TABLE CARD ----------------- */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Integrated Filter & Search Toolbar */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Box */}
            <div className="w-full sm:w-96 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search store name, area, or phone..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-[#2563eb] transition placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Filters & Count */}
            <div className="w-full sm:w-auto flex items-center gap-2.5 justify-end">
              {/* Zone Filter */}
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-[#2563eb]"
              >
                <option value="all">All Zones ({all.length})</option>
                {zones
                  .filter((z) => z !== "all")
                  .map((z) => (
                    <option key={z} value={z}>
                      {z} ({all.filter((f) => f.zone === z).length})
                    </option>
                  ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-[#2563eb]"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active ({all.filter((f) => f.active).length})</option>
                <option value="inactive">Inactive ({all.filter((f) => !f.active).length})</option>
              </select>

              <span className="hidden md:inline-block text-[11px] text-slate-400 font-medium pl-1">
                {list.length} {list.length === 1 ? "outlet" : "outlets"}
              </span>
            </div>
          </div>

          {/* Clean Enterprise Table */}
          {list.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No outlets found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 w-[40%]">Store Name</th>
                    <th className="py-3 px-4">Pune Zone</th>
                    <th className="py-3 px-4 w-[30%]">Contact Details</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {list.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. Store Name & Address */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-sm mt-0.5">
                          {f.address}
                        </div>
                      </td>

                      {/* 2. Pune Zone Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/70">
                          {f.zone || "Pune Central"}
                        </span>
                      </td>

                      {/* 3. Contact Details (Spacious, uncollapsed) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 border border-blue-100">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </span>
                          <div>
                            <a
                              href={`tel:${f.phone.replace(/\s+/g, "")}`}
                              className="text-slate-800 font-semibold font-mono text-xs hover:text-[#2563eb] transition tracking-tight block"
                            >
                              {f.phone}
                            </a>
                            {f.manager && (
                              <div className="text-[11px] text-slate-400 font-normal">
                                {f.manager}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 4. Status Toggle */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => toggleActive(f)}
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition ${f.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                            }`}
                          title="Click to toggle operational status"
                        >
                          {f.active ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* 6. Clean Actions (Live Link, Edit, Delete) */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Live Link Button */}
                          <a
                            href={getOutletUrl(f)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-200 text-slate-500 hover:text-[#2563eb] flex items-center justify-center transition shadow-2xs"
                            title="Open live outlet page"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>

                          {/* Edit Button */}
                          <Link
                            to={`/admin/franchises/edit/${f.id}`}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 hover:text-slate-900 flex items-center justify-center transition shadow-2xs"
                            title="Edit outlet details"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setConfirm(f)}
                            className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition shadow-2xs cursor-pointer"
                            title="Delete outlet"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          <div className="p-3 sm:px-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing {list.length} of {all.length} registered outlets across Pune</span>
            <span className="font-medium text-slate-500">Live operational data</span>
          </div>
        </div>
      </div>

      {/* ----------------- DELETE CONFIRMATION MODAL ----------------- */}
      {confirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setConfirm(null)}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-2xl text-center mb-2">⚠️</div>
            <h3 className="text-sm font-bold text-slate-900 text-center">Delete {confirm.name}?</h3>
            <p className="text-xs text-slate-500 text-center mt-1">
              This outlet will be permanently removed from the directory and map.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs"
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
