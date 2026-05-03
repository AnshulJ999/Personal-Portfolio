"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface WaveformBarsProps {
  peaks: number[];
  progress?: number;
  onSeek?: (progress: number) => void;
  className?: string;
}

export function WaveformBars({
  peaks,
  progress = 0,
  onSeek,
  className,
}: WaveformBarsProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const clampedProgress = Math.max(0, Math.min(progress, 1));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(p);
  };

  const drawWaveform = React.useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || peaks.length === 0) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = rect.width;
    const height = rect.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const renderBarCount = Math.min(
      peaks.length,
      Math.max(160, Math.floor(width * 0.5))
    );
    const bucketWidth = width / renderBarCount;
    const visualBarWidth = Math.max(
      0.95,
      Math.min(1.7, bucketWidth * 0.90)
    );
    const centerY = height / 2;
    const maxBarHeight = height * 0.95;

    for (let index = 0; index < renderBarCount; index += 1) {
      const startIndex = Math.floor((index / renderBarCount) * peaks.length);
      const endIndex = Math.max(
        startIndex + 1,
        Math.floor(((index + 1) / renderBarCount) * peaks.length)
      );

      let peak = 0;
      for (let peakIndex = startIndex; peakIndex < endIndex; peakIndex += 1) {
        peak = Math.max(peak, peaks[peakIndex] ?? 0);
      }

      const isPlayed = (index + 1) / renderBarCount <= clampedProgress;
      const amplitude = Math.pow(Math.max(4, peak) / 100, 0.9);
      const barHeight = Math.max(2, amplitude * maxBarHeight);
      const halfBarHeight = barHeight / 2;
      const x = index * bucketWidth + (bucketWidth - visualBarWidth) / 2;

      ctx.fillStyle = isPlayed ? "rgba(0, 0, 0, 1)" : "rgba(23, 23, 23, 0.2)";
      ctx.fillRect(x, centerY - halfBarHeight, visualBarWidth, barHeight);
    }
  }, [clampedProgress, peaks]);

  React.useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      drawWaveform();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [drawWaveform]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex h-12 items-center overflow-hidden sm:h-14",
        onSeek && "cursor-pointer",
        className,
      )}
      onClick={handleClick}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
