"use client";

import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Music Player
 *
 * A collapsible, glassmorphic music player with a compact 70px bar height
 * and a flush progress slider with a perfectly centered white knob.
 */

export interface MusicTrack {
  /** Track title shown in the player. */
  title: string;
  /** Artist / author name shown under the title. */
  artist: string;
  /** URL of the audio file. Must be same-origin or CORS-enabled to stream. */
  src: string;
  /** Optional per-track artwork; falls back to the player `avatar`. */
  artwork?: string;
}

export interface MusicPlayerProps {
  /** Playlist to play through. The player renders nothing when empty. */
  tracks: MusicTrack[];
  /** Floating avatar image. Falls back to the current track's `artwork`. */
  avatar?: string;
  /** Index of the track to start on. Defaults to 0. */
  startIndex?: number;
  /** Begin playing as soon as the player mounts. Defaults to false. */
  autoPlay?: boolean;
  /** Wrap from the last track back to the first when a track ends. Defaults to true. */
  loop?: boolean;
  /** Render collapsed (compact pill) on first paint. Defaults to false. */
  defaultCollapsed?: boolean;
  /** Show the seekable progress bar along the bottom edge. Defaults to true. */
  showProgress?: boolean;
  /** Accent color for the equalizer and progress fill. Defaults to `currentColor`. */
  accentColor?: string;
  /** Called whenever the active track changes, with the track and its index. */
  onTrackChange?: (track: MusicTrack, index: number) => void;
  /** Extra class names for the root element. */
  className?: string;
}

const EQ_BARS = [0, 1, 2, 3];

/** Shared equalizer keyframes — identical across instances, so safe to repeat. */
const EQ_KEYFRAMES =
  "@keyframes vengeance-eq{0%,100%{transform:scaleY(0.28)}50%{transform:scaleY(1)}}";

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function clampIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export function MusicPlayer({
  tracks,
  avatar,
  startIndex = 0,
  autoPlay = false,
  loop = true,
  defaultCollapsed = false,
  showProgress = true,
  accentColor,
  onTrackChange,
  className,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(() => clampIndex(startIndex, tracks.length));
  const [isPlaying, setIsPlaying] = useState(false);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const shouldPlayRef = useRef(autoPlay);
  const onTrackChangeRef = useRef(onTrackChange);
  useEffect(() => {
    onTrackChangeRef.current = onTrackChange;
  }, [onTrackChange]);

  const track = tracks[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    audio.src = track.src;
    audio.load();
    setCurrentTime(0);
    onTrackChangeRef.current?.(track, index);

    if (shouldPlayRef.current) {
      audio.play().catch(() => {});
    }
  }, [index, track?.src]);

  const play = useCallback(() => {
    shouldPlayRef.current = true;
    audioRef.current?.play().catch(() => {});
  }, []);

  const pause = useCallback(() => {
    shouldPlayRef.current = false;
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    if (tracks.length === 0) return;
    shouldPlayRef.current = true;
    setIndex((i) => (i + 1) % tracks.length);
  }, [tracks.length]);

  const prev = useCallback(() => {
    if (tracks.length === 0) return;
    shouldPlayRef.current = true;
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }, [tracks.length]);

  const handleEnded = useCallback(() => {
    if (!loop && index === tracks.length - 1) {
      shouldPlayRef.current = false;
      setIsPlaying(false);
      return;
    }
    next();
  }, [loop, index, tracks.length, next]);

  if (tracks.length === 0 || !track) return null;

  const accent = accentColor ?? "#ff6a00";
  const artwork = avatar ?? track.artwork;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={cn(
        "relative select-none text-white transition-[width] duration-700 ease-out",
        collapsed ? "w-[200px]" : "w-[min(480px,92vw)]",
        className,
      )}
    >
      <style>{EQ_KEYFRAMES}</style>

      <audio
        ref={audioRef}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
      />

      {/* Collapse / expand toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? "Expand player" : "Collapse player"}
        aria-expanded={!collapsed}
        className="absolute -right-3 -top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        {collapsed ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
      </button>

      {/* Floating avatar */}
      {artwork ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={artwork}
          alt={`${track.title} artwork`}
          className="absolute -top-4 left-0 z-30 h-16 w-16 rounded-xl object-cover shadow-xl shadow-black/40 ring-1 ring-white/20 sm:-top-5 sm:h-20 sm:w-20"
        />
      ) : null}

      {/* Compact Glass Player Bar */}
      <div className="relative flex h-[70px] items-center gap-2.5 rounded-xl border border-white/18 bg-black/30 pl-18 pr-3.5 backdrop-blur-md sm:gap-3.5 sm:pl-24 sm:pr-5">
        {/* Equalizer */}
        <div className="flex h-8 shrink-0 items-end gap-[3.5px]" aria-hidden="true">
          {EQ_BARS.map((bar) => (
            <span
              key={bar}
              className="block w-[3.5px] rounded-full"
              style={{
                height: "100%",
                background: accent,
                transformOrigin: "bottom",
                animation: `vengeance-eq ${0.9 + bar * 0.18}s ease-in-out infinite`,
                animationPlayState: isPlaying ? "running" : "paused",
                transform: isPlaying ? undefined : "scaleY(0.28)",
              }}
            />
          ))}
        </div>

        {/* Track info + controls */}
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-3.5 transition-opacity duration-300",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
          style={{ transitionDelay: collapsed ? "0s" : "0.35s" }}
        >
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold uppercase tracking-wide text-white">
              {track.title}
            </div>
            <div className="truncate text-[0.65rem] uppercase tracking-[0.18em] text-white/60">
              {track.artist}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous track"
              className="rounded-full p-1.5 opacity-85 transition hover:bg-white/15 hover:opacity-100 cursor-pointer"
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="rounded-full p-1.5 opacity-95 transition hover:bg-white/15 hover:opacity-100 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next track"
              className="rounded-full p-1.5 opacity-85 transition hover:bg-white/15 hover:opacity-100 cursor-pointer"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Seekable Progress Bar - Flush at bottom border */}
        {showProgress && !collapsed ? (
          <div className="group absolute inset-x-0 bottom-0 z-30 flex h-3.5 cursor-pointer items-end">
            {/* Orange Progress Line (Height 4px flush with bottom border) */}
            <div className="relative h-[4px] w-full overflow-hidden rounded-b-xl bg-white/20 transition-all group-hover:h-[5px]">
              <div
                className="absolute inset-y-0 left-0 rounded-b-xl transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%`, background: accent }}
              />
            </div>

            {/* White Circle Knob (Dead-centered vertically on the 4px orange line) */}
            <div
              className="absolute bottom-[2px] h-3.5 w-3.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-white shadow-lg z-40 transition-transform group-hover:scale-125 pointer-events-none"
              style={{ left: `${progress}%` }}
            />

            {/* Interactive Seek Input */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.1}
              value={Math.min(currentTime, duration || 0)}
              onChange={(e) => {
                const audio = audioRef.current;
                if (!audio) return;
                const newTime = Number(e.target.value);
                audio.currentTime = newTime;
                setCurrentTime(newTime);
              }}
              aria-label="Seek track position"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 z-50 focus:outline-none"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MusicPlayer;
