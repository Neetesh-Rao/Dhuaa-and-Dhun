"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Song } from "@/types/music";

export function useMusicPlayer(playlist: Song[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.85);
  const [isChanging, setIsChanging] = useState(false);

  const currentSong = playlist[index];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // load track when index changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    audio.src = currentSong.audioUrl;
    audio.load();
    setCurrentTime(0);
    setDuration(currentSong.duration ?? 0);
    setIsChanging(true);
    const t = setTimeout(() => setIsChanging(false), 420);
    if (isPlaying) {
      void audio.play().catch(() => setIsPlaying(false));
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, currentSong?.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % Math.max(playlist.length, 1));
    setIsPlaying(true);
  }, [playlist.length]);

  const previous = useCallback(() => {
    setIndex((i) => (i - 1 + playlist.length) % Math.max(playlist.length, 1));
    setIsPlaying(true);
  }, [playlist.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => {
      if (Number.isFinite(audio.duration)) setDuration(audio.duration);
    };
    const onEnded = () => next();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [next]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    void audio.play().catch(() => setIsPlaying(false));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else pause();
  }, [play, pause]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, time);
    setCurrentTime(audio.currentTime);
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(Math.min(1, Math.max(0, v)));
  }, []);

  const selectSong = useCallback((songIndex: number) => {
    setIndex(songIndex);
    setIsPlaying(true);
  }, []);

  return useMemo(
    () => ({
      currentSong,
      index,
      isPlaying,
      isChanging,
      currentTime,
      duration,
      volume,
      play,
      pause,
      togglePlay,
      next,
      previous,
      seek,
      setVolume,
      selectSong,
    }),
    [
      currentSong,
      index,
      isPlaying,
      isChanging,
      currentTime,
      duration,
      volume,
      play,
      pause,
      togglePlay,
      next,
      previous,
      seek,
      setVolume,
      selectSong,
    ],
  );
}
