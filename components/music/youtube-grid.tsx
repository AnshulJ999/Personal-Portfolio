"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/common/icons";

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
}

interface YouTubeGridProps {
  videos: YouTubeVideo[];
  channelHandle: string;
}

export function YouTubeGrid({ videos, channelHandle }: YouTubeGridProps) {
  const [activeVideo, setActiveVideo] = React.useState<YouTubeVideo | null>(
    null
  );
  const [visibleCount, setVisibleCount] = React.useState(9);

  const visibleVideos = videos.slice(0, visibleCount);
  const hasMore = visibleCount < videos.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleVideos.map((video) => (
          <button
            key={video.id}
            onClick={() => setActiveVideo(video)}
            className="group rounded-xl overflow-hidden border border-border bg-card hover:border-foreground/30 transition-colors text-left"
            aria-label={`Watch: ${video.title}`}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {/* Play overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center shadow">
                  <svg
                    className="h-5 w-5 text-black ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
            {/* Title */}
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-foreground/80 line-clamp-2 leading-snug">
                {video.title}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="rounded-xl group"
          >
            <Icons.chevronDown className="mr-2 h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
            Load More Videos
          </Button>
        </div>
      )}

      {/* Lightbox */}
      <Dialog
        open={!!activeVideo}
        onOpenChange={(open) => !open && setActiveVideo(null)}
      >
        <DialogContent className="max-w-5xl w-[92vw] p-0 overflow-hidden bg-black border-border">
          <DialogTitle className="sr-only">
            {activeVideo?.title ?? "YouTube Video"}
          </DialogTitle>
          {activeVideo && (
            <div className="w-full" style={{ aspectRatio: "16/9", maxHeight: "80vh" }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          {activeVideo && (
            <div className="px-4 py-3 bg-background border-t border-border">
              <p className="text-sm font-medium text-foreground line-clamp-1">
                {activeVideo.title}
              </p>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.id}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 block"
              >
                Watch on YouTube →
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export function YouTubeGridFallback({
  channelHandle,
}: {
  channelHandle: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/40 py-12 text-center">
      <p className="text-sm text-muted-foreground">
        Videos could not be loaded. Visit{" "}
        <a
          href={`https://www.youtube.com/@${channelHandle}`}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="underline hover:text-foreground"
        >
          @{channelHandle}
        </a>{" "}
        on YouTube.
      </p>
    </div>
  );
}
