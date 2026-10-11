import { dishes } from "./menu/dishes";
import { SITE_URL } from "@/lib/siteUrl";

const siteUrl = SITE_URL;

export default function sitemap() {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/menu`, changeFrequency: "daily", priority: 0.9 },
    ...dishes.map((dish) => ({
      url: `${siteUrl}/menu/${dish.id}`,
      changeFrequency: "weekly",
      priority: 0.8,
      images: [dish.image],
    })),
  ];
}
