import Image from "next/image";
import LiveClock from "@/components/LiveClock";
import MusicPlayer from "@/components/MusicPlayer";
import OnlineUsers from "@/components/OnlineUsers";
import SpotifyButton from "@/components/SpotifyButton";
import YTMusicButton from "@/components/YTMusicButton";

export default function Home() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[#1a0d0b]">
      {/* Background Image */}
      <Image
        src="/main.png"
        alt="Main background artwork"
        fill
        priority
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Header Bar */}
      <header className="relative z-20 flex items-center justify-between gap-3 px-4 pt-4 sm:px-7 sm:pt-6">
        <LiveClock />

        <div className="absolute left-1/2 top-4 -translate-x-1/2 sm:top-6">
          <OnlineUsers />
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          <SpotifyButton />
          <YTMusicButton />
        </div>
      </header>

      {/* Floating Music Player */}
      <MusicPlayer />
    </main>
  );
}
