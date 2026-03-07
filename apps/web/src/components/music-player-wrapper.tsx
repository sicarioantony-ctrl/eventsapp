"use client";

import { MusicPlayer } from "./music-player";
import { MusicPlayerErrorBoundary } from "./music-player-error-boundary";

type Props = { embedded?: boolean };

export function MusicPlayerWrapper({ embedded }: Props) {
  return (
    <MusicPlayerErrorBoundary>
      <MusicPlayer embedded={embedded} />
    </MusicPlayerErrorBoundary>
  );
}
