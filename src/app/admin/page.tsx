"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Song } from "@/types/music";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [submittingSong, setSubmittingSong] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Songs list state
  const [songsList, setSongsList] = useState<Song[]>([]);
  const [loadingSongs, setLoadingSongs] = useState(false);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem("admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
      void fetchSongs();
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoadingLogin(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
        void fetchSongs();
      } else {
        setLoginError(data.error || "Invalid password");
      }
    } catch {
      setLoginError("Failed to connect to authentication server");
    } finally {
      setLoadingLogin(false);
    }
  }

  function handleLogout() {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_auth");
    setPassword("");
  }

  async function fetchSongs() {
    setLoadingSongs(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      if (data.success && Array.isArray(data.songs)) {
        setSongsList(data.songs);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingSongs(false);
    }
  }

  async function handleAudioUpload(file: File) {
    setUploadingAudio(true);
    setStatusMessage("Uploading audio file to Cloudinary...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/audio", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setAudioUrl(data.secure_url);
        setStatusMessage("✅ Audio uploaded successfully to Cloudinary!");
      } else {
        setStatusMessage(`❌ Audio upload error: ${data.error || "Failed"}`);
      }
    } catch {
      setStatusMessage("❌ Audio upload failed.");
    } finally {
      setUploadingAudio(false);
    }
  }

  async function handleCoverUpload(file: File) {
    setUploadingCover(true);
    setStatusMessage("Uploading thumbnail image to Cloudinary...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/cover", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setCoverUrl(data.secure_url);
        setStatusMessage("✅ Cover thumbnail uploaded successfully to Cloudinary!");
      } else {
        setStatusMessage(`❌ Cover upload error: ${data.error || "Failed"}`);
      }
    } catch {
      setStatusMessage("❌ Cover thumbnail upload failed.");
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleAddSong(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !artist || !audioUrl || !coverUrl) {
      setStatusMessage("⚠️ Please fill in song title, artist, audio URL, and cover image.");
      return;
    }

    setSubmittingSong(true);
    setStatusMessage("Saving song to MongoDB database...");

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          artist,
          audioUrl,
          coverUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage("🎉 Song added successfully to MongoDB and player!");
        setTitle("");
        setArtist("");
        setAudioUrl("");
        setCoverUrl("");
        setAudioFile(null);
        setCoverFile(null);
        void fetchSongs();
      } else {
        setStatusMessage(`❌ Failed to save song: ${data.error}`);
      }
    } catch {
      setStatusMessage("❌ Failed to save song to database.");
    } finally {
      setSubmittingSong(false);
    }
  }

  async function handleDeleteSong(song: Song) {
    const targetId = song.id || song.title;
    if (!targetId) return;

    if (!confirm(`Are you sure you want to delete "${song.title}" from database?`)) return;

    // Optimistic UI removal
    setSongsList((prev) =>
      prev.filter((s) => (s.id ? s.id !== song.id : s.title !== song.title))
    );

    try {
      const res = await fetch(`/api/songs/${encodeURIComponent(targetId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`🗑️ Song "${song.title}" deleted from MongoDB.`);
        void fetchSongs();
      } else {
        alert(data.error || "Failed to delete song from database");
        void fetchSongs();
      }
    } catch {
      alert("Error deleting song from database");
      void fetchSongs();
    }
  }

  return (
    <main className="relative min-h-[100svh] w-full bg-[#120908] text-white selection:bg-[#e2432f]/40 px-4 py-8 sm:px-8">
      {/* Top Navbar */}
      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/90 transition hover:bg-white/20"
          >
            ← Back to App
          </Link>
          <h1 className="text-lg font-bold tracking-wide sm:text-xl text-white">
            Admin Portal <span className="text-xs text-rose-400 font-normal">Cloudinary & MongoDB</span>
          </h1>
        </div>

        {isAuthenticated && (
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20 cursor-pointer"
          >
            Logout
          </button>
        )}
      </header>

      {/* Password Authentication Screen */}
      {!isAuthenticated ? (
        <div className="mx-auto mt-16 max-w-md rounded-2xl border border-white/15 bg-[rgba(35,18,15,0.7)] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl">
              🔒
            </div>
            <h2 className="mt-3 text-xl font-bold">Admin Authentication</h2>
            <p className="mt-1 text-xs text-white/60">
              Enter your admin password from <code className="text-amber-300">.env</code> to manage songs
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-white/80">
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                required
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-rose-400 focus:outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs font-medium text-rose-400">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loadingLogin}
              className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {loadingLogin ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      ) : (
        /* Admin Dashboard View */
        <div className="mx-auto mt-8 max-w-5xl space-y-8">
          {/* Add New Song Section */}
          <section className="rounded-2xl border border-white/15 bg-[rgba(35,18,15,0.65)] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <h2 className="text-lg font-semibold tracking-wide text-white">
              ➕ Add New Song (MongoDB & Cloudinary)
            </h2>
            <p className="mt-0.5 text-xs text-white/60">
              Upload MP3 & artwork directly to Cloudinary, then save to your MongoDB collection.
            </p>

            <form onSubmit={handleAddSong} className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="song-title" className="block text-xs font-medium text-white/80">
                    Song Title *
                  </label>
                  <input
                    id="song-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tujhe Dekha To Yeh Jaana Sanam"
                    required
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-white/35 focus:border-rose-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="artist-name" className="block text-xs font-medium text-white/80">
                    Artist / Singer Name *
                  </label>
                  <input
                    id="artist-name"
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    placeholder="e.g. Kumar Sanu & Lata Mangeshkar"
                    required
                    className="mt-1.5 w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-sm text-white placeholder-white/35 focus:border-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* MP3 File / Audio URL */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <label className="block text-xs font-medium text-white/90">
                  🎵 MP3 Audio Track
                </label>

                <div className="grid gap-3 sm:grid-cols-2 items-center">
                  <div>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setAudioFile(f);
                          void handleAudioUpload(f);
                        }
                      }}
                      className="block w-full text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/25"
                    />
                    {uploadingAudio && (
                      <p className="mt-1 text-[11px] text-amber-300 animate-pulse">
                        Uploading MP3 to Cloudinary...
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="url"
                      value={audioUrl}
                      onChange={(e) => setAudioUrl(e.target.value)}
                      placeholder="Or paste MP3 URL directly..."
                      className="w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/35 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Cover Artwork / Thumbnail */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                <label className="block text-xs font-medium text-white/90">
                  🖼️ Thumbnail Cover Art Image
                </label>

                <div className="grid gap-3 sm:grid-cols-2 items-center">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          setCoverFile(f);
                          void handleCoverUpload(f);
                        }
                      }}
                      className="block w-full text-xs text-white/70 file:mr-3 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/25"
                    />
                    {uploadingCover && (
                      <p className="mt-1 text-[11px] text-amber-300 animate-pulse">
                        Uploading image to Cloudinary...
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      value={coverUrl}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="Or paste artwork URL (e.g. /artwork/ddlj.jpg)..."
                      className="w-full rounded-xl border border-white/20 bg-black/40 px-3.5 py-2 text-xs text-white placeholder-white/35 focus:border-rose-400 focus:outline-none"
                    />
                  </div>
                </div>

                {coverUrl && (
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/20">
                      <Image
                        src={coverUrl}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-emerald-400">Thumbnail Ready</span>
                  </div>
                )}
              </div>

              {statusMessage && (
                <div className="rounded-xl bg-white/10 px-4 py-2.5 text-xs text-white font-medium">
                  {statusMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={submittingSong || uploadingAudio || uploadingCover}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                {submittingSong ? "Saving Song..." : "Save Song to MongoDB & Player"}
              </button>
            </form>
          </section>

          {/* Manage Existing Songs List */}
          <section className="rounded-2xl border border-white/15 bg-[rgba(35,18,15,0.65)] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-wide text-white">
                🎶 Existing Songs in MongoDB ({songsList.length})
              </h2>
              <button
                type="button"
                onClick={() => void fetchSongs()}
                className="rounded-lg bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 cursor-pointer"
              >
                Refresh List
              </button>
            </div>

            {loadingSongs ? (
              <p className="mt-4 text-xs text-white/60">Loading songs from MongoDB...</p>
            ) : songsList.length === 0 ? (
              <p className="mt-4 text-xs text-white/60">No songs found in database.</p>
            ) : (
              <div className="mt-4 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-black/30">
                {songsList.map((song) => (
                  <div
                    key={song.id || song.title}
                    className="flex flex-wrap items-center justify-between gap-3 p-3.5 transition hover:bg-white/5 sm:p-4"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/20">
                        <Image
                          src={song.coverUrl || "/main.png"}
                          alt={song.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">
                          {song.title}
                        </p>
                        <p className="truncate text-xs text-white/60">
                          {song.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <audio
                        src={song.audioUrl}
                        controls
                        className="h-8 max-w-[180px] sm:max-w-[220px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteSong(song)}
                        className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-medium text-rose-300 border border-rose-500/30 transition hover:bg-rose-500/40 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
