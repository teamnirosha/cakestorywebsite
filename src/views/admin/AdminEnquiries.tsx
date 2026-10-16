import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { enquiryService, franchiseService, FranchiseEnquiry } from "../../services/data";
import { useToast } from "../../components/common/Toast";
import { dumpAllLeadsToWebhook } from "../../services/webhook";
import LeadAnalyticsGraph from "../../components/admin/LeadAnalyticsGraph";

export default function AdminEnquiries() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<FranchiseEnquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<FranchiseEnquiry | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [, forceUpdate] = useState({});
  const { show } = useToast();

  const all = enquiryService.list();

  const handleSyncWebhook = async () => {
    if (filtered.length === 0) {
      show("No enquiries to sync", "warning");
      return;
    }
    setIsSyncing(true);
    show("Dumping lead data to n8n webhook...", "info");
    const result = await dumpAllLeadsToWebhook(filtered);
    setIsSyncing(false);
    if (result.sent > 0) {
      show(`Successfully dumped ${result.sent} leads to n8n webhook!`, "success");
    } else {
      show("Failed to dump leads to webhook. Check network or n8n workflow status.", "error");
    }
  };

  const filtered = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") {
      list = list.filter((e) => e.status === statusFilter);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (e) =>
          e.fullName.toLowerCase().includes(q) ||
          e.mobile.includes(q) ||
          e.cityArea.toLowerCase().includes(q) ||
          e.investmentReadiness.toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, statusFilter, query]);

  const handleStatusChange = (id: string, newStatus: FranchiseEnquiry["status"]) => {
    enquiryService.updateStatus(id, newStatus);
    forceUpdate({});
    show(`Enquiry status updated to ${newStatus}`, "success");
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    enquiryService.remove(confirmDelete.id);
    if (selectedEnquiry?.id === confirmDelete.id) setSelectedEnquiry(null);
    setConfirmDelete(null);
    forceUpdate({});
    show("Enquiry deleted", "info");
  };

  const exportCSV = () => {
    if (filtered.length === 0) {
      show("No enquiries to export", "warning");
      return;
    }
    const headers = ["ID", "Full Name", "Mobile Number", "City / Area", "Investment Readiness", "Source", "Submitted Date", "Status"];
    const rows = filtered.map((e) => [
      e.id,
      `"${e.fullName}"`,
      `"${e.mobile}"`,
      `"${e.cityArea}"`,
      `"${e.investmentReadiness}"`,
      `"${e.source || "Website Enquiry"}"`,
      `"${new Date(e.submittedAt).toLocaleString()}"`,
      e.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cakestory_franchise_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    show("CSV export generated successfully", "success");
  };

  return (
    <AdminLayout title="">
      <div className="space-y-4">

        {/* ----------------- TOP LEAD MANAGEMENT CARD ----------------- */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 border border-blue-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Lead Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage prospective franchise applications, customer inquiries, and automated webhook pipelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <button
              onClick={handleSyncWebhook}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <span>⚡</span>
              <span>{isSyncing ? "Syncing..." : "Sync n8n"}</span>
            </button>
            <button
              onClick={exportCSV}
              className="px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* ----------------- DYNAMIC LEADS ANALYTICS GRAPH ----------------- */}
        <LeadAnalyticsGraph totalOutlets={franchiseService.list().length} enquiries={all} />

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
                placeholder="Search by name, mobile, or area..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:border-[#2563eb] transition placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Status Filter & Count */}
            <div className="w-full sm:w-auto flex items-center gap-2.5 justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium cursor-pointer focus:outline-none focus:border-[#2563eb]"
              >
                <option value="all">All Statuses ({all.length})</option>
                <option value="new">New ({all.filter((e) => e.status === "new").length})</option>
                <option value="contacted">Contacted ({all.filter((e) => e.status === "contacted").length})</option>
                <option value="qualified">Qualified ({all.filter((e) => e.status === "qualified").length})</option>
                <option value="closed">Closed ({all.filter((e) => e.status === "closed").length})</option>
              </select>

              <span className="hidden md:inline-block text-[11px] text-slate-400 font-medium pl-1">
                {filtered.length} {filtered.length === 1 ? "lead" : "leads"}
              </span>
            </div>
          </div>

          {/* Clean Enterprise Table */}
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              No leads found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Applicant & Contact</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Readiness</th>
                    <th className="py-2.5 px-3">Channel / Source</th>
                    <th className="py-2.5 px-3">Submitted</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((e) => {
                    const dateStr = new Date(e.submittedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    });

                    return (
                      <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 1. Applicant & Mobile */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {e.fullName}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                            {e.mobile}
                          </div>
                        </td>

                        {/* 2. Location */}
                        <td className="py-3 px-3">
                          <span className="text-slate-800 font-medium text-xs">
                            {e.cityArea}
                          </span>
                        </td>

                        {/* 3. Investment Readiness */}
                        <td className="py-3 px-3">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {e.investmentReadiness}
                          </span>
                        </td>

                        {/* 4. Channel / Source */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${e.source?.includes("On-Page Contact") || e.source?.includes("Contact Form")
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : e.source?.includes("General Contact")
                                  ? "bg-blue-50 text-blue-800 border-blue-200"
                                  : "bg-pink-50 text-pink-800 border-pink-200"
                              }`}
                          >
                            {e.source?.includes("On-Page Contact")
                              ? "On-Page Contact"
                              : e.source?.includes("General Contact")
                                ? "Corporate Form"
                                : "Enquiry Modal"}
                          </span>
                        </td>

                        {/* 5. Submitted Date */}
                        <td className="py-3 px-3 text-[11px] text-slate-500 whitespace-nowrap">
                          {dateStr}
                        </td>

                        {/* 6. Status Selector */}
                        <td className="py-3 px-3">
                          <select
                            value={e.status}
                            onChange={(evt) =>
                              handleStatusChange(e.id, evt.target.value as FranchiseEnquiry["status"])
                            }
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${e.status === "new"
                                ? "bg-pink-50 text-pink-700 border-pink-300"
                                : e.status === "contacted"
                                  ? "bg-blue-50 text-blue-700 border-blue-300"
                                  : e.status === "qualified"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                                    : "bg-slate-100 text-slate-600 border-slate-300"
                              }`}
                          >
                            <option value="new">● New</option>
                            <option value="contacted">● Contacted</option>
                            <option value="qualified">● Qualified</option>
                            <option value="closed">● Closed</option>
                          </select>
                        </td>

                        {/* 7. Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedEnquiry(e)}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 mr-3 cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => setConfirmDelete(e)}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Lead Table Footer */}
          <div className="p-3 sm:px-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Showing {filtered.length} of {all.length} total enquiries & partner leads</span>
            <span className="font-medium text-slate-500">Auto-synced</span>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-xl border border-slate-200"
            onClick={(evt) => evt.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Enquiry Details</h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Applicant Name</span>
                <div className="font-bold text-slate-900 text-sm">{selectedEnquiry.fullName}</div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Mobile Number</span>
                <div className="font-bold font-mono text-[#2563eb] text-sm">
                  <a href={`tel:${selectedEnquiry.mobile}`}>{selectedEnquiry.mobile}</a>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">City / Preferred Area</span>
                <div className="font-medium text-slate-800">{selectedEnquiry.cityArea}</div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Investment Readiness</span>
                <div className="font-medium text-slate-800 bg-slate-50 border border-slate-200/80 p-2 rounded-lg mt-0.5">
                  {selectedEnquiry.investmentReadiness}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Lead Source</span>
                <div className="font-medium text-slate-700 bg-slate-50 border border-slate-200/80 p-2 rounded-lg mt-0.5">
                  {selectedEnquiry.source || "CakeStory Website — Franchise Enquiry Modal"}
                </div>
              </div>

              {selectedEnquiry.email && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Email</span>
                  <div className="font-medium text-slate-800">{selectedEnquiry.email}</div>
                </div>
              )}

              {selectedEnquiry.notes && (
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Message</span>
                  <div className="text-slate-700 bg-slate-50 border border-slate-200/80 p-2 rounded-lg whitespace-pre-wrap mt-0.5">
                    {selectedEnquiry.notes}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Submitted At</span>
                <div className="text-slate-600">
                  {new Date(selectedEnquiry.submittedAt).toLocaleString()}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Update Status</span>
                <div className="flex gap-1.5 mt-1.5">
                  {(["new", "contacted", "qualified", "closed"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                      className={`text-[11px] px-2.5 py-1 rounded-full font-semibold capitalize transition ${selectedEnquiry.status === st
                          ? "bg-[#2563eb] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-full py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-xl border border-slate-200 text-center"
            onClick={(evt) => evt.stopPropagation()}
          >
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="font-bold text-base text-slate-900">Delete Enquiry?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Delete enquiry from <span className="font-semibold text-slate-800">{confirmDelete.fullName}</span>?
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-1.5 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
