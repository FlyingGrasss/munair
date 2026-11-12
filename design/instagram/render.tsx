import type { CSSProperties, ReactNode } from "react";

import { DRAGON_SVG_DATA_URI } from "./assets";
import { INSTAGRAM_COLORS as C, type CommitteeDesign } from "./data";

const SANS = "DM Sans";
const SERIF = "DM Serif Display";

type Tone = "dark" | "light";

function TopBar({ design, tone }: { design: CommitteeDesign; tone: Tone }) {
  const muted = tone === "dark" ? "rgba(234,242,247,0.62)" : "rgba(16,25,35,0.58)";
  const rule = tone === "dark" ? "rgba(138,183,218,0.24)" : "rgba(16,25,35,0.16)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: 22,
        borderBottom: `1px solid ${rule}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", width: 10, height: 10, backgroundColor: C.blue }} />
        <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: 3.4 }}>{"MUNAIR'27"}</span>
      </div>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2.4, color: muted }}>
        COMMITTEE SERIES · {design.order}
      </span>
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2.4, color: muted }}>İZMİR · 2027</span>
    </div>
  );
}

function BottomBar({ design, slide, tone }: { design: CommitteeDesign; slide: number; tone: Tone }) {
  const muted = tone === "dark" ? "rgba(234,242,247,0.58)" : "rgba(16,25,35,0.54)";
  const rule = tone === "dark" ? "rgba(138,183,218,0.24)" : "rgba(16,25,35,0.16)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 18,
        borderTop: `1px solid ${rule}`,
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: muted }}>
        {design.motto.toUpperCase()}
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: muted }}>
        MODEL UNITED NATIONS OF AVIATION
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, color: muted }}>
        {String(slide).padStart(2, "0")} / 03
      </span>
    </div>
  );
}

function DragonWatermark({
  width,
  style,
  opacity,
}: {
  width: number;
  style: CSSProperties;
  opacity: number;
}) {
  const height = Math.round(width * (468.1142857142857 / 400));
  return (
    <img
      src={DRAGON_SVG_DATA_URI}
      alt=""
      width={width}
      height={height}
      style={{ position: "absolute", objectFit: "contain", opacity, ...style }}
    />
  );
}

function WordmarkWatermark({ design, tone }: { design: CommitteeDesign; tone: Tone }) {
  return (
    <div
      style={{
        position: "absolute",
        right: -30,
        bottom: 100,
        width: 980,
        display: "flex",
        justifyContent: "flex-end",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontFamily: SERIF,
          fontSize: 300,
          lineHeight: 0.8,
          letterSpacing: -14,
          color: tone === "dark" ? C.blueLight : C.blue,
          opacity: 0.055,
          whiteSpace: "nowrap",
        }}
      >
        {design.abbr}
      </span>
    </div>
  );
}

function Chrome({
  design,
  slide,
  tone,
  children,
}: {
  design: CommitteeDesign;
  slide: number;
  tone: Tone;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  const background = slide === 2 ? C.ice : slide === 3 ? C.navy : C.night;
  const foreground = dark ? C.ice : C.ink;
  const rule = dark ? "rgba(138,183,218,0.24)" : "rgba(16,25,35,0.16)";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        backgroundColor: background,
        color: foreground,
        fontFamily: SANS,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 700,
          display: "flex",
          backgroundImage: dark
            ? "linear-gradient(180deg, rgba(21,107,201,0.26) 0%, rgba(5,8,13,0) 100%)"
            : "linear-gradient(180deg, rgba(21,107,201,0.10) 0%, rgba(234,242,247,0) 100%)",
        }}
      />

      {design.watermark === "dragon" ? (
        <DragonWatermark
          width={slide === 1 ? 900 : slide === 2 ? 620 : 760}
          opacity={slide === 1 ? 0.12 : slide === 2 ? 0.035 : 0.07}
          style={{
            left: slide === 1 ? 90 : slide === 2 ? 420 : 460,
            top: slide === 1 ? 195 : slide === 2 ? 160 : 150,
          }}
        />
      ) : (
        <WordmarkWatermark design={design} tone={tone} />
      )}

      <div
        style={{
          position: "absolute",
          top: 30,
          right: 30,
          bottom: 30,
          left: 30,
          display: "flex",
          border: `1px solid ${rule}`,
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "60px 68px 50px",
        }}
      >
        <TopBar design={design} tone={tone} />
        {children}
        <BottomBar design={design} slide={slide} tone={tone} />
      </div>
    </div>
  );
}

function SlideOne({ design }: { design: CommitteeDesign }) {
  const hasConnector = Boolean(design.titleConnector);
  const titleSize = design.titleLines.length === 1 ? 176 : 168;

  return (
    <Chrome design={design} slide={1} tone="dark">
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          paddingBottom: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 124,
            height: 124,
            borderRadius: 62,
            border: `1px solid ${design.accent}`,
            backgroundColor: design.accentSoft,
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: 31, lineHeight: 1, color: C.ice }}>{design.abbr}</span>
        </div>

        <span
          style={{
            marginTop: 28,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 4.2,
            color: C.blueLight,
            textTransform: "uppercase",
          }}
        >
          {design.kicker}
        </span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 30 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: titleSize,
              lineHeight: 0.79,
              letterSpacing: -6,
            }}
          >
            {design.titleLines[0]}
          </div>

          {hasConnector ? (
            <div style={{ display: "flex", alignItems: "center", gap: 20, margin: "20px 0" }}>
              <div style={{ width: 72, height: 1, backgroundColor: design.accent }} />
              <span
                style={{
                  fontSize: 23,
                  fontWeight: 700,
                  letterSpacing: 11,
                  color: design.accent,
                  textTransform: "uppercase",
                }}
              >
                {design.titleConnector}
              </span>
              <div style={{ width: 72, height: 1, backgroundColor: design.accent }} />
            </div>
          ) : null}

          {design.titleLines.slice(1).map((line) => (
            <div
              key={line}
              style={{
                fontFamily: SERIF,
                fontSize: titleSize,
                lineHeight: 0.79,
                letterSpacing: -6,
                marginTop: hasConnector ? 0 : 8,
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 46 }}>
          <div style={{ width: 30, height: 1, backgroundColor: C.blueLight, opacity: 0.55 }} />
          <span
            style={{
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 2.6,
              color: "rgba(234,242,247,0.76)",
              textTransform: "uppercase",
            }}
          >
            {design.tagline}
          </span>
          <div style={{ width: 30, height: 1, backgroundColor: C.blueLight, opacity: 0.55 }} />
        </div>
      </div>
    </Chrome>
  );
}

function FactionCard({
  card,
  index,
  compact,
}: {
  card: CommitteeDesign["cards"][number];
  index: number;
  compact: boolean;
}) {
  const ghost = card.label.replace(/^the /i, "").charAt(0);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flex: 1,
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: card.background,
        color: card.foreground,
        padding: compact ? "24px 24px" : "28px 30px",
        borderTop: `4px solid ${card.rule}`,
      }}
    >
      <span
        style={{
          position: "absolute",
          right: -8,
          bottom: -58,
          fontFamily: SERIF,
          fontSize: compact ? 220 : 290,
          lineHeight: 0.8,
          color: card.foreground,
          opacity: 0.07,
        }}
      >
        {ghost}
      </span>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: compact ? 18 : 22,
            fontWeight: 700,
            letterSpacing: compact ? 2.2 : 3,
            opacity: 0.76,
            textTransform: "uppercase",
          }}
        >
          {card.label}
        </span>
        <span style={{ fontSize: compact ? 14 : 16, fontWeight: 700, letterSpacing: 2, opacity: 0.5 }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <span
        style={{
          position: "relative",
          marginTop: compact ? 18 : 26,
          fontFamily: SERIF,
          fontSize: compact ? 32 : 42,
          lineHeight: 1.02,
        }}
      >
        {card.title}
      </span>
      <span
        style={{
          position: "relative",
          marginTop: 12,
          maxWidth: 360,
          fontSize: compact ? 18 : 22,
          lineHeight: 1.42,
          opacity: 0.82,
        }}
      >
        {card.detail}
      </span>
      {card.body ? (
        <span
          style={{
            position: "relative",
            marginTop: compact ? 14 : 20,
            maxWidth: 350,
            fontSize: compact ? 17 : 20,
            lineHeight: 1.45,
            opacity: 0.7,
          }}
        >
          {card.body}
        </span>
      ) : null}

      <div style={{ position: "relative", display: "flex", flexDirection: "column", marginTop: compact ? 18 : 28, paddingTop: 18 }}>
        <span
          style={{
            fontSize: compact ? 13 : 14,
            fontWeight: 700,
            letterSpacing: 2.2,
            opacity: 0.52,
            marginBottom: 6,
          }}
        >
          KEY TERMS
        </span>
        {card.points.map((point) => (
          <div
            key={point}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              padding: "9px 0",
            }}
          >
            <span style={{ fontSize: compact ? 16 : 19, fontWeight: 500, opacity: 0.86 }}>{point}</span>
            <span style={{ fontSize: compact ? 13 : 14, opacity: 0.42 }}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTwo({ design }: { design: CommitteeDesign }) {
  const compact = design.cards.length > 2;
  return (
    <Chrome design={design} slide={2} tone="light">
      <div style={{ display: "flex", flex: 1, flexDirection: "column", paddingTop: 46 }}>
        <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2.8, color: C.blue }}>
          THE COMMITTEE · 02
        </span>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 16,
            fontFamily: SERIF,
            fontSize: 104,
            lineHeight: 0.91,
            letterSpacing: -4,
            color: C.ink,
          }}
        >
          {design.slideTwoTitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <p
          style={{
            margin: "26px 0 0",
            maxWidth: 880,
            fontSize: 26,
            lineHeight: 1.5,
            color: "#3f4e5c",
          }}
        >
          {design.intro}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(16,25,35,0.18)",
            paddingBottom: 14,
            marginTop: 30,
            marginBottom: 16,
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2.6, color: C.blue }}>
            {design.slideTwoLabel}
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: 1.8, color: C.muted }}>
            {design.year} · {design.yearLabel}
          </span>
        </div>

        <div style={{ display: "flex", flex: 1, gap: 16 }}>
          {design.cards.map((card, index) => (
            <FactionCard key={card.label} card={card} index={index} compact={compact} />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2.2, color: C.muted }}>
            {design.slideTwoFooter}
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2.2, color: C.muted }}>
            {design.abbr}
          </span>
        </div>
      </div>
    </Chrome>
  );
}

function AgendaRow({
  index,
  title,
  detail,
  accent,
}: {
  index: string;
  title: string;
  detail: string;
  accent: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 24,
        borderTop: "1px solid rgba(138,183,218,0.24)",
        padding: "22px 0",
      }}
    >
      <span style={{ width: 40, fontSize: 19, fontWeight: 700, letterSpacing: 1.2, color: accent, paddingTop: 5 }}>
        {index}
      </span>
      <div style={{ display: "flex", flex: 1, flexDirection: "column" }}>
        <span style={{ fontSize: 31, lineHeight: 1.2, color: C.ice }}>{title}</span>
        <span
          style={{
            marginTop: 8,
            maxWidth: 820,
            fontSize: 20,
            lineHeight: 1.4,
            color: "rgba(234,242,247,0.7)",
          }}
        >
          {detail}
        </span>
      </div>
    </div>
  );
}

function MetaStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div
      style={{
        display: "flex",
        borderTop: "1px solid rgba(138,183,218,0.24)",
        borderBottom: "1px solid rgba(138,183,218,0.24)",
        marginTop: 28,
      }}
    >
      {items.map((item, index) => (
        <div
          key={item.label}
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            borderLeft: index === 0 ? "none" : "1px solid rgba(138,183,218,0.24)",
            padding: "17px 22px",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 2, color: "rgba(234,242,247,0.56)" }}>
            {item.label}
          </span>
          <span style={{ marginTop: 6, fontFamily: SERIF, fontSize: 24, lineHeight: 1, color: C.ice }}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function SlideThree({ design }: { design: CommitteeDesign }) {
  return (
    <Chrome design={design} slide={3} tone="dark">
      <div style={{ display: "flex", flex: 1, flexDirection: "column", paddingTop: 46 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 2.8, color: design.accent }}>
            THE AGENDA · 03
          </span>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2.2, color: C.blueLight }}>
            5–6–7 MARCH 2027 · İZMİR
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 18,
            fontFamily: SERIF,
            fontSize: 120,
            lineHeight: 0.85,
            letterSpacing: -4.6,
          }}
        >
          {design.slideThreeTitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 30 }}>
          {design.agenda.map((item, i) => (
            <AgendaRow
              key={item}
              index={String(i + 1).padStart(2, "0")}
              title={item}
              detail={design.agendaDetails[i]}
              accent={design.accent}
            />
          ))}
        </div>

        <MetaStrip items={design.meta} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(138,183,218,0.24)",
            padding: "22px 0",
            marginTop: 26,
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: 44, lineHeight: 1.1, color: C.ice }}>
            {design.slideThreeQuote}
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: 2.6, color: C.blueLight }}>
            {design.motto.toUpperCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto", paddingTop: 24, marginBottom: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: C.blue,
              padding: "24px 30px",
              borderTop: `4px solid ${design.accent}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 29, fontWeight: 700, letterSpacing: 1.2, color: C.white }}>
                APPLICATIONS OPEN
              </span>
              <span
                style={{
                  marginTop: 6,
                  fontSize: 20,
                  fontWeight: 500,
                  letterSpacing: 1.2,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                modelunair.com · @modelunair
              </span>
            </div>
            <span style={{ fontSize: 42, lineHeight: 1, color: C.white }}>→</span>
          </div>
        </div>
      </div>
    </Chrome>
  );
}

export function CommitteeSlide({ design, slide }: { design: CommitteeDesign; slide: number }) {
  if (slide === 1) return <SlideOne design={design} />;
  if (slide === 2) return <SlideTwo design={design} />;
  return <SlideThree design={design} />;
}
