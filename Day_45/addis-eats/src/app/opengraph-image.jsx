import { ImageResponse } from "next/og";

export const alt = "Addis Eats food delivery";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "58px 72px",
        color: "#fff9e9",
        backgroundColor: "#064c32",
        backgroundImage:
          "radial-gradient(circle at 88% 12%, #e9b83d 0, #e9b83d 9%, transparent 9.5%), radial-gradient(circle at 92% 78%, #0c6946 0, #0c6946 18%, transparent 18.5%), linear-gradient(135deg, #073e2c 0%, #075337 52%, #0b6846 100%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", fontSize: 29, fontWeight: 800, letterSpacing: 1.5 }}>
        <div
          style={{
            display: "flex",
            width: 42,
            height: 42,
            marginRight: 16,
            borderRadius: "50%",
            backgroundColor: "#f3c944",
            color: "#075337",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 29,
          }}
        >
          ✦
        </div>
        ADDIS EATS
      </div>

      <div style={{ display: "flex", marginTop: 62, width: "74%", fontSize: 68, lineHeight: 1.06, fontWeight: 800, letterSpacing: -2 }}>
        Authentic Ethiopian food, delivered with flavour.
      </div>
      <div style={{ display: "flex", width: "65%", marginTop: 26, color: "#d6eadc", fontSize: 29, lineHeight: 1.35 }}>
        Discover freshly prepared local favourites from trusted kitchens across Addis Ababa.
      </div>

      <div style={{ display: "flex", alignItems: "center", marginTop: "auto", fontSize: 23, color: "#ecf4d9" }}>
        <div style={{ display: "flex", marginRight: 34 }}>✦ Fresh local dishes</div>
        <div style={{ display: "flex", marginRight: 34 }}>✦ Easy ordering</div>
        <div style={{ display: "flex" }}>✦ Delivered across Addis</div>
      </div>
    </div>,
    size
  );
}
