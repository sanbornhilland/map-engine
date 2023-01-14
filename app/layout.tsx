"use client";

import "./globals.css";

import { initialState, RoomProvider } from "@/components/Store";
import { ClientSideSuspense } from "@liveblocks/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <RoomProvider
          id="room"
          initialPresence={{ name: "Uknown" }}
          initialStorage={initialState}
        >
          <ClientSideSuspense fallback={null}>
            {() => children}
          </ClientSideSuspense>
        </RoomProvider>
      </body>
    </html>
  );
}
