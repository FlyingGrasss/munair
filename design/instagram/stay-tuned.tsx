import type { ReactNode } from "react";

import { STAY_TUNED } from "./data";

const FONT = "Ricordo";
const LOGO_RATIO = 880 / 385;
const INK = "#0c2b4c";
const BLUE = "#1a6cae";

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DATES = Array.from({ length: 31 }, (_, index) => index + 1);

function Panel({
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
        backgroundColor: "#cfe2f0",
        color: INK,
        fontFamily: FONT,
      }}
    >
      <img
        src={`${assetBaseUrl}/design/instagram/stay-bg-${slide}.jpg`}
        alt=""
        width={1080}
        height={1350}
        style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1350, objectFit: "cover" }}
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
            backgroundColor: "rgba(8,32,56,0.42)",
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
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: BLUE }} />
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: 3 }}>{STAY_TUNED.edition}</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 3, color: "rgba(12,43,76,0.62)" }}>
            0{slide} / 03
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}

function Identity({ assetBaseUrl }: { assetBaseUrl: string }) {
  const width = 600;

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
      <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: 8, color: BLUE, textTransform: "uppercase" }}>
        Stay tuned
      </span>
      <img
        src={`${assetBaseUrl}/munair_logo_mark_dark.png`}
        alt=""
        width={width}
        height={Math.round(width / LOGO_RATIO)}
        style={{ marginTop: 46, width, height: Math.round(width / LOGO_RATIO) }}
      />
      <span style={{ marginTop: 42, fontSize: 27, fontWeight: 500, letterSpacing: 2, color: INK }}>
        #wingsofdiplomacy
      </span>
    </div>
  );
}

function Statement() {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", marginTop: -30 }}>
      <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: 8, color: BLUE, textTransform: "uppercase" }}>
        Something is coming
      </span>
      <div
        style={{
          display: "flex",
          marginTop: 26,
          marginLeft: -34,
          fontSize: 148,
          fontWeight: 700,
          lineHeight: 0.88,
          letterSpacing: -6,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        EXPECT
      </div>
      <div
        style={{
          display: "flex",
          marginTop: -10,
          marginLeft: -20,
          fontSize: 186,
          fontWeight: 700,
          lineHeight: 0.88,
          letterSpacing: -3,
          textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}
      >
        THE WIND
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 34 }}>
        <div style={{ display: "flex", width: 56, height: 2, backgroundColor: BLUE }} />
        <span style={{ fontSize: 24, fontWeight: 500, letterSpacing: 5, color: BLUE }}>5 — 6 — 7 MARCH 2027</span>
      </div>
    </div>
  );
}

function Calendar() {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "center", marginTop: -20 }}>
      <span style={{ fontSize: 58, fontWeight: 700, letterSpacing: -1, color: BLUE }}>MUNAIR'27</span>

      <div style={{ display: "flex", marginTop: 24 }}>
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 500,
              letterSpacing: 2,
              color: "rgba(12,43,76,0.66)",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
        {[0, 7, 14, 21, 28].map((start) => (
          <div key={start} style={{ display: "flex", height: 76 }}>
            {DATES.slice(start, start + 7).map((date) => {
              const active = date >= 5 && date <= 7;
              return (
                <div
                  key={date}
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active ? BLUE : "transparent",
                    color: active ? "#ffffff" : INK,
                    fontSize: 42,
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {date}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 22 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 106, fontWeight: 700, lineHeight: 0.9, letterSpacing: -4, color: "#a8dcf8" }}>
            MARCH
          </span>
          <span style={{ marginTop: 8, fontSize: 20, fontWeight: 500, letterSpacing: 2, color: "#ffffff" }}>
            {STAY_TUNED.city} · TÜRKİYE
          </span>
        </div>
        <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: 2, color: "rgba(255,255,255,0.82)" }}>
          #wingsofdiplomacy
        </span>
      </div>
    </div>
  );
}

export function StayTunedPost({ slide, assetBaseUrl }: { slide: number; assetBaseUrl: string }) {
  if (slide === 1) {
    return (
      <Panel slide={1} assetBaseUrl={assetBaseUrl}>
        <Identity assetBaseUrl={assetBaseUrl} />
      </Panel>
    );
  }
  if (slide === 2) {
    return (
      <Panel slide={2} assetBaseUrl={assetBaseUrl}>
        <Statement />
      </Panel>
    );
  }
  return (
    <Panel slide={3} assetBaseUrl={assetBaseUrl}>
      <Calendar />
    </Panel>
  );
}
