const SPOTIFY_URL =
  process.env.NEXT_PUBLIC_SPOTIFY_URL ?? "https://open.spotify.com";

export default function SpotifyButton() {
  return (
    <a
      href={SPOTIFY_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open on Spotify in a new tab"
      className="group inline-flex items-center gap-1.5 text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)] transition-opacity duration-200 hover:opacity-85 focus:outline-none select-none"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-white shrink-0">
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.623.623 0 0 1-.857.208c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.87 7.077-.494 9.712 1.115.293.18.386.563.207.856Zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.687-1.652-6.785-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.232 1.329a.78.78 0 0 1 .257 1.072Zm.105-2.834C14.7 8.99 9.475 8.816 6.416 9.745a.935.935 0 1 1-.542-1.79c3.512-1.066 9.283-.86 12.94 1.31a.935.935 0 0 1-.955 1.608l.055-.005Z" />
      </svg>
      <span className="text-[14px] font-semibold text-white tracking-tight sm:text-[15px]">
        Spotify
      </span>
      <span className="text-[12px] font-light text-white/80 transition-transform duration-300 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]">
        ↗
      </span>
    </a>
  );
}
