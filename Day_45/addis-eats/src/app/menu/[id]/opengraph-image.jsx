import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { findDish } from "../dishes";

export const alt = "Addis Eats dish";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }) {
  const { id } = await params;
  const dish = findDish(id);

  if (!dish) return new Response("Dish not found", { status: 404 });

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const optimizedImageUrl = new URL("/_next/image", `${protocol}://${host}`);
  optimizedImageUrl.searchParams.set("url", dish.image);
  optimizedImageUrl.searchParams.set("w", "1200");
  optimizedImageUrl.searchParams.set("q", "75");

  const imageResponse = await fetch(optimizedImageUrl);
  if (!imageResponse.ok) {
    return new Response("Could not load dish photo", { status: 502 });
  }

  const imageBytes = new Uint8Array(await imageResponse.arrayBuffer());
  let imageBinary = "";
  for (let offset = 0; offset < imageBytes.length; offset += 0x8000) {
    imageBinary += String.fromCharCode(...imageBytes.subarray(offset, offset + 0x8000));
  }
  const image = `data:${imageResponse.headers.get("content-type") || "image/jpeg"};base64,${btoa(imageBinary)}`;

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: "#fffaf1", color: "#172033" }}>
      <div style={{ width: "68%", height: "100%", display: "flex", overflow: "hidden" }}>
        <img
          src={image}
          alt={dish.name}
          width={816}
          height={630}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ width: "32%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "42px", gap: "20px" }}>
        <div style={{ display: "flex", color: "#a9382d", fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>ADDIS EATS</div>
        <div style={{ display: "flex", fontSize: 42, fontWeight: 700, lineHeight: 1.1 }}>{dish.name}</div>
        <div style={{ display: "flex", color: "#a9382d", fontSize: 30, fontWeight: 700 }}>{dish.price} ETB</div>
        <div style={{ display: "flex", color: "#667085", fontSize: 21, lineHeight: 1.35 }}>{dish.summary}</div>
      </div>
    </div>,
    size
  );
}