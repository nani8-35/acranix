import { useState, useEffect } from 'react';
import {
  Inbox,
  X,
  Trash2,
  Download,
  Mail,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  RefreshCw,
  UserCheck,
  Copy,
  Check,
  ShieldAlert,
  Lock,
  CheckCheck,
  Loader2,
} from 'lucide-react';
import {
  fetchAdminSubmissions,
  updateAdminSubmission,
  deleteAdminSubmission,
  markAllSubmissionsAsRead,
  exportSubmissionsToCSV,
  type FormSubmission,
} from '../lib/submissions';
import { getCurrentUser } from '../lib/auth';

interface AdminSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSubmissionsModal({ isOpen, onClose }: AdminSubmissionsModalProps) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | FormSubmission['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  const loadSubmissions = async () => {
    if (!isAdmin) {
      setAuthError('Unauthorized. Administrator credentials required to access the Inbox.');
      return;
    }

    setLoading(true);
    setAuthError(null);

    const result = await fetchAdminSubmissions();
    setLoading(false);

    if (result.error && !result.submissions.length) {
      setAuthError(result.error);
    } else {
      setSubmissions(result.submissions);
      if (selectedSubmission) {
        const updated = result.submissions.find((s) => s.id === selectedSubmission.id);
        setSelectedSubmission(updated || null);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadSubmissions();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      if (isOpen && isAdmin) {
        loadSubmissions();
      }
    };
    window.addEventListener('acranix_submission_updated', handleUpdate);
    return () => window.removeEventListener('acranix_submission_updated', handleUpdate);
  }, [isOpen, isAdmin]);

  if (!isOpen) return null;

  // Non-admin guard
  if (!isAdmin) {
    return (
      <div
        id="admin-submissions-modal-denied"
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-[#080808] border border-red-900/50 max-w-md w-full p-8 text-center space-y-5 relative shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-12 border border-red-800 bg-red-950/30 text-red-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Access Restricted
            </h3>
            <p className="text-xs text-[#aaaaaa] font-mono leading-relaxed">
              The Inbox and applicant intake records are restricted to verified ACRANIX administrators
              (<span className="text-white">akashyeginati@acranix.com</span>).
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-white text-black text-xs font-mono uppercase font-bold tracking-widest hover:bg-[#e0e0e0] transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const filtered = submissions.filter((sub) => {
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;
    const matchesSearch =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.discipline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.message && sub.message.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleStatusChange = async (id: string, newStatus: FormSubmission['status']) => {
    await updateAdminSubmission(id, { status: newStatus, isRead: true });
    loadSubmissions();
  };

  const handleMarkAllRead = async () => {
    await markAllSubmissionsAsRead();
    loadSubmissions();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this applicant submission?')) {
      await deleteAdminSubmission(id);
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      loadSubmissions();
    }
  };

  const handleSelectSubmission = async (sub: FormSubmission) => {
    setSelectedSubmission(sub);
    if (!sub.isRead) {
      await updateAdminSubmission(sub.id, { isRead: true });
      loadSubmissions();
    }
  };

  return (
    <div
      id="admin-submissions-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-[#080808] border border-[#262626] max-w-5xl w-full h-[88vh] flex flex-col relative shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Corner Accent */}
        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-white" />
        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-white" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222222] bg-[#050505]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#121212] border border-[#333333] text-white">
              <Inbox className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  Admin Submissions Inbox
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-white text-black font-semibold uppercase">
                  {submissions.length} Total
                </span>
                <span className="px-2 py-0.5 text-[9px] font-mono bg-[#1a1a1a] border border-[#333333] text-[#aaaaaa]">
                  Founder Access
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#888888] mt-0.5">
                Centralized applicant & inquiry intake for akashyeginati@acranix.com
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="export-submissions-csv-btn"
              onClick={() => exportSubmissionsToCSV(submissions)}
              disabled={submissions.length === 0}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] border border-[#333333] hover:border-white text-white text-xs font-mono transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              title="Export to CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              id="mark-all-read-btn"
              onClick={handleMarkAllRead}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#333333] hover:border-white text-[#aaaaaa] hover:text-white text-xs font-mono transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Read All</span>
            </button>
            <button
              type="button"
              id="refresh-submissions-btn"
              onClick={loadSubmissions}
              disabled={loading}
              className="p-2 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
              title="Refresh submissions"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              id="close-admin-modal-btn"
              onClick={onClose}
              className="p-2 border border-[#333333] text-[#888888] hover:text-white hover:border-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-[#222222] bg-[#060606] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, discipline, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#020202] border border-[#222222] text-xs text-white placeholder-[#555555] focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-[11px] font-mono">
            <span className="text-[#666666] flex items-center gap-1 mr-1 text-[10px] uppercase">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['all', 'new', 'reviewed', 'contacted', 'archived'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-1 uppercase tracking-wider transition-colors ${
                  filterStatus === status
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#121212] border border-[#262626] text-[#888888] hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split View (List + Detail) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-[#030303]">
          {/* Left Column: Submissions List */}
          <div className="md:col-span-5 border-r border-[#222222] overflow-y-auto divide-y divide-[#181818]">
            {loading && submissions.length === 0 ? (
              <div className="p-10 text-center space-y-2">
                <Loader2 className="w-6 h-6 text-white animate-spin mx-auto" />
                <p className="text-xs font-mono text-[#888888]">Fetching intake submissions...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <Inbox className="w-8 h-8 text-[#444444] mx-auto" />
                <p className="text-xs text-[#888888] font-mono uppercase tracking-wider">
                  No applications found
                </p>
                <p className="text-[11px] text-[#666666] max-w-xs mx-auto">
                  {submissions.length === 0
                    ? 'When applicants complete the "Join Us" form, their submitted details will be stored and listed here.'
                    : 'No submissions matched your current search or filter.'}
                </p>
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedSubmission?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectSubmission(item)}
                    className={`p-4 cursor-pointer transition-colors relative ${
                      isSelected
                        ? 'bg-[#111111] border-l-2 border-white'
                        : 'hover:bg-[#0a0a0a]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          {!item.isRead && (
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" title="Unread" />
                          )}
                          <p className="text-xs font-semibold text-white tracking-wide">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[11px] font-mono text-[#888888]">
                          {item.email}
                        </p>
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 tracking-wider font-semibold ${
                          item.status === 'new'
                            ? 'bg-white text-black'
                            : item.status === 'contacted'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : item.status === 'reviewed'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-[#1a1a1a] text-[#777777]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#aaaaaa] mt-2 line-clamp-1 font-light">
                      {item.discipline}
                    </p>

                    {item.message && (
                      <p className="text-[11px] text-[#666666] mt-1 line-clamp-2 italic">
                        "{item.message}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[9px] font-mono text-[#555555] mt-2 pt-2 border-t border-[#141414]">
                      <span>{new Date(item.submittedAt).toLocaleDateString()}</span>
                      <span>{new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Selected Submission Detail */}
          <div className="md:col-span-7 overflow-y-auto p-6 bg-[#050505]">
            {selectedSubmission ? (
              <div className="space-y-6">
                {/* Header Card */}
                <div className="border border-[#222222] bg-[#080808] p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c1c] pb-3">
                    <div>
                      <h4 className="text-lg font-bold text-white">{selectedSubmission.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-mono text-[#aaaaaa]">{selectedSubmission.email}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(selectedSubmission.email)}
                          className="text-[#666666] hover:text-white transition-colors"
                          title="Copy email"
                        >
                          {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${selectedSubmission.email}?subject=${encodeURIComponent(
                          `ACRANIX Builder Application Response - ${selectedSubmission.discipline}`
                        )}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-mono uppercase font-bold hover:bg-[#e0e0e0] transition-colors"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Reply Email</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedSubmission.id)}
                        className="p-1.5 border border-[#333333] hover:border-red-500 text-[#888888] hover:text-red-400 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1">
                    <div>
                      <span className="text-[#666666] uppercase text-[10px] block">Submitted At</span>
                      <span className="text-white">
                        {new Date(selectedSubmission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#666666] uppercase text-[10px] block">Application ID</span>
                      <span className="text-[#aaaaaa] text-[11px] truncate block">{selectedSubmission.id}</span>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                  <div className="border border-[#222222] bg-[#080808] p-4">
                    <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block mb-1">
                      Discipline & Role Focus
                    </span>
                    <p className="text-sm font-semibold text-white">
                      {selectedSubmission.discipline}
                    </p>
                  </div>

                  {selectedSubmission.portfolioOrGithub && (
                    <div className="border border-[#222222] bg-[#080808] p-4">
                      <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block mb-1">
                        Portfolio / GitHub / Profile
                      </span>
                      <a
                        href={
                          selectedSubmission.portfolioOrGithub.startsWith('http')
                            ? selectedSubmission.portfolioOrGithub
                            : `https://${selectedSubmission.portfolioOrGithub}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-white hover:underline inline-flex items-center gap-1.5"
                      >
                        <span>{selectedSubmission.portfolioOrGithub}</span>
                        <ExternalLink className="w-3 h-3 text-[#888888]" />
                      </a>
                    </div>
                  )}

                  <div className="border border-[#222222] bg-[#080808] p-4">
                    <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block mb-1.5">
                      What problem they want to solve / Note
                    </span>
                    <p className="text-xs text-[#dddddd] font-light leading-relaxed whitespace-pre-wrap">
                      {selectedSubmission.message || '(No note attached)'}
                    </p>
                  </div>

                  {/* Status Manager */}
                  <div className="border border-[#222222] bg-[#080808] p-4 space-y-2.5">
                    <span className="text-[10px] font-mono text-[#666666] uppercase tracking-wider block">
                      Update Application Workflow Status
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(['new', 'reviewed', 'contacted', 'archived'] as const).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(selectedSubmission.id, st)}
                          className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                            selectedSubmission.status === st
                              ? 'bg-white text-black font-bold'
                              : 'bg-[#141414] border border-[#2c2c2c] text-[#888888] hover:text-white hover:border-[#444444]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#555555] space-y-2">
                <UserCheck className="w-10 h-10 text-[#333333]" />
                <p className="text-xs font-mono uppercase tracking-widest text-[#777777]">
                  Select an application from the list
                </p>
                <p className="text-[11px] text-[#555555] max-w-xs">
                  Review applicant details, copy contact information, reply via email, or update their intake status.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
