import { SITE_URL } from "@/lib/siteUrl";

const siteUrl = SITE_URL;

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/kitchen", "/orders", "/signin", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
