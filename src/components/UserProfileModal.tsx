import { useState, useEffect, type FormEvent } from 'react';
import {
  X,
  User,
  Mail,
  Shield,
  ShieldCheck,
  LogOut,
  Save,
  Check,
  Sparkles,
  KeyRound,
  Calendar,
} from 'lucide-react';
import { getCurrentUser, updateProfileApi, signOutUser } from '../lib/auth';
import type { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export function UserProfileModal({ isOpen, onClose, onSignOut }: UserProfileModalProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const loadUserData = () => {
    const current = getCurrentUser();
    setUser(current);
    if (current) {
      setName(current.name || 'Akash');
      setEmail(current.email || 'akash@gmail.com');
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUserData();
      setError(null);
      setSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleAuthChange = () => loadUserData();
    window.addEventListener('acranix_auth_changed', handleAuthChange);
    return () => window.removeEventListener('acranix_auth_changed', handleAuthChange);
  }, []);

  if (!isOpen || !user) return null;

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!name.trim()) {
      setError('Profile Name cannot be empty.');
      return;
    }
    if (!email.trim()) {
      setError('Email Address cannot be empty.');
      return;
    }

    setLoading(true);
    const res = await updateProfileApi({
      name: name.trim(),
      email: email.trim(),
    });
    setLoading(false);

    if (res.success && res.user) {
      setUser(res.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  const handleLogout = () => {
    signOutUser();
    onSignOut();
    onClose();
  };

  const isAdmin = user.role === 'ADMIN';

  return (
    <div
      id="user-profile-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#080808] border border-[#262626] max-w-md w-full relative shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner Accents */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-white bg-white text-black flex items-center justify-center font-bold text-xs font-mono">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  {user.name || 'Akash'}
                </h3>
                <span
                  className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-white text-black'
                      : 'bg-[#181818] border border-[#333333] text-[#aaaaaa]'
                  }`}
                >
                  {isAdmin ? 'ADMIN' : 'USER'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#888888]">{user.email}</p>
            </div>
          </div>

          <button
            type="button"
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-1.5 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
            aria-label="Close profile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs font-mono">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Profile information updated successfully.</span>
            </div>
          )}

          {/* Account Overview Badge Card */}
          <div className="p-4 bg-[#050505] border border-[#222222] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#666666]">
                Account Authorization Level
              </span>
              <div className="flex items-center gap-1.5">
                {isAdmin ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-white" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-[#888888]" />
                )}
                <span className="text-xs font-mono text-white font-bold">
                  {isAdmin ? 'Administrator Access' : 'Standard User'}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-[#777777] font-light leading-relaxed border-t border-[#181818] pt-2">
              {isAdmin
                ? 'Full administrative control enabled. You have access to the Admin Inbox and Join Us talent applications.'
                : 'Authenticated as a standard ACRANIX user. Access to platform intelligence features.'}
            </div>
          </div>

          {/* Profile Edit Form */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                Profile Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-name-input"
                  type="text"
                  required
                  placeholder="Akash"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-sans transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#888888] block mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="profile-email-input"
                  type="email"
                  required
                  placeholder="akash@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#020202] border border-[#262626] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-sans transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              id="update-profile-submit-btn"
              disabled={loading}
              className="w-full py-3 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </form>

          {/* Logout Row */}
          <div className="pt-4 border-t border-[#1a1a1a] flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#666666]">End current session</span>
            <button
              type="button"
              id="profile-signout-btn"
              onClick={handleLogout}
              className="px-4 py-2 border border-[#333333] hover:border-red-500 text-[#aaaaaa] hover:text-red-400 text-xs font-mono uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
