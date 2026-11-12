import type { ReactNode } from "react";

import { type CommitteeDesign } from "./data";

const SANS = "DM Sans";

type SlideProps = {
  design: CommitteeDesign;
  assetBaseUrl: string;
};

function ImageLayer({
  design,
  assetBaseUrl,
  overlay,
  position,
}: SlideProps & { overlay: number; position: string }) {
  return (
    <>
      <img
        src={`${assetBaseUrl}${design.image}`}
        alt=""
        width={1080}
        height={1350}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1350,
          objectFit: "cover",
          objectPosition: position,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1350,
          display: "flex",
          backgroundColor: "#041426",
          opacity: overlay,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1350,
          display: "flex",
          backgroundImage:
            "linear-gradient(180deg, rgba(3,10,20,0.62) 0%, rgba(3,10,20,0.08) 38%, rgba(3,10,20,0.82) 100%)",
        }}
      />
    </>
  );
}

function Frame({
  children,
  design,
  assetBaseUrl,
  slide,
  overlay,
  position = "center",
}: SlideProps & { children: ReactNode; slide: number; overlay: number; position?: string }) {
  const topLabel =
    slide === 1 ? design.kicker : slide === 2 ? `AGENDA · 02` : `APPLY · 03`;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#03080f",
        color: "#f4f8fb",
        fontFamily: SANS,
      }}
    >
      <ImageLayer design={design} assetBaseUrl={assetBaseUrl} overlay={overlay} position={position} />

      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          bottom: 30,
          left: 30,
          display: "flex",
          border: "1px solid rgba(255,255,255,0.28)",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "52px 64px 44px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", width: 8, height: 8, backgroundColor: design.accent }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
              {topLabel}
            </span>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 3 }}>{"MUNAIR'27"}</span>
        </div>

        {children}

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
            5–6–7 MARCH 2027 · İZMİR
          </span>
        </div>
      </div>
    </div>
  );
}

function Title({ design }: { design: CommitteeDesign }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 940,
        fontSize: design.coverTitleSize,
        fontWeight: 700,
        lineHeight: 0.86,
        letterSpacing: -5,
        textTransform: "uppercase",
      }}
    >
      <span>{design.titleLines[0]}</span>
      {design.titleConnector ? (
        <span
          style={{
            margin: "10px 0",
            fontSize: design.coverTitleSize * 0.38,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: 12,
            color: design.accent,
          }}
        >
          {design.titleConnector}
        </span>
      ) : null}
      {design.titleLines.slice(1).map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  );
}

function Cover({ design, assetBaseUrl }: SlideProps) {
  return (
    <Frame design={design} assetBaseUrl={assetBaseUrl} slide={1} overlay={0.22} position="center">
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Title design={design} />
          <span
            style={{
              marginTop: 22,
              maxWidth: 760,
              fontSize: 21,
              fontWeight: 500,
              lineHeight: 1.4,
              letterSpacing: 2.2,
              color: "rgba(244,248,251,0.72)",
              textTransform: "uppercase",
            }}
          >
            {design.coverSubtitle}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "flex-end", gap: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2.4, color: design.accent }}>
            {design.abbr}
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 2.2, color: "rgba(244,248,251,0.55)" }}>
            COMMITTEE SERIES
          </span>
        </div>
      </div>
    </Frame>
  );
}

function Agenda({ design, assetBaseUrl }: SlideProps) {
  return (
    <Frame design={design} assetBaseUrl={assetBaseUrl} slide={2} overlay={0.36} position="center">
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 104,
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: -4,
            textTransform: "uppercase",
          }}
        >
          <span>{design.slideTwoLabel}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 42 }}>
          {design.agenda.map((item, index) => (
            <div
              key={item}
              style={{
                display: "flex",
                gap: 24,
                borderTop: "1px solid rgba(255,255,255,0.28)",
                padding: "20px 0",
              }}
            >
              <span style={{ width: 42, fontSize: 18, fontWeight: 700, letterSpacing: 1, color: design.accent, paddingTop: 2 }}>
                0{index + 1}
              </span>
              <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
                <span style={{ fontSize: 28, lineHeight: 1.2 }}>{item}</span>
                <span
                  style={{
                    marginTop: 7,
                    maxWidth: 800,
                    fontSize: 17,
                    lineHeight: 1.4,
                    color: "rgba(244,248,251,0.68)",
                  }}
                >
                  {design.agendaDetails[index]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Apply({ design, assetBaseUrl }: SlideProps) {
  return (
    <Frame design={design} assetBaseUrl={assetBaseUrl} slide={3} overlay={0.4} position="center">
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          paddingTop: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 118,
            fontWeight: 700,
            lineHeight: 0.86,
            letterSpacing: -5,
            textTransform: "uppercase",
          }}
        >
          <span>APPLICATIONS</span>
          <span>OPEN</span>
        </div>

        <span
          style={{
            marginTop: 28,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: 3,
            color: "rgba(244,248,251,0.74)",
            textTransform: "uppercase",
          }}
        >
          DELEGATE · CHAIRBOARD · PRESS
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 54 }}>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>modelunair.com</span>
          <span style={{ fontSize: 38, lineHeight: 1 }}>→</span>
        </div>
      </div>
    </Frame>
  );
}

export function CommitteeSlide({ design, slide, assetBaseUrl }: SlideProps & { slide: number }) {
  if (slide === 1) return <Cover design={design} assetBaseUrl={assetBaseUrl} />;
  if (slide === 2) return <Agenda design={design} assetBaseUrl={assetBaseUrl} />;
  return <Apply design={design} assetBaseUrl={assetBaseUrl} />;
}
