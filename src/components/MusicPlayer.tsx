"use client";

import { useEffect, useState } from "react";
import { MusicPlayer as VengenceMusicPlayer, type MusicTrack } from "@/components/ui/music-player";
import type { Song } from "@/types/music";

export default function MusicPlayer() {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const res = await fetch("/api/songs");
        const data = await res.json();
        if (data.success && Array.isArray(data.songs)) {
          setPlaylist(data.songs);
        }
      } catch {
        // Ignore network errors
      } finally {
        setIsLoaded(true);
      }
    }

    void fetchSongs();

    const handleFocus = () => {
      void fetchSongs();
    };

    window.addEventListener("focus", handleFocus);
    const interval = setInterval(fetchSongs, 5000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, []);

  const tracks: MusicTrack[] = playlist.map((s) => ({
    title: s.title,
    artist: s.artist,
    src: s.audioUrl,
    artwork: s.coverUrl ?? "/main.png",
  }));

  if (!isLoaded || tracks.length === 0) return null;

  return (
    <div className="fixed inset-x-3 bottom-6 z-30 flex justify-center sm:inset-x-0 sm:bottom-10 pointer-events-none">
      <div className="pointer-events-auto">
        <VengenceMusicPlayer
          tracks={tracks}
          accentColor="#ff6a00"
          autoPlay={false}
          loop={true}
        />
      </div>
    </div>
  );
}
