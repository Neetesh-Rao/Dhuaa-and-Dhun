const YTMUSIC_URL =
  process.env.NEXT_PUBLIC_YTMUSIC_URL ?? "https://music.youtube.com";

export default function YTMusicButton() {
  return (
    <a
      href={YTMUSIC_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open on YouTube Music in a new tab"
      className="group inline-flex items-center gap-1.5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] transition-opacity duration-200 hover:opacity-85 focus:outline-none select-none"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-white shrink-0">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-1 7V9l4 3-4 2z" />
      </svg>
      <span className="text-[14px] font-semibold text-white tracking-tight sm:text-[15px]">
        YT Music
      </span>
      <span className="text-[12px] font-light text-white/80 transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
        ↗
      </span>
    </a>
  );
}
