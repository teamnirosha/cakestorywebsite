import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { authService, franchiseService, enquiryService, contentService } from "../../services/data";
import { useToast } from "../../components/common/Toast";

type SettingsTab = "security" | "data";

export default function AdminSettings({ defaultTab = "security" }: { defaultTab?: SettingsTab }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlTab = searchParams.get("tab") as SettingsTab | null;
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    urlTab === "data" ? "data" : defaultTab
  );

  const navigate = useNavigate();
  const { show } = useToast();

  const user = authService.current();
  const creds = authService.getCredentials();
  const isInitial = authService.isInitialCredentials();
  const franchises = franchiseService.list();
  const enquiries = enquiryService.list();

  // Tab change handler
  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Username form state
  const [newUsername, setNewUsername] = useState("");
  const [confirmUsername, setConfirmUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    if (!newPassword) return null;
    if (newPassword.length < 6) return { label: "Weak", color: "text-rose-500 bg-rose-50 border-rose-200" };
    const hasNum = /\d/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
    const hasUpper = /[A-Z]/.test(newPassword);

    if (newPassword.length >= 8 && hasNum && (hasSpecial || hasUpper)) {
      return { label: "Strong", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    }
    return { label: "Fair", color: "text-amber-600 bg-amber-50 border-amber-200" };
  }, [newPassword]);

  const handleUpdateUsername = (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError("");

    if (!newUsername.trim()) {
      setUsernameError("Please enter a new username.");
      return;
    }
    if (newUsername.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters long.");
      return;
    }
    if (newUsername.trim() !== confirmUsername.trim()) {
      setUsernameError("New username and confirmation do not match.");
      return;
    }
    if (newUsername.trim().toLowerCase() === creds.username.toLowerCase()) {
      setUsernameError("New username must be different from current username.");
      return;
    }

    setUsernameLoading(true);
    setTimeout(() => {
      const res = authService.changeUsername(newUsername.trim());
      setUsernameLoading(false);

      if (res.success) {
        show("Username updated successfully. Please sign in with your new username.", "success");
        navigate("/admin/login");
      } else {
        setUsernameError(res.error || "Failed to update username.");
      }
    }, 400);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (!currentPassword) {
      setPasswordError("Current password is required.");
      return;
    }
    if (!authService.verifyCurrentPassword(currentPassword)) {
      setPasswordError("Current password is incorrect.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError("New password must be different from your current password.");
      return;
    }

    setPasswordLoading(true);
    setTimeout(() => {
      const res = authService.changePassword(currentPassword, newPassword);
      setPasswordLoading(false);

      if (res.success) {
        show("Password changed successfully. Please sign in with your new password.", "success");
        navigate("/admin/login");
      } else {
        setPasswordError(res.error || "Failed to change password.");
      }
    }, 400);
  };

  const handleExportSnapshot = () => {
    const site = contentService.get();
    const snapshot = {
      exportDate: new Date().toISOString(),
      system: "CakeStory ERP v2.4 (Enterprise)",
      brand: site.brand || {},
      outletsCount: franchises.length,
      enquiriesCount: enquiries.length,
      outlets: franchises,
      enquiries: enquiries,
    };
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cakestory-erp-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    show("System snapshot exported successfully", "success");
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

          <span className="text-slate-400">&gt;</span>
          <span className="text-[#2563eb] font-semibold tracking-wide uppercase">
            Settings & Preferences
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
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                System Settings & Preferences
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure administrator authentication credentials, access passwords, and operational system diagnostics.
              </p>
            </div>
          </div>


        </div>

        {/* ----------------- ENTERPRISE TAB SWITCHER ----------------- */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => handleTabChange("security")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${activeTab === "security"
              ? "bg-white text-[#2563eb] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <span>🔒</span>
            <span>Security & Credentials</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("data")}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2 ${activeTab === "data"
              ? "bg-white text-[#2563eb] shadow-xs"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <span>🗄️</span>
            <span>Database & Storage</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: SECURITY & CREDENTIALS                                 */}
        {/* ============================================================== */}
        {activeTab === "security" && (
          <div className="space-y-4">
            {/* Initial Credentials Callout */}
            {isInitial && (
              <div className="rounded-xl p-4 bg-amber-50 border border-amber-200 text-amber-900 shadow-xs flex items-start gap-3">
                <span className="text-lg shrink-0">⚠️</span>
                <div>
                  <div className="font-bold text-xs text-amber-950 mb-0.5">Initial Setup Credentials Active</div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Your admin account is currently using initial setup credentials (<code>admin</code> / <code>admin123</code>). For operational security, update your personal username and password below.
                  </p>
                </div>
              </div>
            )}

            {/* Section 1: Username & Identity */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Administrator Identity & Login Username
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Authentication</span>
              </div>

              <div className="p-5">
                <form onSubmit={handleUpdateUsername} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Current Active Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={creds.username}
                        className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-100/80 font-mono font-bold text-slate-700 cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-medium">
                        🔒 Verified
                      </span>
                    </div>
                  </div>

                  {usernameError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      ⚠️ {usernameError}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        New Username <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => {
                          setNewUsername(e.target.value);
                          if (usernameError) setUsernameError("");
                        }}
                        placeholder="e.g. admin.cakestory"
                        className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Confirm New Username <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={confirmUsername}
                        onChange={(e) => {
                          setConfirmUsername(e.target.value);
                          if (usernameError) setUsernameError("");
                        }}
                        placeholder="Re-enter new username"
                        className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={usernameLoading || !newUsername.trim()}
                      className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {usernameLoading ? "Updating Username..." : "Update Username"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Section 2: Password & Access */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Security & Access Password
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs font-semibold text-[#2563eb] hover:underline cursor-pointer"
                >
                  {showPasswords ? "Hide Passwords" : "Show Passwords"}
                </button>
              </div>

              <div className="p-5">
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {passwordError && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      ⚠️ {passwordError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Current Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      placeholder="Enter current password to verify"
                      className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          New Password <span className="text-rose-500">*</span>
                        </label>
                        {passwordStrength && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${passwordStrength.color}`}>
                            Strength: {passwordStrength.label}
                          </span>
                        )}
                      </div>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (passwordError) setPasswordError("");
                        }}
                        placeholder="Min 6 characters"
                        className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                        required
                        autoComplete="new-password"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Confirm New Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (passwordError) setPasswordError("");
                        }}
                        placeholder="Re-enter new password"
                        className="w-full text-xs px-3.5 py-2 rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#2563eb] transition text-slate-800"
                        required
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-400">
                      🔒 Changing your password will require signing in again with the new credentials.
                    </span>
                    <button
                      type="submit"
                      disabled={passwordLoading || !currentPassword || !newPassword}
                      className="px-5 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer disabled:opacity-50 self-end sm:self-auto"
                    >
                      {passwordLoading ? "Updating..." : "Change Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Section 3: Session & Access Overview */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Operational Session & Access Control
                  </h2>
                </div>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                  Live Session
                </span>
              </div>
              <div className="p-5 space-y-2.5 text-xs">
                <Row label="Account Officer" value={user?.name || "CakeStory Operations Lead"} />
                <Row label="Active Username" value={user?.username || "admin"} />
                <Row label="Assigned Role" value={user?.role?.toUpperCase() || "SUPER ADMIN"} />
                <Row label="Access Permissions" value="Full Authority: Outlets Network, Lead Management, CMS" />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: DATABASE & STORAGE                                     */}
        {/* ============================================================== */}
        {activeTab === "data" && (
          <div className="space-y-4">
            {/* Section 1: Storage Diagnostics */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Local Application Database Diagnostics
                  </h2>
                </div>
                <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                  Healthy
                </span>
              </div>
              <div className="p-5 space-y-2.5 text-xs">
                <Row label="Storage Technology" value="HTML5 Web Storage (High-Speed Local Sync)" />
                <Row label="Outlet Records Stored" value={`${franchises.length} Stores in Directory`} />
                <Row label="Enquiries Stored" value={`${enquiries.length} Franchise Applications`} />
                <Row label="Client Environment" value="Browser-level Offline-Ready ERP Cache" />
              </div>
            </div>

            {/* Section 2: Backup Snapshot Export */}
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-[#2563eb] text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Data Portability & ERP Snapshot Export
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">JSON Backup</span>
              </div>
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Download Complete System Snapshot</h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
                    Export a structured JSON snapshot of all Pune franchise outlets, incoming candidate applications, and current configuration settings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportSnapshot}
                  className="px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export ERP Snapshot (JSON)</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50/70 border border-slate-100">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-semibold text-slate-800 font-mono text-[11px]">{value}</span>
    </div>
  );
}
