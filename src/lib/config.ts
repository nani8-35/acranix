/**
 * Centralized API URL Configuration for ACRANIX
 *
 * In production / Vercel deployment, requests are routed directly to the Render Express backend:
 * https://acranix.onrender.com
 *
 * Configured via Vite environment variable VITE_API_URL:
 * import.meta.env.VITE_API_URL
 */

const rawApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL: string = (() => {
  // 1. Explicitly configured via VITE_API_URL environment variable
  if (typeof rawApiUrl === 'string' && rawApiUrl.trim() !== '') {
    return rawApiUrl.trim().replace(/\/+$/, '');
  }

  // 2. Browser context: If loaded on custom domain (acranix.com, vercel.app, etc.) and not localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0';
    if (!isLocal) {
      return 'https://acranix.onrender.com';
    }
  }

  // 3. Fallback for local development proxy or same-origin
  return '';
})();

/**
 * Builds the full API URL for a given endpoint.
 * Example: getApiUrl('/api/auth/signin') -> 'https://acranix.onrender.com/api/auth/signin'
 */
export function getApiUrl(endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!API_BASE_URL) {
    return path;
  }
  return `${API_BASE_URL}${path}`;
}
