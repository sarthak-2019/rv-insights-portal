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

/**
 * Dummy company names for demo purposes
 * Maps real company names to fictional ones
 */
const dummyCompanyNames = [
  "Acme RV Sales Co.",
  "Global RV Center",
  "Premier Service Hub",
  "Coastal Repair Group",
  "Metro RV Dealership",
  "Apex Service Center",
  "Summit RV Services",
  "Titan Maintenance Co.",
  "Stellar Manufacturing Co.",
  "Platinum Motors Inc.",
  "Horizon Camper Co.",
  "Liberty RV Group",
  "Pioneer Coach Works",
  "Cascade RV Industries",
  "Sterling Motor Corp.",
  "Southern Comfort RV",
  "Atlas Coach Co.",
  "Evergreen RV Group",
  "Monarch Motorhomes",
  "Voyager RV Inc.",
  "Elite Coach Systems",
  "Prestige Luxury RV",
  "Valley View RV",
  "Mountain Ridge RV",
  "Trailhead RV Co.",
  "Frontier Manufacturing",
  "Redwood RV Sales",
  "Heritage RV Center",
  "Lakeside RV Group",
  "Discovery RV Services",
  "Sunset RV Dealership",
  "Thunder Road Motors",
  "Blue Ridge Campers",
  "Northwind RV Sales",
  "Pacific Coast RV",
  "Desert Sun Motors",
  "Golden State RV Co.",
  "Rocky Mountain RV",
  "Great Lakes RV Group",
  "Lone Star RV Center",
  "Sunshine RV Sales",
  "Clearwater RV Inc.",
  "Highland RV Services",
  "Pinecrest Motorhomes",
  "Riverbend RV Co.",
  "Canyon View Motors",
  "Maple Leaf RV",
  "Oceanside RV Group",
  "Timberline RV Sales",
  "Westwind Coaches",
  "Eastgate RV Center",
  "Ridgeline Motors",
  "Meadowbrook RV",
  "Sunburst RV Sales",
  "Starlight Motorhomes",
  "Countryside RV Co.",
  "Harborview RV Inc.",
  "Mountainview Motors",
  "Prairie Wind RV",
  "Silverstream RV Co.",
  "Woodlands RV Group",
  "Crossroads RV Sales",
];

// Cache for consistent mapping
const companyNameCache = new Map<string, string>();
let nameIndex = 0;

/**
 * Maps a real company name to a dummy name (consistent mapping)
 */
export const toDummyCompanyName = (realName: string): string => {
  // Normalize empty/invalid values
  const invalidValues = ["Not provided", "Unknown", "N/A", "", null, undefined];
  const normalizedName = !realName || invalidValues.includes(realName) 
    ? `_empty_${nameIndex}` 
    : realName;
  
  if (companyNameCache.has(normalizedName)) {
    return companyNameCache.get(normalizedName)!;
  }
  
  const dummyName = dummyCompanyNames[nameIndex % dummyCompanyNames.length];
  companyNameCache.set(normalizedName, dummyName);
  nameIndex++;
  
  return dummyName;
};

/**
 * Resets the company name cache (useful for testing)
 */
export const resetCompanyNameCache = () => {
  companyNameCache.clear();
  nameIndex = 0;
};
