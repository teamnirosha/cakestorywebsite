import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { franchiseService, enquiryService } from "../../services/data";

export default function AdminDashboard() {
  const allOutlets = franchiseService.list();
  const totalOutlets = allOutlets.length;
  const activeOutlets = franchiseService.countActive();
  const inactiveOutlets = totalOutlets - activeOutlets;

  const allEnquiries = enquiryService.list();
  const totalEnquiries = allEnquiries.length;
  const newEnquiries = enquiryService.countNew();
  const contactedEnquiries = allEnquiries.filter((e) => e.status === "contacted").length;
  const qualifiedEnquiries = allEnquiries.filter((e) => e.status === "qualified").length;

  const recentFranchises = allOutlets.slice(0, 5);
  const recentEnquiries = allEnquiries.slice(0, 6);

  // Pune Zones calculation from actual data
  const puneZones = [
    { name: "West Pune", desc: "Baner, Kothrud, Hinjewadi" },
    { name: "South Pune", desc: "Kondhwa, Bibwewadi" },
    { name: "East Pune", desc: "Viman Nagar, Kalyani Nagar, Kharadi" },
    { name: "PCMC", desc: "Wakad, Pimple Saudagar, Chinchwad" },
    { name: "Satara", desc: "Regional Gateway" },
  ];

  const zoneCounts = puneZones.map((z) => {
    const count = allOutlets.filter((o) => o.zone === z.name).length;
    const activeInZone = allOutlets.filter((o) => o.zone === z.name && o.active).length;
    return { ...z, count, activeInZone };
  });

  return (
    <AdminLayout
      title="Operations & Franchise Overview"
      subtitle="Real-time status of CakeStory Desserts Pune outlets and franchise pipeline."
    >
      {/* 4 Core ERP KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Outlets</span>
            <span className="text-base p-1.5 rounded-md bg-blue-50 text-blue-600">🏪</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-display">{totalOutlets}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-emerald-600 font-semibold">{activeOutlets} Active</span>
            <span>•</span>
            <span>{inactiveOutlets} Inactive</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Outlets</span>
            <span className="text-base p-1.5 rounded-md bg-emerald-50 text-emerald-600">✅</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-display">{activeOutlets}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {puneZones.length} designated operational zones
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Enquiries</span>
            <span className="text-base p-1.5 rounded-md bg-purple-50 text-purple-600">📋</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2 font-display">{totalEnquiries}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            <span>{contactedEnquiries} Contacted</span> • <span>{qualifiedEnquiries} Qualified</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Enquiries</span>
            <span className="text-base p-1.5 rounded-md bg-amber-50 text-amber-600">⚡</span>
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2 font-display">{newEnquiries}</div>
          <div className="text-[11px] text-slate-500 mt-1">Pending first 24h follow-up</div>
        </div>
      </div>

      {/* Outlets by Pune Zone breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 font-display">Outlets by Pune Zone</h2>
            <p className="text-xs text-slate-500">Coverage across Pune Metropolitan Region and regional corridors</p>
          </div>
          <Link
            to="/admin/franchises"
            className="text-xs font-semibold text-pink-600 hover:text-pink-700 transition"
          >
            Manage Outlets Directory →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {zoneCounts.map((z) => {
            const pct = totalOutlets > 0 ? Math.round((z.count / totalOutlets) * 100) : 0;
            return (
              <div key={z.name} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-bold text-slate-900">{z.name}</div>
                  <span className="text-xs font-bold text-pink-600 font-display">{z.count}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mb-2">{z.desc}</div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-pink-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(pct, 10)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
                  <span>{z.activeInZone} Active</span>
                  <span>{pct}% share</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Recent Outlets & Recent Franchise Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Outlets */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">Recent Outlet Additions</h2>
              <p className="text-xs text-slate-500">Live franchise locations on the public map</p>
            </div>
            <Link to="/admin/franchises/add" className="text-xs text-pink-600 hover:underline font-semibold">
              + New Outlet
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentFranchises.map((f) => (
              <div key={f.id} className="p-3.5 hover:bg-slate-50/80 transition flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center text-sm shrink-0">
                  🏪
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">{f.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                      {f.zone}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{f.address}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      f.active ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
                    }`}
                  >
                    {f.active ? "Operational" : "Closed"}
                  </span>
                  <a
                    href={`/outlets/${f.slug || f.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-pink-600 p-1"
                    title="Open Outlet Page in New Tab"
                  >
                    ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Franchise Enquiries */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-display">Recent Franchise Leads</h2>
              <p className="text-xs text-slate-500">Partner applications via 4-field enquiry modal</p>
            </div>
            <Link to="/admin/enquiries" className="text-xs text-pink-600 hover:underline font-semibold">
              View All ({totalEnquiries}) →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentEnquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No enquiries recorded yet.</div>
            ) : (
              recentEnquiries.map((e) => (
                <div key={e.id} className="p-3.5 hover:bg-slate-50/80 transition flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">{e.fullName}</span>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          e.status === "new"
                            ? "bg-amber-100 text-amber-800"
                            : e.status === "contacted"
                            ? "bg-blue-100 text-blue-800"
                            : e.status === "qualified"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {e.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      📞 {e.mobile} • 📍 {e.cityArea}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Readiness: <span className="text-slate-600 font-medium">{e.investmentReadiness}</span>
                    </div>
                  </div>

                  <Link
                    to="/admin/enquiries"
                    className="text-xs text-slate-500 hover:text-pink-600 font-semibold flex-shrink-0 px-2.5 py-1.5 rounded bg-slate-50 border border-slate-200"
                  >
                    Manage
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
