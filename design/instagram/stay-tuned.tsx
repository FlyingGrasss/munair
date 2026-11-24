import { STAY_TUNED } from "./data";

const SANS = "DM Sans";
const LOGO_RATIO = 880 / 385;

const SHARED_TEXT = {
  color: "#f4f8fb",
  fontFamily: SANS,
} as const;

export function StayTunedPost({ assetBaseUrl }: { assetBaseUrl: string }) {
  const logoWidth = 470;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#04080f",
        ...SHARED_TEXT,
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
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: "#8ab7da" }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3 }}>{STAY_TUNED.edition}</span>
          </div>
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 3,
              color: "rgba(244,248,251,0.62)",
            }}
          >
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
          <img
            src={`${assetBaseUrl}/munair_logo_mark.png`}
            alt=""
            width={logoWidth}
            height={Math.round(logoWidth / LOGO_RATIO)}
            style={{ width: logoWidth, height: Math.round(logoWidth / LOGO_RATIO) }}
          />

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
              color: "#8ab7da",
              textTransform: "uppercase",
            }}
          >
            Mark the dates
          </span>
          <span
            style={{
              marginTop: 10,
              fontSize: 128,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -5,
            }}
          >
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
