"use client";

import { useState } from "react";

import { Icons } from "@/components/common/icons";
import { ProjectVideo } from "@/config/projects";

interface VideoEmbedProps {
  video: ProjectVideo;
  className?: string;
}

export default function VideoEmbed({ video, className = "" }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  // ── YouTube ──────────────────────────────────────────────────────────────
  if (video.type === "youtube") {
    const embedUrl = `https://www.youtube-nocookie.com/embed/${video.src}?autoplay=1&rel=0&modestbranding=1&color=white`;

    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-border bg-muted aspect-video ${className}`}
      >
        {playing ? (
          <iframe
            src={embedUrl}
            title="Project demo video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer"
            aria-label="Play project demo video"
          >
            {/* Thumbnail or gradient placeholder */}
            {video.thumbnail ? (
              <img
                src={video.thumbnail}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-secondary" />
            )}

            {/* Dark scrim on hover */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-200" />

            {/* Play button */}
            <div className="relative z-10 flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background/90 border border-border shadow-lg group-hover:scale-110 transition-transform duration-200">
                <Icons.play className="w-6 h-6 ml-1 text-foreground" />
              </div>
              <span className="text-sm font-medium text-white drop-shadow-md">
                Watch Demo
              </span>
            </div>
          </button>
        )}
      </div>
    );
  }

  // ── Local MP4 — autoplay silent loop (GIF-like) ──────────────────────────
  if (video.type === "mp4") {
    return (
      <div
        className={`relative w-full overflow-hidden rounded-xl border border-border bg-muted aspect-video ${className}`}
      >
        <video
          poster={video.thumbnail}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={video.showControls}
          controlsList="nodownload"
          disablePictureInPicture
          className="absolute inset-0 w-full h-full object-contain"
        >
          {video.srcAv1 && (
            <source src={video.srcAv1} type='video/mp4; codecs="av01.0.05M.08"' />
          )}
          <source src={video.src} type="video/mp4" />
        </video>
      </div>
    );
  }

  return null;
}

// ── Placeholder shown when no video is set yet ────────────────────────────

export function VideoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-border bg-muted aspect-video flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <Icons.video className="w-10 h-10 text-muted-foreground" />
      <p className="text-sm text-muted-foreground font-medium">
        Demo video coming soon
      </p>
    </div>
  );
}
