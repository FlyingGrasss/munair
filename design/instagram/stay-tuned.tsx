import type { ReactNode } from "react";

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

function Progress({ slide }: { slide: number }) {
  return (
    <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          style={{
            display: "flex",
            width: 34,
            height: 2,
            backgroundColor: step === slide ? ACCENT : "rgba(255,255,255,0.22)",
          }}
        />
      ))}
    </div>
  );
}

function Shell({
  slide,
  assetBaseUrl,
  children,
}: {
  slide: number;
  assetBaseUrl: string;
  children: ReactNode;
}) {
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
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1350,
          display: "flex",
          backgroundImage:
            "linear-gradient(165deg, rgba(11,27,49,1) 0%, rgba(5,12,22,1) 52%, rgba(9,24,42,1) 100%)",
        }}
      />
      <img
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(globe)}`}
        alt=""
        width={900}
        height={900}
        style={{ position: "absolute", left: -230, top: 610, width: 900, height: 900, opacity: 0.33 }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "56px 68px 52px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: ACCENT }} />
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 3 }}>{STAY_TUNED.edition}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: 3, color: "rgba(255,255,255,0.55)" }}>
              {STAY_TUNED.city} · TÜRKİYE
            </span>
            <Progress slide={slide} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {children}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <img
              src={`${assetBaseUrl}/munair_logo_mark.png`}
              alt=""
              width={96}
              height={Math.round(96 / LOGO_RATIO)}
              style={{ width: 96, height: Math.round(96 / LOGO_RATIO) }}
            />
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 2, color: "rgba(255,255,255,0.55)" }}>
              modelunair.com · @modelunair
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
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
  );
}

function Teaser({ assetBaseUrl }: { assetBaseUrl: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <img
        src={`${assetBaseUrl}/munair_logo_mark.png`}
        alt=""
        width={360}
        height={Math.round(360 / LOGO_RATIO)}
        style={{ width: 360, height: Math.round(360 / LOGO_RATIO) }}
      />
      <span
        style={{
          marginTop: 40,
          fontSize: 112,
          fontWeight: 700,
          lineHeight: 0.9,
          letterSpacing: -4,
          textTransform: "uppercase",
        }}
      >
        STAY TUNED
      </span>
      <span
        style={{
          marginTop: 24,
          fontSize: 17,
          fontWeight: 500,
          letterSpacing: 5,
          color: "rgba(255,255,255,0.66)",
          textTransform: "uppercase",
        }}
      >
        {STAY_TUNED.kicker}
      </span>
      <div style={{ display: "flex", width: 88, height: 1, marginTop: 48, backgroundColor: "rgba(169,216,255,0.55)" }} />
      <span style={{ marginTop: 20, fontSize: 15, fontWeight: 700, letterSpacing: 7, color: ACCENT, textTransform: "uppercase" }}>
        Mark the dates
      </span>
    </div>
  );
}

function Reveal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: -40 }}>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 6, color: ACCENT, textTransform: "uppercase" }}>
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
      <span style={{ marginTop: 40, fontSize: 40, fontWeight: 700, letterSpacing: -0.5, color: ACCENT }}>
        5 — 6 — 7 MARCH 2027
      </span>
    </div>
  );
}

function Boarding() {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginTop: -20 }}>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 6, color: ACCENT, textTransform: "uppercase" }}>
        Boarding soon
      </span>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: 22,
          fontSize: 166,
          fontWeight: 700,
          lineHeight: 0.84,
          letterSpacing: -9,
          textTransform: "uppercase",
        }}
      >
        <span>SAVE</span>
        <span>THE DATE</span>
      </div>

      <div style={{ display: "flex", marginTop: 52, border: "1px solid rgba(169,216,255,0.45)" }}>
        <div style={{ display: "flex", flex: 1.5, flexDirection: "column", padding: "28px 30px" }}>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: ACCENT }}>DEPARTURE</span>
          <span style={{ marginTop: 10, fontSize: 54, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
            5 — 6 — 7
          </span>
          <span style={{ marginTop: 8, fontSize: 18, fontWeight: 700, letterSpacing: 8 }}>MARCH 2027</span>
        </div>
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            padding: "28px 30px",
            borderLeft: "1px dashed rgba(169,216,255,0.45)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: ACCENT }}>DESTINATION</span>
          <span style={{ marginTop: 10, fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>İZMİR</span>
          <span style={{ marginTop: 6, fontSize: 17, fontWeight: 500, letterSpacing: 4 }}>TÜRKİYE · GATE 27</span>
        </div>
      </div>
    </div>
  );
}

export function StayTunedPost({ slide, assetBaseUrl }: { slide: number; assetBaseUrl: string }) {
  if (slide === 1) {
    return (
      <Shell slide={1} assetBaseUrl={assetBaseUrl}>
        <Teaser assetBaseUrl={assetBaseUrl} />
      </Shell>
    );
  }
  if (slide === 2) {
    return (
      <Shell slide={2} assetBaseUrl={assetBaseUrl}>
        <Reveal />
      </Shell>
    );
  }
  return (
    <Shell slide={3} assetBaseUrl={assetBaseUrl}>
      <Boarding />
    </Shell>
  );
}
