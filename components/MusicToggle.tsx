"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Volume2, VolumeX, Music } from "lucide-react";
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
  const pathname = usePathname();
  const router = useRouter();

  const musicParam = searchParams.get("music")?.toLowerCase();
  const currentTrack: MusicTrack = musicParam === "yerliplaka" ? TRACKS.yerliplaka : TRACKS.sirens;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTrackMenu, setShowTrackMenu] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;

    // If source changed and was previously playing, continue playing new track
    if (isPlaying) {
      audio.load();
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack.src]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Autoplay / Audio play was prevented:", err);
        setIsPlaying(false);
      }
    }
  };

  const handleTrackSelect = (trackId: "sirens" | "yerliplaka") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("music", trackId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setShowTrackMenu(false);
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
        onPause={() => setIsPlaying(false)}
      >
        <source src={currentTrack.src} type="video/mp4" />
        <source src={currentTrack.src} type="audio/mp4" />
      </audio>

      <div className="flex items-center rounded-sm border border-white/15 bg-white/5 p-0.5">
        <button
          type="button"
          onClick={togglePlayback}
          aria-pressed={isPlaying}
          aria-label={isPlaying ? `Turn music off (${currentTrack.title})` : `Turn music on (${currentTrack.title})`}
          title={isPlaying ? `Mute (${currentTrack.title})` : `Play (${currentTrack.title})`}
          className={cn(
            "group flex h-9 items-center gap-2 rounded-xs px-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--blue-light)]",
            isPlaying
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
              : "text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
          )}
        >
          {isPlaying ? (
            <>
              <Volume2 className="size-4 text-emerald-400 animate-pulse shrink-0" strokeWidth={2.2} />
              <span className="hidden sm:inline text-[10px] font-bold text-emerald-300">
                {currentTrack.id === "yerliplaka" ? "Yerli Plaka" : "Sirens"}
              </span>
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <VolumeX className="size-4 text-red-400/80 group-hover:text-red-400 shrink-0" strokeWidth={2} />
              </div>
              <span className="hidden sm:inline text-[10px] font-medium text-white/50 group-hover:text-white/80">
                Music Off
              </span>
            </>
          )}
        </button>

        {/* Track switch toggle dropdown/button */}
        <button
          type="button"
          onClick={() => setShowTrackMenu((prev) => !prev)}
          aria-label="Switch background track"
          title={`Active track: ${currentTrack.title}. Click to switch (?music=sirens / ?music=yerliplaka)`}
          className="flex h-9 w-7 items-center justify-center text-white/40 hover:text-white hover:bg-white/10 rounded-xs transition-colors border-l border-white/10"
        >
          <Music className="size-3.5" />
        </button>
      </div>

      {/* Track selector dropdown menu */}
      {showTrackMenu && (
        <div
          className="absolute right-0 top-full mt-2 w-48 rounded-md border border-white/15 bg-[var(--night)] p-1.5 shadow-xl backdrop-blur-md z-50"
          role="menu"
        >
          <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-white/40 border-b border-white/10 mb-1">
            Select Track
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleTrackSelect("sirens")}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-left transition-colors",
              currentTrack.id === "sirens"
                ? "bg-[var(--blue)]/30 text-[var(--blue-light)] font-bold"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <span>Sirens</span>
            <span className="text-[9px] opacity-60">?music=sirens</span>
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={() => handleTrackSelect("yerliplaka")}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs text-left transition-colors",
              currentTrack.id === "yerliplaka"
                ? "bg-[var(--blue)]/30 text-[var(--blue-light)] font-bold"
                : "text-white/70 hover:bg-white/10 hover:text-white"
            )}
          >
            <span>Yerli Plaka</span>
            <span className="text-[9px] opacity-60">?music=yerliplaka</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function MusicToggle() {
  return (
    <Suspense
      fallback={
        <div className="flex h-9 w-24 items-center justify-center rounded-sm border border-white/10 bg-white/5 opacity-50">
          <VolumeX className="size-4 text-white/30" />
        </div>
      }
    >
      <MusicToggleContent />
    </Suspense>
  );
}
