"use client";
import YouTube from "react-youtube";

export type MapProps = {
  videoId: string;
};

export function Map({ videoId }: MapProps) {
  return (
    <div>
      <YouTube
        videoId={videoId}
        opts={{
          playerVars: {
            controls: 0,
            autoplay: 1,
            modestbranding: 1,
            loop: 1,
            playlist: videoId,
          },
        }}
      />
    </div>
  );
}

export type GameSurfaceProps = {
  videoId?: string;
};

export function GameSurface({ videoId }: GameSurfaceProps) {
  return <>{videoId ? <Map videoId={videoId} /> : null}</>;
}
