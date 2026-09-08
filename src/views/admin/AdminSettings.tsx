import AdminLayout from "../../components/admin/AdminLayout";
import { authService, franchiseService, contentService } from "../../services/data";
import { useToast } from "../../components/common/Toast";

export default function AdminSettings() {
  const user = authService.current();
  const { show } = useToast();
  const site = contentService.get();

  const resetData = () => {
    if (confirm("Reset all franchise data to seed defaults? This will clear any custom additions.")) {
      franchiseService.resetSeed();
      show("Franchise data reset to defaults", "info");
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage your account and application preferences.">
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-3xl p-5">
          <h3 className="font-display text-lg text-[#2a1d2e] mb-3">Account</h3>
          <div className="space-y-3 text-sm">
            <Row label="Name" value={user?.name || "Admin"} />
            <Row label="Email" value={user?.email || "admin@cakestory.com"} />
            <Row label="Role" value={user?.role || "admin"} />
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="font-display text-lg text-[#2a1d2e] mb-3">Brand & Location</h3>
          <div className="space-y-3 text-sm">
            <Row label="Brand" value={site.brand?.name || "CakeStory Desserts"} />
            <Row label="Location" value={`${site.brand?.city || "Pune"}, ${site.brand?.state || "Maharashtra"}`} />
            <Row label="Established" value={site.brand?.established || "2020"} />
          </div>
        </div>

        <div className="glass rounded-3xl p-5 lg:col-span-2">
          <h3 className="font-display text-lg text-[#2a1d2e] mb-3">Data Management</h3>
          <p className="text-sm text-[#5a4a5e] mb-3">All runtime data is stored in your browser's localStorage. You can reset to seed defaults at any time.</p>
          <div className="flex flex-wrap gap-3">
            <button onClick={resetData} className="px-4 py-2 rounded-full bg-rose-100 text-rose-600 text-sm font-semibold hover:bg-rose-200">
              Reset Franchise Data
            </button>
            <button
              onClick={() => {
                contentService.resetSeed();
                show("Home content reset to defaults", "info");
                setTimeout(() => window.location.reload(), 800);
              }}
              className="px-4 py-2 rounded-full bg-pink-100 text-pink-700 text-sm font-semibold hover:bg-pink-200"
            >
              Reset Home Hero & Content
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between glass-soft rounded-2xl px-3 py-2">
      <span className="text-[#5a4a5e]">{label}</span>
      <span className="font-semibold text-[#2a1d2e]">{value}</span>
    </div>
  );
}
