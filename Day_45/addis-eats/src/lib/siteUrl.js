// Centralised production site URL
// Filters out obsolete or misspelled Vercel domain values set in environment variables
function getValidSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()?.replace(/\/+$/, "");
  if (!envUrl) return "https://addis-eats-advanced.vercel.app";

  // Filter out outdated / invalid domain names
  if (
    envUrl === "https://addis-eats.vercel.app" ||
    envUrl === "http://addis-eats.vercel.app" ||
    envUrl.includes("addis-eats-nextjsd45-advanced-proje.vercel.app")
  ) {
    return "https://addis-eats-advanced.vercel.app";
  }

  return envUrl;
}

export const SITE_URL = getValidSiteUrl();
