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

function Logo({ assetBaseUrl, width }: { assetBaseUrl: string; width: number }) {
  return (
    <img
      src={`${assetBaseUrl}/munair_logo_mark.png`}
      alt=""
      width={width}
      height={Math.round(width / LOGO_RATIO)}
      style={{ width, height: Math.round(width / LOGO_RATIO) }}
    />
  );
}

function ClassicPost({ assetBaseUrl }: { assetBaseUrl: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#04080f",
        color: "#f4f8fb",
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
            "linear-gradient(165deg, rgba(9,22,38,1) 0%, rgba(5,12,22,1) 46%, rgba(9,24,42,1) 76%, rgba(4,8,15,1) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          bottom: 30,
          left: 30,
          display: "flex",
          border: "1px solid rgba(255,255,255,0.26)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "space-between",
          padding: "52px 64px 46px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: ACCENT }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3 }}>{STAY_TUNED.edition}</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: 3, color: "rgba(244,248,251,0.62)" }}>
            {STAY_TUNED.city} · TÜRKİYE
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 40,
          }}
        >
          <Logo assetBaseUrl={assetBaseUrl} width={470} />

          <span
            style={{
              marginTop: 52,
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
              marginTop: 26,
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: 5,
              color: "rgba(244,248,251,0.66)",
              textTransform: "uppercase",
            }}
          >
            {STAY_TUNED.kicker}
          </span>

          <div
            style={{
              display: "flex",
              width: 88,
              height: 1,
              marginTop: 62,
              backgroundColor: "rgba(138,183,218,0.55)",
            }}
          />
          <span
            style={{
              marginTop: 24,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: 7,
              color: ACCENT,
              textTransform: "uppercase",
            }}
          >
            Mark the dates
          </span>
          <span style={{ marginTop: 10, fontSize: 128, fontWeight: 700, lineHeight: 1, letterSpacing: -5 }}>
            5 — 6 — 7
          </span>
          <span
            style={{
              marginTop: 4,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: 12,
              color: "rgba(244,248,251,0.86)",
            }}
          >
            MARCH 2027
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 18,
            borderTop: "1px solid rgba(255,255,255,0.22)",
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: 1.4, color: "rgba(244,248,251,0.64)" }}>
            modelunair.com · @modelunair
          </span>
          <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: 1.4, color: "rgba(244,248,251,0.64)" }}>
            APPLICATIONS OPENING SOON
          </span>
        </div>
      </div>
    </div>
  );
}

function EditorialPost({ assetBaseUrl }: { assetBaseUrl: string }) {
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
        width={860}
        height={860}
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
          <span style={{ marginTop: 42, fontSize: 40, fontWeight: 700, letterSpacing: -0.5, color: ACCENT }}>
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

        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Logo assetBaseUrl={assetBaseUrl} width={96} />
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

function BoardingPost({ assetBaseUrl }: { assetBaseUrl: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#08162a",
        color: "#ffffff",
        fontFamily: SANS,
      }}
    >
      <img
        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(globe)}`}
        alt=""
        width={900}
        height={900}
        style={{ position: "absolute", right: -300, top: 590, width: 900, height: 900, opacity: 0.3 }}
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

        <div style={{ display: "flex", flexDirection: "column", marginTop: 104 }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 6, color: ACCENT, textTransform: "uppercase" }}>
            Boarding soon
          </span>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 22,
              fontSize: 176,
              fontWeight: 700,
              lineHeight: 0.84,
              letterSpacing: -9,
              textTransform: "uppercase",
            }}
          >
            <span>SAVE</span>
            <span>THE DATE</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            border: "1px solid rgba(169,216,255,0.45)",
          }}
        >
          <div style={{ display: "flex", flex: 1.5, flexDirection: "column", padding: "30px 32px" }}>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: ACCENT }}>DEPARTURE</span>
            <span style={{ marginTop: 10, fontSize: 56, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
              5 — 6 — 7
            </span>
            <span style={{ marginTop: 8, fontSize: 19, fontWeight: 700, letterSpacing: 8 }}>MARCH 2027</span>
          </div>
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              padding: "30px 32px",
              borderLeft: "1px dashed rgba(169,216,255,0.45)",
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 4, color: ACCENT }}>DESTINATION</span>
            <span style={{ marginTop: 10, fontSize: 46, fontWeight: 700, letterSpacing: -1 }}>İZMİR</span>
            <span style={{ marginTop: 6, fontSize: 18, fontWeight: 500, letterSpacing: 4 }}>TÜRKİYE · GATE 27</span>
          </div>
        </div>

        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Logo assetBaseUrl={assetBaseUrl} width={96} />
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
              Model United Nations of Aviation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StayTunedPost({ slide, assetBaseUrl }: { slide: number; assetBaseUrl: string }) {
  if (slide === 1) return <ClassicPost assetBaseUrl={assetBaseUrl} />;
  if (slide === 2) return <EditorialPost assetBaseUrl={assetBaseUrl} />;
  return <BoardingPost assetBaseUrl={assetBaseUrl} />;
}
