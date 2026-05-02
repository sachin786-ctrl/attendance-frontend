import {
  deleteUser,
  getCurrentUser,
  updateUser,
  updateUserImage,
} from "@/service/authService";
import useAuth from "@/stores/authStores";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FaCamera, FaEdit, FaLock, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>(
    user?.image ?? "https://api.dicebear.com/7.x/adventurer/svg",
  );
  const [imageLoading, setImageLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==================== HANDLERS ====================

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError("");
    try {
      await updateUser({ name }, user?.id);
      setEditMode(false);
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setName(user?.name ?? "");
    setError("");
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    )
      return;
    try {
      await deleteUser(user?.id);
      logout(true); // silent logout
      navigate("/login");
      toast.success("Account deleted successfully!");
    } catch {
      setError("Failed to delete account. Please try again.");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setImageLoading(true);
      try {
        await updateUserImage(base64, user?.id);
        // Store mein bhi update karo
        const updatedUser = await getCurrentUser(user?.email);
        useAuth
          .getState()
          .changeLocalLoginData(
            useAuth.getState().accessToken!,
            updatedUser,
            true,
          );
      } catch {
        setError("Failed to update picture.");
        setPreview(
          user?.image ?? "https://api.dicebear.com/7.x/adventurer/svg",
        );
      } finally {
        setImageLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ==================== RENDER ====================

  return (
    <div className="min-h-screen text-white">
      <h1 className="text-xl text-center font-semibold text-slate-800 mb-6">
        Profile
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* PROFILE CARD */}
        <div className="border bg-white rounded-2xl p-6">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* LEFT - IMAGE */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto">
                <img
                  src={preview}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-[#322F81] object-cover"
                />
                {imageLoading && (
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">saving...</span>
                  </div>
                )}
                <button
                  onClick={() => editMode && fileInputRef.current?.click()}
                  className={`absolute bottom-0 right-0 bg-[#322F81] p-2 rounded-full
        ${editMode ? "hover:bg-[#1E1B4B] cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
                >
                  <FaCamera size={12} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />

              <button
                onClick={() => editMode && fileInputRef.current?.click()}
                disabled={!editMode}
                className={`text-sm font-semibold bg-slate-100 text-slate-800 p-2 rounded-sm border mt-3
      ${!editMode ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                change picture
              </button>
            </div>
            {/* RIGHT - INFO */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-800 font-semibold">
                  Full Name
                </label>
                <input
                  disabled={!editMode}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 text-slate-700 border border-gray-400 rounded-lg px-3 py-2 disabled:bg-neutral-100"
                />
              </div>

              <div>
                <label className="text-sm text-slate-800 font-semibold">
                  Email
                </label>
                <input
                  disabled
                  readOnly
                  defaultValue={user?.email}
                  className="w-full mt-1 text-slate-700 border border-gray-400 cursor-not-allowed bg-neutral-100 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-800 font-semibold">
                  Provider
                </label>
                <input
                  disabled
                  defaultValue={user?.provider}
                  className="w-full mt-1 text-slate-700 border border-gray-400 bg-neutral-100 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm text-slate-800 font-semibold">
                  Status
                </label>
                <input
                  disabled
                  value={user?.enable ? "Active" : "Inactive"}
                  className="w-full mt-1 text-slate-700 border border-gray-400 bg-neutral-100 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex justify-end gap-3">
            {editMode && (
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
            )}
            <button
              onClick={editMode ? handleSave : () => setEditMode(true)}
              disabled={loading}
              className="bg-[#322F81] hover:bg-[#1E1B4B] text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
            >
              <FaEdit />
              {loading ? "Saving..." : editMode ? "Save" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* ACCOUNT SETTINGS */}
        <div className="bg-white border rounded-2xl p-6 space-y-6">
          <h2 className="text-xl text-slate-800 font-semibold">
            Account Settings
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 my-6">
            {/* <button className="bg-[#322F81] text-sm sm:text-base hover:bg-[#1E1B4B] px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-white w-full sm:w-auto">
              <FaLock /> Change Password
            </button> */}
            <button
              onClick={handleDelete}
              className="bg-red-600 text-sm sm:text-base hover:bg-red-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-white w-full sm:w-auto"
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
