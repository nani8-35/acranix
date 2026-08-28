import { getToken } from './auth';

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  discipline: string;
  portfolioOrGithub: string;
  message: string;
  submittedAt: string;
  isRead: boolean;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  notes?: string;
}

const STORAGE_KEY = 'acranix_builder_applications';

export function getLocalStoredSubmissions(): FormSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read submissions from storage:', err);
    return [];
  }
}

export function saveLocalSubmissions(subs: FormSubmission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  } catch (err) {
    console.error('Failed to write submissions to storage:', err);
  }
}

export const getStoredSubmissions = getLocalStoredSubmissions;
export const saveSubmission = submitJoinForm;

// ----------------- PUBLIC INTAKE -----------------

export async function submitJoinForm(entry: {
  name: string;
  email: string;
  discipline: string;
  portfolioOrGithub: string;
  message: string;
}): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  try {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    const data = await res.json();

    if (res.ok) {
      // Also cache locally
      const localItem: FormSubmission = {
        id: data.submissionId || `sub_${Date.now()}`,
        name: entry.name,
        email: entry.email,
        discipline: entry.discipline,
        portfolioOrGithub: entry.portfolioOrGithub,
        message: entry.message,
        submittedAt: new Date().toISOString(),
        isRead: false,
        status: 'new',
      };
      const current = getLocalStoredSubmissions();
      saveLocalSubmissions([localItem, ...current]);
      window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
      return { success: true, submissionId: data.submissionId };
    }

    return { success: false, error: data.error || 'Failed to record application.' };
  } catch (err) {
    console.error('Network error submitting join form:', err);
    // Fallback to local storage
    const fallbackItem: FormSubmission = {
      id: `sub_${Date.now()}`,
      name: entry.name,
      email: entry.email,
      discipline: entry.discipline,
      portfolioOrGithub: entry.portfolioOrGithub,
      message: entry.message,
      submittedAt: new Date().toISOString(),
      isRead: false,
      status: 'new',
    };
    const current = getLocalStoredSubmissions();
    saveLocalSubmissions([fallbackItem, ...current]);
    window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
    return { success: true, submissionId: fallbackItem.id };
  }
}

// ----------------- ADMIN PROTECTED API CALLS -----------------

export async function fetchAdminSubmissions(): Promise<{
  submissions: FormSubmission[];
  totalCount: number;
  unreadCount: number;
  error?: string;
}> {
  const token = getToken();
  if (!token) {
    return {
      submissions: getLocalStoredSubmissions(),
      totalCount: 0,
      unreadCount: 0,
      error: 'Admin authentication required',
    };
  }

  try {
    const res = await fetch('/api/admin/submissions', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        submissions: [],
        totalCount: 0,
        unreadCount: 0,
        error: errorData.error || 'Unauthorized to access admin inbox.',
      };
    }

    const data = await res.json();
    if (data.submissions) {
      saveLocalSubmissions(data.submissions);
    }
    return {
      submissions: data.submissions || [],
      totalCount: data.totalCount || 0,
      unreadCount: data.unreadCount || 0,
    };
  } catch (err) {
    console.error('Network error fetching admin submissions:', err);
    const local = getLocalStoredSubmissions();
    return {
      submissions: local,
      totalCount: local.length,
      unreadCount: local.filter((s) => !s.isRead).length,
    };
  }
}

export async function fetchAdminStats(): Promise<{
  totalSubmissions: number;
  unreadCount: number;
  totalUsers: number;
}> {
  const token = getToken();
  if (!token) return { totalSubmissions: 0, unreadCount: 0, totalUsers: 0 };

  try {
    const res = await fetch('/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Fetch stats error:', err);
  }

  const local = getLocalStoredSubmissions();
  return {
    totalSubmissions: local.length,
    unreadCount: local.filter((s) => !s.isRead).length,
    totalUsers: 2,
  };
}

export async function updateAdminSubmission(
  id: string,
  updates: { isRead?: boolean; status?: FormSubmission['status']; notes?: string }
): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
      return true;
    }
  } catch (err) {
    console.error('Update submission network error:', err);
  }

  // Local fallback
  const current = getLocalStoredSubmissions();
  const updated = current.map((s) => {
    if (s.id === id) {
      return {
        ...s,
        isRead: updates.isRead !== undefined ? updates.isRead : s.isRead,
        status: updates.status !== undefined ? updates.status : s.status,
        notes: updates.notes !== undefined ? updates.notes : s.notes,
      };
    }
    return s;
  });
  saveLocalSubmissions(updated);
  window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
  return true;
}

export async function markAllSubmissionsAsRead(): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/submissions/mark-all-read', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
      return true;
    }
  } catch (err) {
    console.error('Mark all read network error:', err);
  }

  const current = getLocalStoredSubmissions();
  const updated = current.map((s) => ({ ...s, isRead: true }));
  saveLocalSubmissions(updated);
  window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
  return true;
}

export async function deleteAdminSubmission(id: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
      return true;
    }
  } catch (err) {
    console.error('Delete submission network error:', err);
  }

  const current = getLocalStoredSubmissions();
  const updated = current.filter((s) => s.id !== id);
  saveLocalSubmissions(updated);
  window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
  return true;
}

export function exportSubmissionsToCSV(submissions: FormSubmission[]): void {
  if (submissions.length === 0) return;
  const headers = ['ID', 'Date (UTC)', 'Name', 'Email', 'Discipline', 'Portfolio/GitHub', 'Status', 'Read', 'Message'];
  const rows = submissions.map((s) => [
    s.id,
    new Date(s.submittedAt).toLocaleString(),
    `"${(s.name || '').replace(/"/g, '""')}"`,
    `"${(s.email || '').replace(/"/g, '""')}"`,
    `"${(s.discipline || '').replace(/"/g, '""')}"`,
    `"${(s.portfolioOrGithub || '').replace(/"/g, '""')}"`,
    s.status,
    s.isRead ? 'Read' : 'Unread',
    `"${(s.message || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `acranix_builder_applications_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ----------------- RENDER BACKEND INTEGRATION & SYNC -----------------

export interface BackendSyncInfo {
  remoteBackendUrl: string;
  status: 'connected' | 'offline_or_waking';
  details?: {
    isOnline: boolean;
    latencyMs?: number;
    lastChecked?: string;
    statusCode?: number;
    error?: string;
  };
  localMetrics?: {
    totalUsers: number;
    totalSubmissions: number;
  };
}

export async function fetchBackendSyncStatus(): Promise<BackendSyncInfo | null> {
  try {
    const res = await fetch('/api/backend-sync/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch backend sync status:', err);
  }
  return {
    remoteBackendUrl: 'https://acranix.onrender.com',
    status: 'offline_or_waking',
    details: {
      isOnline: false,
      error: 'Connecting to bridge...',
    },
  };
}

export async function triggerRemoteBackendSync(): Promise<{ success: boolean; message: string }> {
  const token = getToken();
  try {
    const res = await fetch('/api/backend-sync/sync-submissions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
    });
    if (res.ok) {
      const data = await res.json();
      window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
      return { success: true, message: data.message || 'Sync successful.' };
    }
    return { success: false, message: 'Remote sync failed.' };
  } catch (err) {
    return { success: false, message: 'Network error during synchronization.' };
  }
}
