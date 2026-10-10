import { ImageResponse } from "next/og";
import sharp from "sharp";
import { findDish } from "../dishes";

export const alt = "Addis Eats dish";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }) {
  const { id } = await params;
  const dish = findDish(id);

  if (!dish) return new Response("Dish not found", { status: 404 });

  const imageResponse = await fetch(dish.image);
  if (!imageResponse.ok) {
    return new Response("Could not load dish photo", { status: 502 });
  }

  const imageBytes = await sharp(Buffer.from(await imageResponse.arrayBuffer()))
    .resize(816, 630, { fit: "cover" })
    .jpeg({ quality: 82 })
    .toBuffer();
  const image = `data:image/jpeg;base64,${imageBytes.toString("base64")}`;

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