import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { authService } from "../../services/data";
import { useToast } from "../../components/common/Toast";

export default function AdminAccount() {
  const navigate = useNavigate();
  const { show } = useToast();

  const creds = authService.getCredentials();
  const isInitial = authService.isInitialCredentials();

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

  return (
    <AdminLayout
      title="Account & Security Settings"
      subtitle="Manage administrator authentication credentials, access credentials, and security parameters."
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Initial Credentials Warning Callout */}
        {isInitial && (
          <div className="glass rounded-2xl p-4 sm:p-5 bg-amber-500/10 border border-amber-500/30 text-amber-900 shadow-sm flex items-start gap-3">
            <span className="text-xl shrink-0">⚠️</span>
            <div>
              <div className="font-bold text-sm text-amber-950 mb-0.5">
                Initial Credentials Active
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Your admin account is currently using the initial setup username (<code className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-bold">{creds.username}</code>). For enhanced operational security, update your username and password below.
              </p>
            </div>
          </div>
        )}

        {/* 1. Account Summary & Username Update */}
        <div className="glass rounded-3xl p-6 sm:p-8 bg-white/90 border border-white shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200/80">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">Administrator Profile</h2>
              <p className="text-xs text-slate-500">View and update login username</p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Role: Super Admin</span>
            </div>
          </div>

          <form onSubmit={handleUpdateUsername} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Username</label>
              <input
                type="text"
                readOnly
                value={creds.username}
                className="input-field bg-slate-100/80 font-mono font-bold text-slate-800 cursor-not-allowed"
              />
            </div>

            {usernameError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                ⚠️ {usernameError}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => {
                    setNewUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  placeholder="e.g. admin.cakestory"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Username</label>
                <input
                  type="text"
                  value={confirmUsername}
                  onChange={(e) => {
                    setConfirmUsername(e.target.value);
                    if (usernameError) setUsernameError("");
                  }}
                  placeholder="Re-enter new username"
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={usernameLoading || !newUsername.trim()}
                className="btn-primary !py-2.5 !px-6 text-xs font-bold shadow-md disabled:opacity-50"
              >
                {usernameLoading ? "Updating Username..." : "Update Username →"}
              </button>
            </div>
          </form>
        </div>

        {/* 2. Change Password Section */}
        <div className="glass rounded-3xl p-6 sm:p-8 bg-white/90 border border-white shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">Security & Password</h2>
              <p className="text-xs text-slate-500">Update access password (requires current password verification)</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswords(!showPasswords)}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 transition"
            >
              {showPasswords ? "👁️‍🗨️ Hide Passwords" : "👁️ Show Passwords"}
            </button>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                ⚠️ {passwordError}
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Current Access Password</label>
              <input
                type={showPasswords ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="Enter current password to verify"
                className="input-field"
                required
                autoComplete="current-password"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">New Password</label>
                  {passwordStrength && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${passwordStrength.color}`}>
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
                  className="input-field"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordError) setPasswordError("");
                  }}
                  placeholder="Re-enter new password"
                  className="input-field"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                🔒 Submitting will invalidate your current session and require re-login.
              </span>
              <button
                type="submit"
                disabled={passwordLoading || !currentPassword || !newPassword}
                className="btn-primary !py-2.5 !px-6 text-xs font-bold shadow-md disabled:opacity-50"
              >
                {passwordLoading ? "Changing Password..." : "Change Password →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
