import { useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { enquiryService, FranchiseEnquiry } from "../../services/data";
import { useToast } from "../../components/common/Toast";
import { EmptyState } from "../../components/common/Loading";
import { dumpAllLeadsToWebhook } from "../../services/webhook";

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
    const headers = ["ID", "Full Name", "Mobile Number", "City / Area", "Investment Readiness", "Submitted Date", "Status"];
    const rows = filtered.map((e) => [
      e.id,
      `"${e.fullName}"`,
      `"${e.mobile}"`,
      `"${e.cityArea}"`,
      `"${e.investmentReadiness}"`,
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
    <AdminLayout
      title="Franchise Leads Pipeline"
      subtitle="Manage prospective CakeStory Desserts Pune franchise partner leads and initial phone conversations."
    >
      {/* Top Filter Bar */}
      <div className="glass rounded-3xl p-4 mb-5 flex flex-col md:flex-row gap-3 bg-white/80 border border-white">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by full name, mobile, city / area..."
            className="input-field pl-11"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field md:w-48 cursor-pointer font-medium"
        >
          <option value="all">All Statuses ({all.length})</option>
          <option value="new">New ({all.filter((e) => e.status === "new").length})</option>
          <option value="contacted">Contacted ({all.filter((e) => e.status === "contacted").length})</option>
          <option value="qualified">Qualified ({all.filter((e) => e.status === "qualified").length})</option>
          <option value="closed">Closed ({all.filter((e) => e.status === "closed").length})</option>
        </select>

        <button onClick={handleSyncWebhook} disabled={isSyncing} className="btn-primary text-xs font-semibold whitespace-nowrap !py-2.5 !px-4 shadow-sm">
          {isSyncing ? "Syncing..." : "⚡ Dump to n8n Webhook"}
        </button>
        <button onClick={exportCSV} className="btn-ghost text-xs font-semibold whitespace-nowrap">
          📥 Export CSV
        </button>
      </div>

      {/* Enquiries Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No franchise enquiries found"
          description="There are currently no partner submissions matching your search criteria."
        />
      ) : (
        <div className="glass rounded-3xl overflow-hidden bg-white/80 shadow-lg border border-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-100/80 text-[10px] uppercase tracking-wider text-[#5a4a5e] font-bold border-b border-slate-200">
                  <th className="px-4 py-3.5">Full Name</th>
                  <th className="px-4 py-3.5">Mobile Number</th>
                  <th className="px-4 py-3.5">City / Area</th>
                  <th className="px-4 py-3.5">Investment Readiness</th>
                  <th className="px-4 py-3.5">Submitted Date/Time</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
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
                    <tr key={e.id} className="hover:bg-white/60 transition">
                      <td className="px-4 py-3.5 font-bold text-[#2a1d2e]">{e.fullName}</td>
                      <td className="px-4 py-3.5 text-[#5a4a5e] font-medium">{e.mobile}</td>
                      <td className="px-4 py-3.5 text-[#2a1d2e] font-medium">{e.cityArea}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                          {e.investmentReadiness}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#5a4a5e]">{dateStr}</td>
                      <td className="px-4 py-3.5">
                        <select
                          value={e.status}
                          onChange={(evt) => handleStatusChange(e.id, evt.target.value as FranchiseEnquiry["status"])}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer ${
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
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedEnquiry(e)}
                          className="text-xs font-semibold text-[#6fa8f5] hover:underline mr-3"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setConfirmDelete(e)}
                          className="text-xs font-semibold text-rose-500 hover:underline"
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
        </div>
      )}

      {/* Details Modal */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="glass rounded-3xl p-6 max-w-md w-full bg-white shadow-2xl border border-white"
            onClick={(evt) => evt.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-xl text-[#2a1d2e]">Enquiry Details</h3>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs font-semibold text-[#5a4a5e]">1. Full Name</span>
                <div className="font-bold text-[#2a1d2e] text-base">{selectedEnquiry.fullName}</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#5a4a5e]">2. Mobile Number</span>
                <div className="font-bold text-[#ff5c97] text-base">
                  <a href={`tel:${selectedEnquiry.mobile}`}>{selectedEnquiry.mobile}</a>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#5a4a5e]">3. City / Area</span>
                <div className="font-bold text-[#2a1d2e]">{selectedEnquiry.cityArea}</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#5a4a5e]">4. Investment Readiness</span>
                <div className="font-semibold text-slate-800 bg-pink-50 p-2 rounded-xl mt-0.5">
                  {selectedEnquiry.investmentReadiness}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-semibold text-[#5a4a5e]">Submitted On</span>
                <div className="text-xs text-slate-700">
                  {new Date(selectedEnquiry.submittedAt).toLocaleString()}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#5a4a5e]">Manage Status</span>
                <div className="flex gap-2 mt-1">
                  {(["new", "contacted", "qualified", "closed"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedEnquiry.id, st)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold capitalize transition ${
                        selectedEnquiry.status === st
                          ? "bg-[#ff5c97] text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button onClick={() => setSelectedEnquiry(null)} className="btn-ghost w-full text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="glass rounded-3xl p-6 max-w-sm w-full bg-white shadow-2xl text-center"
            onClick={(evt) => evt.stopPropagation()}
          >
            <div className="text-4xl mb-2">⚠️</div>
            <h3 className="font-display font-bold text-xl text-[#2a1d2e]">Delete Enquiry?</h3>
            <p className="text-xs text-[#5a4a5e] mt-1">
              Delete enquiry from <b>{confirmDelete.fullName}</b>?
            </p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost flex-1 text-xs font-bold">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 px-4 rounded-full bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 shadow-md"
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
