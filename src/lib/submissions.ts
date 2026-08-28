export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  discipline: string;
  portfolioOrGithub: string;
  message: string;
  submittedAt: string;
  status: 'new' | 'reviewed' | 'contacted' | 'archived';
  notes?: string;
}

const STORAGE_KEY = 'acranix_builder_applications';

export function getStoredSubmissions(): FormSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read submissions from storage:', err);
    return [];
  }
}

export function saveSubmission(entry: Omit<FormSubmission, 'id' | 'submittedAt' | 'status'>): FormSubmission {
  const newSubmission: FormSubmission = {
    ...entry,
    id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    submittedAt: new Date().toISOString(),
    status: 'new',
  };

  try {
    const current = getStoredSubmissions();
    const updated = [newSubmission, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event so any open admin viewer or badge updates reactively
    window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
  } catch (err) {
    console.error('Failed to save submission:', err);
  }

  return newSubmission;
}

export function updateSubmissionStatus(id: string, status: FormSubmission['status'], notes?: string): void {
  try {
    const current = getStoredSubmissions();
    const updated = current.map((sub) => {
      if (sub.id === id) {
        return { ...sub, status, notes: notes !== undefined ? notes : sub.notes };
      }
      return sub;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
  } catch (err) {
    console.error('Failed to update submission:', err);
  }
}

export function deleteSubmission(id: string): void {
  try {
    const current = getStoredSubmissions();
    const updated = current.filter((sub) => sub.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('acranix_submission_updated'));
  } catch (err) {
    console.error('Failed to delete submission:', err);
  }
}

export function exportSubmissionsToCSV(submissions: FormSubmission[]): void {
  if (submissions.length === 0) return;
  const headers = ['ID', 'Date (UTC)', 'Name', 'Email', 'Discipline', 'Portfolio/GitHub', 'Message', 'Status'];
  const rows = submissions.map((s) => [
    s.id,
    new Date(s.submittedAt).toLocaleString(),
    `"${s.name.replace(/"/g, '""')}"`,
    `"${s.email.replace(/"/g, '""')}"`,
    `"${s.discipline.replace(/"/g, '""')}"`,
    `"${(s.portfolioOrGithub || '').replace(/"/g, '""')}"`,
    `"${(s.message || '').replace(/"/g, '""')}"`,
    s.status,
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
