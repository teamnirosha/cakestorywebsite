import { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { franchiseService, enquiryService, FranchiseEnquiry } from "../../services/data";
import { useToast } from "../../components/common/Toast";
import LeadAnalyticsGraph from "../../components/admin/LeadAnalyticsGraph";

export default function AdminDashboard() {
  const [, setRefreshKey] = useState(0);
  const { show } = useToast();

  const allOutlets = franchiseService.list();
  const totalOutlets = allOutlets.length;
  const activeOutlets = franchiseService.countActive();

  const allEnquiries = enquiryService.list();
  const totalEnquiries = allEnquiries.length;
  const newEnquiries = enquiryService.countNew();
  const contactedEnquiries = allEnquiries.filter((e) => e.status === "contacted").length;
  const qualifiedEnquiries = allEnquiries.filter((e) => e.status === "qualified").length;

  const recentEnquiries = allEnquiries.slice(0, 5);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    show("ERP Dashboard synced with latest database records", "success");
  };

  const handleStatusChange = (id: string, newStatus: FranchiseEnquiry["status"]) => {
    enquiryService.updateStatus(id, newStatus);
    setRefreshKey((prev) => prev + 1);
    show(`Lead status updated to ${newStatus}`, "success");
  };

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
    <AdminLayout title="">
      <div className="space-y-6">
        {/* ----------------- TOP ERP DASHBOARD HEADER ----------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Welcome back, <span className="font-semibold text-slate-700">ADMIN</span>.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Refresh Data Button */}
            <button
              onClick={handleRefresh}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Refresh Data</span>
            </button>

            {/* Add Outlet Primary Action */}
            <Link
              to="/admin/franchises/add"
              className="px-3.5 py-2 rounded-xl bg-[#ff5c97] hover:bg-[#e63273] text-white text-xs font-medium shadow-xs hover:shadow-md transition flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Add Outlet</span>
            </Link>
          </div>
        </div>

        {/* ----------------- BIG VISUAL ANALYTICS CARD (ERP STYLE) ----------------- */}
        <LeadAnalyticsGraph totalOutlets={totalOutlets} enquiries={allEnquiries} />

        {/* ----------------- 4 HORIZONTAL ERP METRIC CARDS (ACCENT BORDER STYLE) ----------------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Today's Status (Blue Accent) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-blue-500 rounded-l" />
            <div className="flex items-center justify-between pl-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TODAY'S ACTIVITY
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                📈
              </div>
            </div>
            <div className="pl-2 mt-3">
              <div className="text-xl font-bold text-slate-900">
                100% Synced
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                All {totalOutlets} Pune outlets live
              </p>
            </div>
          </div>

          {/* Card 2: Active Stores (Green Accent) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-emerald-500 rounded-l" />
            <div className="flex items-center justify-between pl-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                ACTIVE OUTLETS
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                🏪
              </div>
            </div>
            <div className="pl-2 mt-3">
              <div className="text-xl font-bold text-slate-900">
                {activeOutlets} / {totalOutlets}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Across 5 designated Pune zones
              </p>
            </div>
          </div>

          {/* Card 3: Total Enquiries (Teal Accent) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-teal-500 rounded-l" />
            <div className="flex items-center justify-between pl-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                TOTAL LEADS
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                📋
              </div>
            </div>
            <div className="pl-2 mt-3">
              <div className="text-xl font-bold text-slate-900">
                {totalEnquiries}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {contactedEnquiries} Contacted • {qualifiedEnquiries} Qualified
              </p>
            </div>
          </div>

          {/* Card 4: New Pending Follow-ups (Purple Accent) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-purple-500 rounded-l" />
            <div className="flex items-center justify-between pl-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                PENDING FOLLOW-UPS
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
            </div>
            <div className="pl-2 mt-3">
              <div className="text-xl font-bold text-purple-600">
                {newEnquiries}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pending initial 24h response
              </p>
            </div>
          </div>
        </div>

        {/* ----------------- LOWER TWO-COLUMN ERP MANAGEMENT SECTION ----------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Outlets Network Zone Coverage (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Outlets by Pune Zone
                  </h2>
                  <p className="text-xs text-slate-500">Coverage across Pune Metropolitan Region</p>
                </div>
                <Link
                  to="/admin/franchises"
                  className="text-xs font-bold text-[#ff5c97] hover:underline"
                >
                  Manage Outlets →
                </Link>
              </div>

              <div className="space-y-4">
                {zoneCounts.map((z) => {
                  const pct = totalOutlets > 0 ? Math.round((z.count / totalOutlets) * 100) : 0;
                  return (
                    <div key={z.name} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-slate-800">{z.name}</span>
                        <span className="text-[#ff5c97] font-mono">{z.count} Outlets</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mb-2">{z.desc}</div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#ff5c97] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(pct, 12)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1.5 flex justify-between">
                        <span>{z.activeInZone} Operational</span>
                        <span>{pct}% share</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Total Operational Reach</span>
              <span className="font-bold text-emerald-600">
                {activeOutlets} of {totalOutlets} Outlets Live
              </span>
            </div>
          </div>

          {/* Recent Franchise Inquiries (7 cols on lg) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Recent Franchise Leads
                  </h2>
                  <p className="text-xs text-slate-500">Live applications from modal & contact forms</p>
                </div>
                <Link
                  to="/admin/enquiries"
                  className="text-xs font-bold text-[#ff5c97] hover:underline"
                >
                  View All ({totalEnquiries}) →
                </Link>
              </div>

              {recentEnquiries.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No franchise leads found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-400">
                        <th className="pb-2.5">Applicant</th>
                        <th className="pb-2.5">Location</th>
                        <th className="pb-2.5">Channel</th>
                        <th className="pb-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3">
                            <div className="font-bold text-slate-900">{e.fullName}</div>
                            <div className="text-[11px] text-[#ff5c97] font-medium font-mono">
                              {e.mobile}
                            </div>
                          </td>
                          <td className="py-3 text-slate-600 font-medium">
                            <div>{e.cityArea}</div>
                            <div className="text-[10px] text-slate-400">{e.investmentReadiness}</div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                e.source?.includes("On-Page Contact")
                                  ? "bg-amber-100 text-amber-800"
                                  : e.source?.includes("General Contact")
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {e.source?.includes("On-Page Contact")
                                ? "On-Page"
                                : e.source?.includes("General Contact")
                                ? "Corporate"
                                : "Modal"}
                            </span>
                          </td>
                          <td className="py-3">
                            <select
                              value={e.status}
                              onChange={(evt) =>
                                handleStatusChange(e.id, evt.target.value as FranchiseEnquiry["status"])
                              }
                              className={`text-[10px] font-bold px-2 py-1 rounded-full border cursor-pointer ${
                                e.status === "new"
                                  ? "bg-pink-100 text-pink-700 border-pink-300"
                                  : e.status === "contacted"
                                  ? "bg-blue-100 text-blue-700 border-blue-300"
                                  : e.status === "qualified"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                  : "bg-slate-100 text-slate-600 border-slate-300"
                              }`}
                            >
                              <option value="new">● New</option>
                              <option value="contacted">● Contacted</option>
                              <option value="qualified">● Qualified</option>
                              <option value="closed">● Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">n8n Webhook Sync</span>
              <Link
                to="/admin/enquiries"
                className="text-xs font-semibold text-slate-700 hover:text-[#ff5c97] transition flex items-center gap-1"
              >
                <span>Automated Workflow Active ⚡</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
