import useAuth from "@/stores/authStores";
import instance from "@/config/instance"; // ya jahan tumhara axios instance hai
import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FaBell,
  FaGlobe,
  FaLock,
  FaMoon,
  FaSave,
  FaSun,
  FaUserShield,
} from "react-icons/fa";

// ── Types ──────────────────────────────────────────────
interface SettingsForm {
  // Preferences
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  // Notifications
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  // Privacy
  profileVisible: boolean;
  showEmail: boolean;
  showAttendance: boolean;
}

// ── Constants ──────────────────────────────────────────
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "mr", label: "Marathi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
];

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "IST — India (UTC+5:30)" },
  { value: "Asia/Dubai", label: "GST — Dubai (UTC+4)" },
  { value: "Europe/London", label: "GMT — London (UTC+0)" },
  { value: "America/New_York", label: "EST — New York (UTC-5)" },
  { value: "America/Los_Angeles", label: "PST — Los Angeles (UTC-8)" },
];

// ── Component ──────────────────────────────────────────
const Settings = () => {
  const user = useAuth((state) => state.user);
  const changeLocalLoginData = useAuth((state) => state.changeLocalLoginData);
  const accessToken = useAuth((state) => state.accessToken);

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "preferences" | "notifications" | "privacy"
  >("preferences");

  const [form, setForm] = useState<SettingsForm>({
    // Preferences — user ke stored values ya defaults
    theme:    (user as any)?.theme    ?? "system",
    language: (user as any)?.language ?? "en",
    timezone: (user as any)?.timezone ?? "Asia/Kolkata",
    // Notifications
    emailNotifications: (user as any)?.emailNotifications ?? true,
    pushNotifications:  (user as any)?.pushNotifications  ?? false,
    smsNotifications:   (user as any)?.smsNotifications   ?? false,
    // Privacy
    profileVisible:  (user as any)?.profileVisible  ?? true,
    showEmail:       (user as any)?.showEmail        ?? false,
    showAttendance:  (user as any)?.showAttendance   ?? true,
  });

  // ── Handlers ────────────────────────────────────────

  const handleToggle = (key: keyof SettingsForm) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key: keyof SettingsForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await instance.patch(`/users/${user.id}`, form);
      // Store update karo
      changeLocalLoginData(accessToken!, { ...user, ...res.data }, true);
      toast.success("Settings saved!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reusable UI pieces ───────────────────────────────

  const Toggle = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex w-11 h-6 rounded-full transition-colors duration-200
        ${value ? "bg-[#322F81]" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
          ${value ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );

  const SectionBtn = ({
    id,
    icon,
    label,
  }: {
    id: typeof activeSection;
    icon: React.ReactNode;
    label: string;
  }) => (
    <button
      onClick={() => setActiveSection(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
        ${activeSection === id
          ? "bg-[#322F81] text-white"
          : "text-slate-600 hover:bg-slate-100"}`}
    >
      {icon} {label}
    </button>
  );

  const Row = ({
    label,
    sub,
    right,
  }: {
    label: string;
    sub?: string;
    right: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );

  // ── Render ───────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800">Settings</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your preferences and account settings
        </p>
      </div>

      <div className="max-w-4xl space-y-4 flex flex-col mx-auto">
        {/* Section tabs */}
        <div className="flex gap-2 flex-wrap">
          <SectionBtn id="preferences"  icon={<FaGlobe size={13} />}      label="Preferences" />
          <SectionBtn id="notifications" icon={<FaBell size={13} />}      label="Notifications" />
          <SectionBtn id="privacy"       icon={<FaUserShield size={13} />} label="Privacy" />
        </div>

        {/* Card */}
        <div className="bg-white border rounded-2xl p-6">

          {/* ── PREFERENCES ── */}
          {activeSection === "preferences" && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaGlobe className="text-[#322F81]" /> Preferences
              </h3>

              {/* Theme */}
              <div className="py-4 border-b border-slate-100">
                <p className="text-sm font-medium text-slate-800 mb-2">Theme</p>
                <div className="flex gap-2">
                  {(["light", "dark", "system"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleSelect("theme", t)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-colors
                        ${form.theme === t
                          ? "bg-[#322F81] text-white border-[#322F81]"
                          : "text-slate-600 border-slate-200 hover:bg-slate-50"}`}
                    >
                      {t === "light" ? <FaSun size={12} /> : t === "dark" ? <FaMoon size={12} /> : "⚙"}
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <Row
                label="Language"
                sub="App interface language"
                right={
                  <select
                    value={form.language}
                    onChange={(e) => handleSelect("language", e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-[#322F81]"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.value} value={l.value}>{l.label}</option>
                    ))}
                  </select>
                }
              />

              {/* Timezone */}
              <Row
                label="Timezone"
                sub="Used for attendance records"
                right={
                  <select
                    value={form.timezone}
                    onChange={(e) => handleSelect("timezone", e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:border-[#322F81]"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                }
              />
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === "notifications" && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaBell className="text-[#322F81]" /> Notifications
              </h3>

              <Row
                label="Email Notifications"
                sub="Attendance reports, updates"
                right={<Toggle value={form.emailNotifications} onToggle={() => handleToggle("emailNotifications")} />}
              />
              <Row
                label="Push Notifications"
                sub="Browser / mobile alerts"
                right={<Toggle value={form.pushNotifications} onToggle={() => handleToggle("pushNotifications")} />}
              />
              <Row
                label="SMS Notifications"
                sub="Text messages on mobile"
                right={<Toggle value={form.smsNotifications} onToggle={() => handleToggle("smsNotifications")} />}
              />
            </div>
          )}

          {/* ── PRIVACY ── */}
          {activeSection === "privacy" && (
            <div>
              <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <FaLock className="text-[#322F81]" /> Privacy
              </h3>

              <Row
                label="Public Profile"
                sub="Others can see your profile"
                right={<Toggle value={form.profileVisible} onToggle={() => handleToggle("profileVisible")} />}
              />
              <Row
                label="Show Email"
                sub="Display email on profile"
                right={<Toggle value={form.showEmail} onToggle={() => handleToggle("showEmail")} />}
              />
              <Row
                label="Show Attendance"
                sub="Attendance visible to team"
                right={<Toggle value={form.showAttendance} onToggle={() => handleToggle("showAttendance")} />}
              />
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#322F81] hover:bg-[#1E1B4B] text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60 transition-colors"
          >
            <FaSave />
            {loading ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;