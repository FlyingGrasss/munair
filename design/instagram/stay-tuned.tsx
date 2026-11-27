import type { ReactNode } from "react";

import { STAY_TUNED } from "./data";

const FONT = "Ricordo";
const INK = "#eaf4fb";
const ACCENT = "#7fc8ff";

function Panel({
  slide,
  variant,
  assetBaseUrl,
  children,
}: {
  slide: number;
  variant: number;
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
        backgroundColor: "#04101e",
        color: INK,
        fontFamily: FONT,
        textShadow: "0px 2px 12px rgba(0, 6, 18, 0.55)",
      }}
    >
      <img
        src={`${assetBaseUrl}/design/instagram/stay-bg-v${variant}-${slide}.jpg`}
        alt=""
        width={1080}
        height={1350}
        style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1350, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1350,
          display: "flex",
          backgroundColor: "#020812",
          opacity: 0.22,
        }}
      />
      {slide < 3 ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 3,
            height: 1350,
            display: "flex",
            backgroundColor: "rgba(180,220,255,0.18)",
          }}
        />
      ) : null}

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "52px 62px 50px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: ACCENT }} />
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: 3 }}>{STAY_TUNED.edition}</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 3, color: "rgba(234,244,251,0.6)" }}>
            0{slide} / 03
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}

function Identity({ assetBaseUrl }: { assetBaseUrl: string }) {
  const width = 920;
  const height = 258;

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: 7, color: INK }}>MUNAIR'27</span>
      <img
        src={`${assetBaseUrl}/design/instagram/stay-emblem-twowings.png`}
        alt=""
        width={width}
        height={height}
        style={{ marginTop: 34, width, height, opacity: 0.9 }}
      />
      <span style={{ marginTop: 30, fontSize: 38, fontWeight: 500, letterSpacing: 4, color: ACCENT }}>
        #wingsofdiplomacy
      </span>
    </div>
  );
}

function Statement() {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", marginTop: -30 }}>
      <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: 8, color: ACCENT, textTransform: "uppercase" }}>
        Storm is coming
      </span>
      <div
        style={{
          display: "flex",
          marginTop: 26,
          marginLeft: 30,
          fontSize: 178,
          fontWeight: 700,
          lineHeight: 0.88,
          letterSpacing: -5,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        EXPECT
      </div>
      <div
        style={{
          display: "flex",
          marginTop: -18,
          marginLeft: 46,
          fontSize: 390,
          fontWeight: 700,
          lineHeight: 0.82,
          letterSpacing: -8,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        US
      </div>
    </div>
  );
}

function Dates() {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", marginTop: -20 }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 292,
          fontWeight: 700,
          lineHeight: 0.8,
          letterSpacing: -8,
          color: INK,
        }}
      >
        <span>5</span>
        <span>6</span>
        <span>7</span>
      </div>
      <span style={{ marginTop: 16, fontSize: 178, fontWeight: 700, lineHeight: 0.9, letterSpacing: -3, color: "#9fc9e8" }}>
        MARCH
      </span>
      <span
        style={{
          marginTop: 26,
          fontSize: 24,
          fontWeight: 500,
          letterSpacing: 5,
          color: "rgba(234,244,251,0.7)",
          textTransform: "uppercase",
        }}
      >
        {STAY_TUNED.city} · TÜRKİYE — MUNAIR'27
      </span>
    </div>
  );
}

export function StayTunedPost({
  slide,
  variant,
  assetBaseUrl,
}: {
  slide: number;
  variant: number;
  assetBaseUrl: string;
}) {
  if (slide === 1) {
    return (
      <Panel slide={1} variant={variant} assetBaseUrl={assetBaseUrl}>
        <Identity assetBaseUrl={assetBaseUrl} />
      </Panel>
    );
  }
  if (slide === 2) {
    return (
      <Panel slide={2} variant={variant} assetBaseUrl={assetBaseUrl}>
        <Statement />
      </Panel>
    );
  }
  return (
    <Panel slide={3} variant={variant} assetBaseUrl={assetBaseUrl}>
      <Dates />
    </Panel>
  );
}
