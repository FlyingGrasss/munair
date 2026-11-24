import { STAY_TUNED } from "./data";

const SANS = "DM Sans";
const LOGO_RATIO = 880 / 385;
const ACCENT = "#a9d8ff";

const globe = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none" stroke="#4f7fae" stroke-width="2">',
  '<circle cx="400" cy="400" r="320" opacity=".55"/>',
  '<ellipse cx="400" cy="400" rx="320" ry="110" opacity=".55"/>',
  '<ellipse cx="400" cy="400" rx="320" ry="220" opacity=".55"/>',
  '<ellipse cx="400" cy="400" rx="110" ry="320" opacity=".55"/>',
  '<ellipse cx="400" cy="400" rx="220" ry="320" opacity=".55"/>',
  '<path d="M80 400h640M400 80v640" opacity=".55"/>',
  "</svg>",
].join("");

export function StayTunedPost({ assetBaseUrl }: { assetBaseUrl: string }) {
  const logoWidth = 96;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0d1c33",
        color: "#ffffff",
        fontFamily: SANS,
      }}
    >
      <img
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(globe)}`}
        alt=""
        width={900}
        height={900}
        style={{ position: "absolute", left: -230, top: 610, width: 860, height: 860, opacity: 0.42 }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "64px 68px 60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: ACCENT }} />
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>{STAY_TUNED.edition}</span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: 3, color: "rgba(255,255,255,0.55)" }}>
            {STAY_TUNED.city} · TÜRKİYE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 118 }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 6,
              color: ACCENT,
              textTransform: "uppercase",
            }}
          >
            The countdown begins
          </span>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 22,
              fontSize: 206,
              fontWeight: 700,
              lineHeight: 0.82,
              letterSpacing: -11,
              textTransform: "uppercase",
            }}
          >
            <span>STAY</span>
            <span>TUNED</span>
          </div>

          <span
            style={{
              marginTop: 42,
              fontSize: 40,
              fontWeight: 700,
              letterSpacing: -0.5,
              color: ACCENT,
            }}
          >
            5 — 6 — 7 MARCH 2027
          </span>

          <span
            style={{
              marginTop: 18,
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: 4.5,
              color: "rgba(255,255,255,0.58)",
              textTransform: "uppercase",
            }}
          >
            {STAY_TUNED.kicker}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <img
                src={`${assetBaseUrl}/munair_logo_mark.png`}
                alt=""
                width={logoWidth}
                height={Math.round(logoWidth / LOGO_RATIO)}
                style={{ width: logoWidth, height: Math.round(logoWidth / LOGO_RATIO) }}
              />
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 2, color: "rgba(255,255,255,0.55)" }}>
                modelunair.com · @modelunair
              </span>
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: 4,
                color: ACCENT,
                textTransform: "uppercase",
              }}
            >
              Applications opening soon
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
