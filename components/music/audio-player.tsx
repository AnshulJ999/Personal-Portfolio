"use client";

import * as React from "react";

import { Icons } from "@/components/common/icons";
import { WaveformBars } from "@/components/music/waveform-bars";
import { cn } from "@/lib/utils";

interface Track {
  title: string;
  src: string;
  duration?: string;
  downloadable?: boolean;
}

interface TrackPeakData {
  durationLabel: string;
  durationSeconds: number;
  peaks: number[];
  src: string;
}

interface PeakManifest {
  tracks: Record<string, TrackPeakData>;
}

const tracks: Track[] = [
  { title: "Melodic Shred Solo in Dm (Original)", src: "/music/melodic-shred-solo-dm.mp3", duration: "0:48" },
  { title: "Thrash Metal Song Demo", src: "/music/thrash-metal-song-demo.mp3", duration: "3:36" },
  { title: "Progressive Metal Song Demo", src: "/music/progressive-metal-song-demo.mp3", duration: "4:58" },
  { title: "Slow Composition in Dm (Original)", src: "/music/slow-composition-dm.mp3", duration: "5:20" },
  { title: "Periphery – Luck As A Constant (Solo Cover)", src: "/music/periphery-luck-as-a-constant-solo.mp3", duration: "1:25" },
  { title: "Original Blues Solo (Demo)", src: "/music/original-blues-solo.mp3", duration: "0:58" },
  { title: "Indian Orchestral Film Score", src: "/music/indian-orchestral-film-score.mp3", duration: "2:03" },
];

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer() {
  const [currentTrack, setCurrentTrack] = React.useState<number | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [trackPeaks, setTrackPeaks] = React.useState<Record<string, TrackPeakData>>({});
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    fetch("/music/peaks/index.json")
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to load peaks: ${response.status}`);
        return response.json() as Promise<PeakManifest>;
      })
      .then((data) => {
        if (!cancelled) setTrackPeaks(data.tracks ?? {});
      })
      .catch(() => {
        if (!cancelled) setTrackPeaks({});
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const play = (index: number) => {
    if (currentTrack === index) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      audioRef.current?.pause();
      setCurrentTime(0);
      setDuration(0);
      setCurrentTrack(index);
      setIsPlaying(true);
    }
  };

  // Load + play when track changes
  React.useEffect(() => {
    if (currentTrack === null || !audioRef.current) return;
    audioRef.current.src = tracks[currentTrack].src;
    audioRef.current.play().catch(() => setIsPlaying(false));
  }, [currentTrack]);

  // Wire up audio events
  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      setCurrentTrack((prev) => {
        if (prev === null) return null;
        return prev + 1 < tracks.length ? prev + 1 : 0;
      });
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("loadedmetadata", onDurationChange);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("loadedmetadata", onDurationChange);
    };
  }, []);

  const seekTo = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Track list */}
      <ul className="divide-y divide-border">
        {tracks.map((track, i) => {
          const active = currentTrack === i;
          const fileName = track.src.split("/").pop() ?? "";
          const peakData = trackPeaks[fileName];
          const displayDuration = peakData?.durationLabel ?? track.duration;
          const playbackProgress =
            active && duration > 0 ? currentTime / duration : 0;

          return (
            <li key={i}>
              {/* ── Compact track row (always shown) ── */}
              <button
                onClick={() => play(i)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors",
                  "hover:bg-muted/60",
                  active && "bg-muted",
                )}
                aria-label={`${active && isPlaying ? "Pause" : "Play"} ${track.title}`}
              >
                {/* Play / pause icon */}
                <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-background border border-border">
                  {active && isPlaying ? (
                    <Icons.pause className="h-3.5 w-3.5 text-foreground" />
                  ) : (
                    <Icons.play className="h-3.5 w-3.5 text-foreground ml-0.5" />
                  )}
                </div>

                {/* Title */}
                <span
                  className={cn(
                    "flex-1 text-sm font-medium truncate",
                    active ? "text-foreground" : "text-foreground/70",
                  )}
                >
                  {track.title}
                </span>

                {/* Time: elapsed / total when active, just duration when inactive */}
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                  {active
                    ? `${formatTime(currentTime)} / ${displayDuration ?? formatTime(duration)}`
                    : displayDuration}
                </span>

                {/* Download button (if downloadable) */}
                {track.downloadable && (
                  <a
                    href={track.src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                    aria-label={`Download ${track.title}`}
                    title="Download"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                  </a>
                )}
              </button>

              {/* ── Waveform seekbar — only on active track ── */}
              {active && (
                <div className="px-5 pb-4 bg-muted">
                  {peakData ? (
                    <WaveformBars
                      peaks={peakData.peaks}
                      progress={playbackProgress}
                      onSeek={(p) => seekTo(p * duration)}
                    />
                  ) : (
                    /* Fallback: plain range input if peak data not loaded */
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={(e) => seekTo(parseFloat(e.target.value))}
                      aria-label="Seek"
                      className={cn(
                        "w-full h-1.5 rounded-full appearance-none cursor-pointer bg-border",
                        "[&::-webkit-slider-thumb]:appearance-none",
                        "[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3",
                        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground",
                        "[&::-webkit-slider-thumb]:cursor-pointer",
                      )}
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
