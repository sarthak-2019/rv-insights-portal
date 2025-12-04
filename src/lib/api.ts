/**
 * API Configuration and Utilities
 */

// Get the base URL from environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://retell-back.estulife.com";

/**
 * Helper function to construct API URLs
 */
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Wrapper around fetch with automatic URL construction
 */
export const apiFetch = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const url = getApiUrl(endpoint);
  return fetch(url, options);
};
