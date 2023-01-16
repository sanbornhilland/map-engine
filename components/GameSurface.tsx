"use client";
import gameSurfaceStyles from "./GameSurface.module.css";

import { getStroke } from "perfect-freehand";
import { PointerEventHandler, useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import {
  BrushStroke,
  GameSurface,
  Grid,
  useMutation,
  useStorage,
} from "./Store";
import { isViewer } from "./utils";

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

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) {
    return "";
  }

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export type FogOfWarProps = {
  width: number;
  height: number;
  brushSize: number;
  blurSize: number;
  brushStrokes: readonly BrushStroke[];
  opacity: number;
};

const options = {
  size: 32,
  thinning: 0,
  smoothing: 0.5,
  streamline: 0,
};

type PointInput = [number, number, number][];

export type PathProps = {
  pathData: string;
};

export function Path({ pathData }: PathProps) {
  return (
    <path d={pathData} fill="black" className={gameSurfaceStyles.fowPath} />
  );
}

export function FogOfWar({
  width,
  height,
  brushSize,
  blurSize,
  brushStrokes,
  opacity,
}: FogOfWarProps) {
  const [points, setPoints] = useState<PointInput>([]);

  const addBrushStroke = useMutation(
    ({ storage }, pathData: string, blurSize: number) => {
      storage
        .get("brushStrokes")
        .insert({ pathData, blurSize }, storage.get("brushStrokes").length);
    },
    []
  );

  const handlePointerDown: PointerEventHandler<SVGElement> = (event) => {
    // @ts-expect-error
    event.target.setPointerCapture(event.pointerId);

    setPoints([[event.pageX, event.pageY, event.pressure], ...points]);
  };

  const handlePointerMove: PointerEventHandler<SVGElement> = (event) => {
    if (event.buttons !== 1) {
      return;
    }
    setPoints([...points, [event.pageX, event.pageY, event.pressure]]);
  };

  const handlePointerUp: PointerEventHandler<SVGElement> = () => {
    const stroke = getStroke(points, { ...options, size: brushSize });

    addBrushStroke(getSvgPathFromStroke(stroke), blurSize);

    setPoints([]);
  };

  return (
    <div style={{ opacity }}>
      <svg
        preserveAspectRatio="none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
        viewBox={`0 0 ${width} ${height}`}
      >
        <mask id="myMask">
          <rect x="0" y="0" width={width} height={height} fill="white" />

          {points.length !== 0 && (
            <path
              d={getSvgPathFromStroke(
                getStroke(points, { ...options, size: brushSize })
              )}
              fill="black"
              className={gameSurfaceStyles.fowPath}
              style={{
                // @ts-expect-error
                ["--blur-size"]: `${blurSize}px`,
              }}
            />
          )}
          {brushStrokes.map((brushStroke, i) => {
            return (
              <path
                key={i}
                d={brushStroke.pathData}
                fill="black"
                className={gameSurfaceStyles.fowPath}
                style={{
                  // @ts-expect-error
                  ["--blur-size"]: `${brushStroke.blurSize}px`,
                }}
              />
            );
          })}
        </mask>

        <rect width={width} height={height} mask="url(#myMask)" />
      </svg>
    </div>
  );
}

export type GameSurfaceProps = {
  videoId?: string;
  grid: Grid;
  gameSurface: GameSurface;
};

export function GameSurface({ videoId, grid, gameSurface }: GameSurfaceProps) {
  const fogOfWar = useStorage((storage) => storage.fogOfWar);
  const brushStrokes = useStorage((storage) => storage.brushStrokes);

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
      <div className={gameSurfaceStyles.gameSurfaceComponent}>
        {fogOfWar.enabled ? (
          <FogOfWar
            width={gameSurface.width}
            height={gameSurface.height}
            brushStrokes={brushStrokes}
            brushSize={fogOfWar.brushSize}
            blurSize={fogOfWar.blurSize}
            opacity={isViewer() ? 1 : fogOfWar.opacity}
          />
        ) : null}
      </div>
    </div>
  );
}
