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

export type Storage = {
  map: Map;
};

export const initialState: Storage = {
  map: new LiveObject({
    videoId: "",
  }),
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
