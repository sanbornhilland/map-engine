"use client";
import { GameSurface } from "@/components/GameSurface";
import { MainMenu } from "@/components/MainMenu";
import { useStorage } from "@/components/Store";

export default function Home() {
  const map = useStorage((storage) => storage.map);

  return (
    <div>
      <MainMenu />
      <GameSurface videoId={map.videoId} />
    </div>
  );
}
