"use client";
import { createClient, LiveList, LiveObject } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: process.env.NEXT_PUBLIC_LIVE_BLOCKS_KEY,
});

export type Presence = {
  name: string;
};

export type Map = LiveObject<{ videoId: string }>;

export type Grid = {
  enabled: boolean;
  size: number;
  type: "quad";
  color: string;
  opacity: number;
};

export type GameSurface = {
  width: number;
  height: number;
};

export type Point = [number, number];

export type Stroke = Point[];

export type BrushStroke = {
  pathData: string;
  blurSize: number;
};

export type FogOfWar = {
  enabled: boolean;
  opacity: number;
  brushSize: number;
  blurSize: number;
};

export type Storage = {
  map: Map;
  grid: LiveObject<Grid>;
  gameSurface: LiveObject<GameSurface>;
  fogOfWar: LiveObject<FogOfWar>;
  brushStrokes: LiveList<BrushStroke>;
};

export const initialState: Storage = {
  map: new LiveObject({
    videoId: "",
  }),
  grid: new LiveObject({
    enabled: true,
    size: 20,
    type: "quad",
    color: "white",
    opacity: 0.9,
  }),
  gameSurface: new LiveObject({
    width: 1280,
    height: 720,
  }),
  fogOfWar: new LiveObject({
    enabled: true,
    opacity: 1,
    brushSize: 32,
    blurSize: 10,
  }),
  brushStrokes: new LiveList([]),
};

export const {
  suspense: {
    RoomProvider,
    useOthers,
    useSelf,
    useUpdateMyPresence,
    useStorage,
    useMutation,
  },
} = createRoomContext<Presence, Storage>(client);
