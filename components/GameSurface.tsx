"use client";
import gameSurfaceStyles from "./GameSurface.module.css";

import { useEffect, useRef } from "react";
import YouTube from "react-youtube";
import { GameSurface, Grid } from "./Store";

export type MapProps = {
  videoId: string;
  width: number;
  height: number;
};

export function Map({ videoId, width, height }: MapProps) {
  return (
    <div>
      <YouTube
        videoId={videoId}
        opts={{
          width,
          height,
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

function drawQuadGrid({
  width,
  height,
  size,
  color,
  context,
}: {
  width: number;
  height: number;
  size: number;
  color: string;
  context: CanvasRenderingContext2D;
}) {
  context.lineWidth = 1;
  context.strokeStyle = color;

  for (let i = size; i < width; i += size) {
    context.beginPath();
    context.moveTo(i, 0);
    context.lineTo(i, height);
    context.closePath();
    context.stroke();

    context.beginPath();
    context.moveTo(0, i);
    context.lineTo(width, i);
    context.closePath();
    context.stroke();
  }
}

export type GridProps = {
  width: number;
  height: number;
  size: number;
  color: string;
  opacity: number;
};

export function Grid({ width, height, size, color, opacity }: GridProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    console.log(ref.current);
    if (!ref.current) {
      return;
    }

    const context = ref.current.getContext("2d");

    if (!context) {
      return;
    }

    context.clearRect(0, 0, ref.current.width, ref.current.height);

    drawQuadGrid({
      width,
      height,
      size,
      context,
      color,
    });
  }, [ref.current, width, height, size, color]);

  return (
    <canvas
      width={width}
      height={height}
      ref={ref}
      className={gameSurfaceStyles.gridCanvas}
      style={{ opacity }}
    />
  );
}

export type GameSurfaceProps = {
  videoId?: string;
  grid: Grid;
  gameSurface: GameSurface;
};

export function GameSurface({ videoId, grid, gameSurface }: GameSurfaceProps) {
  return (
    <div
      className={gameSurfaceStyles.gameSurface}
      style={{
        width: gameSurface.width,
        height: gameSurface.height,
      }}
    >
      <div className={gameSurfaceStyles.gameSurfaceComponent}>
        {videoId ? (
          <Map
            videoId={videoId}
            width={gameSurface.width}
            height={gameSurface.height}
          />
        ) : null}
      </div>
      <div
        className={gameSurfaceStyles.gameSurfaceComponent}
        style={{ pointerEvents: "none" }}
      >
        {grid.enabled ? (
          <Grid
            size={grid.size}
            color={grid.color}
            opacity={grid.opacity}
            width={gameSurface.width}
            height={gameSurface.height}
          />
        ) : null}
      </div>
    </div>
  );
}
