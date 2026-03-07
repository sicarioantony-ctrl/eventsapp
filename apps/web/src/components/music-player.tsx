"use client";

import { useState, useEffect, useRef } from "react";

type Track = { src: string; title: string };

type MusicPlayerProps = { embedded?: boolean };

export function MusicPlayer({ embedded }: MusicPlayerProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const loadPlaylist = () => {
    setLoading(true);
    setLoadError(false);
    fetch("/api/music")
      .then((r) => r.json())
      .then((data) => {
        const list = data.tracks || [];
        if (list.length > 0) {
          setTracks(list);
          setLoading(false);
          return;
        }
        return fetch("/music/playlist.json").then((r2) => r2.json());
      })
      .then((data) => {
        if (data && data.tracks && data.tracks.length > 0) {
          setTracks(data.tracks);
        }
        setLoading(false);
      })
      .catch(() => {
        fetch("/music/playlist.json")
          .then((r) => r.json())
          .then((data) => setTracks(data.tracks || []))
          .catch(() => setLoadError(true))
          .finally(() => setLoading(false));
      });
  };

  useEffect(() => {
    loadPlaylist();
  }, []);

  const currentTrack = tracks[currentIndex];

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    const audio = audioRef.current;

    const updateProgress = () => {
      if (audio.duration) {
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const onEnded = () => {
      setCurrentIndex((i) => (i + 1) % Math.max(1, tracks.length));
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentTrack, tracks.length]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying((p) => !p);
  const nextTrack = () =>
    setCurrentIndex((i) => (i + 1) % Math.max(1, tracks.length));
  const prevTrack = () =>
    setCurrentIndex((i) => (i - 1 + tracks.length) % Math.max(1, tracks.length));

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pct * duration;
    setProgress(pct * 100);
  };

  const formatTime = (sec: number) =>
    `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;

  const containerClass = embedded
    ? `mx-auto flex max-w-2xl flex-col border border-[#e5e5e5] rounded-xl bg-white shadow-lg transition-all duration-300 dark:border-[#333] dark:bg-[#171717] ${
        isExpanded ? "w-full" : "w-[180px]"
      }`
    : `fixed top-20 right-4 z-40 flex flex-col border border-[#e5e5e5] rounded-xl bg-white shadow-xl backdrop-blur transition-all duration-300 dark:border-[#333] dark:bg-[#171717] ${
        isExpanded ? "w-80 max-w-[calc(100vw-2rem)]" : "w-[180px]"
      }`;

  return (
    <div className={containerClass}>
      <audio
        ref={audioRef}
        src={currentTrack?.src}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="flex flex-col">
        {/* Header: collapse + mini controls when collapsed */}
        <div className="flex items-center gap-2 border-b border-[#e5e5e5] px-3 py-2">
          <button
            type="button"
            onClick={() => setIsExpanded((e) => !e)}
            className="shrink-0 rounded-lg p-1.5 text-[#525252] transition hover:bg-[#f5f5f5]"
            aria-label={isExpanded ? "Свернуть" : "Развернуть"}
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? "" : "rotate-180"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {isExpanded && (
            <span className="text-sm font-medium text-[#171717]">
              {loading ? "Загрузка…" : loadError ? "Ошибка" : "Музыка"}
            </span>
          )}
          {!isExpanded && tracks.length > 0 && (
            <>
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6366f1] text-white hover:bg-[#4f46e5]"
              >
                {isPlaying ? (
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="ml-0.5 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7L8 5z" />
                  </svg>
                )}
              </button>
              <span className="min-w-0 truncate text-xs text-[#525252]" title={currentTrack?.title}>
                {currentTrack?.title}
              </span>
            </>
          )}
        </div>

        {isExpanded && (
          <div className="px-4 py-3">
        {loading ? (
          <p className="py-4 text-center text-sm text-[#525252]">Загрузка плейлиста…</p>
        ) : loadError ? (
          <div className="py-4 text-center">
            <p className="text-sm text-[#525252]">Не удалось загрузить плейлист</p>
            <button
              type="button"
              onClick={loadPlaylist}
              className="mt-2 text-sm font-medium text-[#6366f1] hover:underline"
            >
              Повторить
            </button>
          </div>
        ) : tracks.length === 0 ? (
          <p className="py-4 text-center text-sm text-[#525252]">Плейлист пуст</p>
        ) : (
          <>
        {/* Progress bar */}
        <div
          className="mb-3 flex cursor-pointer items-center gap-2"
          onClick={seek}
          role="progressbar"
          aria-valuenow={progress}
        >
          <span className="w-10 text-right text-xs text-[#525252] tabular-nums">
            {formatTime((progress / 100) * duration)}
          </span>
          <div className="h-1.5 flex-1 rounded-full bg-[#e5e5e5] overflow-hidden">
            <div
              className="h-full bg-[#6366f1] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-10 text-xs text-[#525252] tabular-nums">
            {formatTime(duration)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevTrack}
              className="rounded-full p-2 text-[#525252] transition hover:bg-[#f5f5f5] hover:text-[#171717]"
              aria-label="Предыдущий трек"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6366f1] text-white transition hover:bg-[#4f46e5]"
              aria-label={isPlaying ? "Пауза" : "Воспроизведение"}
            >
              {isPlaying ? (
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg
                  className="ml-0.5 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              className="rounded-full p-2 text-[#525252] transition hover:bg-[#f5f5f5] hover:text-[#171717]"
              aria-label="Следующий трек"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Track info */}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#171717]">
              {currentTrack?.title ?? "—"}
            </p>
            <p className="text-xs text-[#525252]">
              {currentIndex + 1} / {tracks.length}
            </p>
          </div>

          {/* Volume */}
          <div className="hidden items-center gap-2 sm:flex">
            <svg
              className="h-4 w-4 text-[#525252]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="h-1.5 w-20 cursor-pointer rounded-full bg-[#e5e5e5] accent-[#6366f1]"
            />
          </div>

          {/* Playlist toggle */}
          <button
            type="button"
            onClick={() => setIsPlaylistOpen((o) => !o)}
            className="rounded-lg p-2 text-[#525252] transition hover:bg-[#f5f5f5] hover:text-[#171717]"
            aria-label="Плейлист"
            title="Плейлист"
          >
            <svg
              className={`h-5 w-5 transition-transform ${isPlaylistOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* Playlist */}
        {isPlaylistOpen && (
          <div className="mt-3 max-h-48 overflow-y-auto rounded-lg border border-[#e5e5e5] bg-[#fafafa]">
            {tracks.map((t, i) => (
              <button
                key={t.src}
                type="button"
                onClick={() => {
                  setCurrentIndex(i);
                  setIsPlaying(true);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-white ${
                  i === currentIndex
                    ? "bg-[#eef2ff] font-medium text-[#6366f1]"
                    : "text-[#525252]"
                }`}
              >
                <span className="w-6 shrink-0 tabular-nums text-xs">
                  {i + 1}.
                </span>
                <span className="truncate">{t.title}</span>
                {i === currentIndex && isPlaying && (
                  <span className="ml-auto shrink-0 text-xs">▶</span>
                )}
              </button>
            ))}
          </div>
        )}
          </>
        )}
          </div>
        )}
      </div>
    </div>
  );
}
