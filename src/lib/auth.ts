import { UserProfile, DailyActionItem, UserRole } from '../types';
import { getApiUrl } from './config';

const AUTH_USER_KEY = 'acranix_current_user';
const AUTH_TOKEN_KEY = 'acranix_session_jwt';
const DAILY_ACTIONS_KEY = 'acranix_user_daily_actions';

export function getToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'ADMIN';
}

// ----------------- AUTHENTICATION API CALLS -----------------

export async function signUpApi(data: {
  name: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
  try {
    const res = await fetch(getApiUrl('/api/auth/signup'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      return { success: false, error: resData.error || 'Failed to create account.' };
    }

    if (resData.token && resData.user) {
      localStorage.setItem(AUTH_TOKEN_KEY, resData.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(resData.user));
      window.dispatchEvent(new CustomEvent('acranix_auth_changed'));
    }

    return {
      success: true,
      user: resData.user,
      token: resData.token,
    };
  } catch (err) {
    console.error('Sign up network error:', err);
    return { success: false, error: 'Network error connecting to ACRANIX authentication service.' };
  }
}

export async function signInApi(data: {
  email: string;
  password: string;
}): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
  try {
    const res = await fetch(getApiUrl('/api/auth/signin'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      return { success: false, error: resData.error || 'Invalid credentials.' };
    }

    if (resData.token && resData.user) {
      localStorage.setItem(AUTH_TOKEN_KEY, resData.token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(resData.user));
      window.dispatchEvent(new CustomEvent('acranix_auth_changed'));
    }

    return {
      success: true,
      user: resData.user,
      token: resData.token,
    };
  } catch (err) {
    console.error('Sign in network error:', err);
    return { success: false, error: 'Network error connecting to ACRANIX authentication service.' };
  }
}

export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const res = await fetch(getApiUrl('/api/auth/me'), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
    } else if (res.status === 401 || res.status === 403) {
      // Token expired or invalid
      signOutUser();
    }
  } catch (err) {
    console.error('Fetch me network error:', err);
  }

  return getCurrentUser();
}

export function signOutUser(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new CustomEvent('acranix_auth_changed'));
}

// ----------------- FORGOT PASSWORD & OTP RECOVERY -----------------

export async function sendPasswordResetOtp(email: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  retryAfter?: number;
  devHintOtp?: string;
}> {
  try {
    const res = await fetch(getApiUrl('/api/auth/forgot-password/send-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Failed to send verification code.',
        retryAfter: data.retryAfter,
      };
    }

    return {
      success: true,
      message: data.message,
      devHintOtp: data.devHintOtp,
    };
  } catch (err) {
    console.error('Send OTP network error:', err);
    return { success: false, error: 'Network error connecting to security server.' };
  }
}

export async function verifyPasswordResetOtp(
  email: string,
  otp: string
): Promise<{
  success: boolean;
  resetToken?: string;
  error?: string;
  attemptsRemaining?: number;
  expired?: boolean;
}> {
  try {
    const res = await fetch(getApiUrl('/api/auth/forgot-password/verify-otp'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Invalid verification code.',
        attemptsRemaining: data.attemptsRemaining,
        expired: data.expired,
      };
    }

    return {
      success: true,
      resetToken: data.resetToken,
    };
  } catch (err) {
    console.error('Verify OTP network error:', err);
    return { success: false, error: 'Network error verifying code.' };
  }
}

export async function resetPasswordApi(data: {
  email: string;
  resetToken: string;
  newPassword: string;
}): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(getApiUrl('/api/auth/forgot-password/reset-password'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      return { success: false, error: resData.error || 'Failed to reset password.' };
    }

    return {
      success: true,
      message: resData.message || 'Your password has been reset successfully.',
    };
  } catch (err) {
    console.error('Reset password network error:', err);
    return { success: false, error: 'Network error resetting password.' };
  }
}

// ----------------- PROFILE UPDATE API -----------------

export async function updateProfileApi(updates: {
  name?: string;
  email?: string;
}): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const token = getToken();
  if (!token) return { success: false, error: 'Not authenticated.' };

  try {
    const res = await fetch(getApiUrl('/api/auth/update-profile'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to update profile.' };
    }

    if (data.user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }
      window.dispatchEvent(new CustomEvent('acranix_auth_changed'));
    }

    return { success: true, user: data.user };
  } catch (err) {
    console.error('Update profile network error:', err);
    return { success: false, error: 'Network error updating profile.' };
  }
}

// ----------------- USER DAILY ACTIONS -----------------

export function getUserDailyActions(userId: string): DailyActionItem[] {
  try {
    const raw = localStorage.getItem(DAILY_ACTIONS_KEY);
    const store: Record<string, DailyActionItem[]> = raw ? JSON.parse(raw) : {};
    return (
      store[userId] || [
        {
          id: `act_${Date.now()}_1`,
          userId,
          title: 'Review contextual reasoning telemetry',
          category: 'Understand',
          priority: 'high',
          completed: false,
          dueDate: 'Today',
          createdAt: new Date().toISOString(),
          impactNotes: 'Assess multi-branch reasoning fidelity and pipeline integrity.',
        },
      ]
    );
  } catch {
    return [];
  }
}

export function saveUserDailyActions(userId: string, actions: DailyActionItem[]) {
  try {
    const raw = localStorage.getItem(DAILY_ACTIONS_KEY);
    const store: Record<string, DailyActionItem[]> = raw ? JSON.parse(raw) : {};
    store[userId] = actions;
    localStorage.setItem(DAILY_ACTIONS_KEY, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('acranix_actions_changed'));
  } catch (err) {
    console.error('Failed saving actions:', err);
  }
}

export function addUserDailyAction(
  userId: string,
  data: {
    title: string;
    category: DailyActionItem['category'];
    priority: DailyActionItem['priority'];
    dueDate?: string;
    impactNotes?: string;
  }
): DailyActionItem {
  const current = getUserDailyActions(userId);
  const newItem: DailyActionItem = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    userId,
    title: data.title.trim(),
    category: data.category,
    priority: data.priority,
    completed: false,
    dueDate: data.dueDate?.trim() || 'Today',
    createdAt: new Date().toISOString(),
    impactNotes: data.impactNotes?.trim(),
  };

  const updated = [newItem, ...current];
  saveUserDailyActions(userId, updated);
  return newItem;
}

export function toggleUserDailyAction(userId: string, actionId: string): DailyActionItem[] {
  const current = getUserDailyActions(userId);
  const updated = current.map((act) => {
    if (act.id === actionId) {
      return { ...act, completed: !act.completed };
    }
    return act;
  });
  saveUserDailyActions(userId, updated);
  return updated;
}

export function deleteUserDailyAction(userId: string, actionId: string): DailyActionItem[] {
  const current = getUserDailyActions(userId);
  const updated = current.filter((act) => act.id !== actionId);
  saveUserDailyActions(userId, updated);
  return updated;
}
