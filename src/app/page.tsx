import Image from "next/image";
import LiveClock from "@/components/LiveClock";
import MusicPlayer from "@/components/MusicPlayer";
import OnlineUsers from "@/components/OnlineUsers";
import SpotifyButton from "@/components/SpotifyButton";
import YTMusicButton from "@/components/YTMusicButton";

export default function Home() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-[#120706]">
      {/* Background Artwork Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Ambient Blur Fill for Mobile Viewports */}
        <Image
          src="/main.png"
          alt=""
          fill
          priority
          quality={30}
          sizes="100vw"
          className="object-cover opacity-50 blur-2xl scale-110 sm:hidden"
        />

        {/* Full Crisp Artwork Poster (Unclipped on Mobile, Full Cover on Desktop) */}
        <Image
          src="/main.png"
          alt="Main background artwork"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-contain object-center sm:object-cover"
        />

        {/* Subtle Dark Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none" />
      </div>

      {/* Responsive Header Bar */}
      <header className="relative z-20 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-3.5 sm:px-7 sm:pt-6">
        <div className="flex items-center gap-3">
          <LiveClock />
          <div className="sm:absolute sm:left-1/2 sm:top-6 sm:-translate-x-1/2">
            <OnlineUsers />
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <SpotifyButton />
          <YTMusicButton />
        </div>
      </header>

      {/* Floating Music Player */}
      <MusicPlayer />
    </main>
  );
}
