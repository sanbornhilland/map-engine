"use client";
import { GameSurface } from "@/components/GameSurface";
import { MainMenu } from "@/components/MainMenu";
import { useStorage } from "@/components/Store";

export default function Home() {
  const map = useStorage((storage) => storage.map);
  const grid = useStorage((storage) => storage.grid);
  const gameSurface = useStorage((storage) => storage.gameSurface);

  return (
    <div>
      <MainMenu />
      <GameSurface
        videoId={map.videoId}
        gameSurface={gameSurface}
        grid={grid}
      />
    </div>
  );
}
