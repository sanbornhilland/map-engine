"use client";
import { GameSurface } from "@/components/GameSurface";
import { MainMenu } from "@/components/MainMenu";
import { useStorage } from "@/components/Store";
import { isViewer } from "@/components/utils";

export default function Home() {
  const map = useStorage((storage) => storage.map);
  const grid = useStorage((storage) => storage.grid);
  const gameSurface = useStorage((storage) => storage.gameSurface);

  return (
    <div>
      {!isViewer() ? <MainMenu /> : null}
      <GameSurface
        videoId={map.videoId}
        gameSurface={gameSurface}
        grid={grid}
      />
    </div>
  );
}
