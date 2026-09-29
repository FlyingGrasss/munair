"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

type MusicTrack = {
  id: "sirens" | "yerliplaka";
  title: string;
  src: string;
};

const TRACKS: Record<string, MusicTrack> = {
  sirens: {
    id: "sirens",
    title: "Sirens",
    src: "/music/sirens.mp4",
  },
  yerliplaka: {
    id: "yerliplaka",
    title: "Yerli Plaka",
    src: "/music/yerliplaka.mp4",
  },
};

function MusicToggleContent() {
  const searchParams = useSearchParams();
  const musicParam = searchParams.get("music")?.toLowerCase();
  const currentTrack: MusicTrack = musicParam === "yerliplaka" ? TRACKS.yerliplaka : TRACKS.sirens;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const userMutedRef = useRef(false);

  // Handle autoplay and track switching
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    // If user explicitly muted, do not autoplay
    if (userMutedRef.current) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    const startPlay = () => {
      if (userMutedRef.current) return;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay was blocked by browser policy without user gesture
          setIsPlaying(false);

          const unlockOnInteraction = () => {
            if (userMutedRef.current) return;
            audio
              .play()
              .then(() => {
                setIsPlaying(true);
              })
              .catch(() => {});
          };

          window.addEventListener("click", unlockOnInteraction, { once: true });
          window.addEventListener("keydown", unlockOnInteraction, { once: true });
          window.addEventListener("touchstart", unlockOnInteraction, { once: true });
          window.addEventListener("scroll", unlockOnInteraction, { once: true });
        });
    };

    startPlay();
  }, [currentTrack.src]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      userMutedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      userMutedRef.current = false;
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Audio playback failed:", err);
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="relative inline-flex items-center">
      <audio
        ref={audioRef}
        src={currentTrack.src}
        loop
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          if (userMutedRef.current) {
            setIsPlaying(false);
          }
        }}
      >
        <source src={currentTrack.src} type="video/mp4" />
        <source src={currentTrack.src} type="audio/mp4" />
      </audio>

      <button
        type="button"
        onClick={togglePlayback}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? `Mute music (${currentTrack.title})` : `Play music (${currentTrack.title})`}
        title={isPlaying ? `Mute (${currentTrack.title})` : `Play (${currentTrack.title})`}
        className={cn(
          "grid size-11 place-items-center border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--blue)]",
          isPlaying
            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            : "border-white/25 bg-white/5 text-white/50 hover:bg-white/10 hover:text-red-400"
        )}
      >
        {isPlaying ? (
          <Volume2 className="size-5 text-emerald-400" strokeWidth={2} />
        ) : (
          <VolumeX className="size-5 text-red-400" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}

export default function MusicToggle() {
  return (
    <Suspense
      fallback={
        <div className="grid size-11 place-items-center border border-white/20 bg-white/5 opacity-50">
          <VolumeX className="size-5 text-white/30" />
        </div>
      }
    >
      <MusicToggleContent />
    </Suspense>
  );
}
