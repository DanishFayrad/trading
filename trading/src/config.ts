/**
 * Dynamic API URL Resolver
 * 
 * Determines whether to use the local or production backend based on the current hostname.
 */
export const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // Check if running on localhost or a local network IP
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.')
    ) {
      return 'http://localhost:5000';
    }
    // Return live production URL when running on a live domain
    return 'https://invest-app-ab4f3840a6a6.herokuapp.com';
  }
  // Server-side fallback (SSR)
  return process.env.NEXT_PUBLIC_API_URL || 'https://invest-app-ab4f3840a6a6.herokuapp.com';
};
