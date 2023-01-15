"use client";
import { useEffect, useState } from "react";
import mainMenuStyles from "./MainMenu.module.css";
import { useMutation, useStorage } from "./Store";

export function GridMenu() {
  const grid = useStorage((storage) => storage.grid);

  const setGridEnabled = useMutation(({ storage }, enabled: boolean) => {
    storage.get("grid").set("enabled", enabled);
  }, []);

  const setGridSize = useMutation(({ storage }, size: number) => {
    storage.get("grid").set("size", size);
  }, []);

  const setGridOpacity = useMutation(({ storage }, opacity: number) => {
    storage.get("grid").set("opacity", opacity);
  }, []);

  const setGridColor = useMutation(({ storage }, color: string) => {
    storage.get("grid").set("color", color);
  }, []);

  return (
    <div>
      <h2>Grid</h2>
      <label>
        Enabled
        <input
          type="checkbox"
          checked={grid.enabled}
          onChange={(event) => {
            setGridEnabled(event.target.checked);
          }}
        />
      </label>
      <label>
        Size
        <input
          type="number"
          value={grid.size}
          step={1}
          min={1}
          onChange={(event) => {
            setGridSize(Math.max(1, event.target.valueAsNumber));
          }}
        />
      </label>
      <label>
        Opacity
        <input
          type="number"
          value={grid.opacity * 100}
          step={1}
          min={0}
          max={100}
          onChange={(event) => {
            setGridOpacity(Math.max(0, event.target.valueAsNumber / 100));
          }}
        />
      </label>
      <label>
        Color
        <input
          type="color"
          value={grid.color}
          onChange={(event) => {
            setGridColor(event.target.value);
          }}
        />
      </label>
    </div>
  );
}

export function FogOfWarMenu() {
  const fogOfWar = useStorage((storage) => storage.fogOfWar);

  const setFogOfWarEnabled = useMutation(({ storage }, enabled: boolean) => {
    storage.get("fogOfWar").set("enabled", enabled);
  }, []);

  const setBrushSize = useMutation(({ storage }, size: number) => {
    storage.get("fogOfWar").set("brushSize", size);
  }, []);

  const setBlurSize = useMutation(({ storage }, size: number) => {
    storage.get("fogOfWar").set("blurSize", size);
  }, []);

  const resetFogOfWar = useMutation(({ storage }) => {
    storage.get("brushStrokes").clear();
  }, []);

  return (
    <div>
      <h2>Fog Of War</h2>
      <label>
        Enabled
        <input
          type="checkbox"
          checked={fogOfWar.enabled}
          onChange={(event) => {
            setFogOfWarEnabled(event.target.checked);
          }}
        />
      </label>
      <label>
        Brush Size
        <input
          type="number"
          value={fogOfWar.brushSize}
          step={1}
          min={1}
          onChange={(event) => {
            setBrushSize(Math.max(1, event.target.valueAsNumber));
          }}
        />
      </label>
      <label>
        Blur Size
        <input
          type="number"
          value={fogOfWar.blurSize}
          step={1}
          min={1}
          onChange={(event) => {
            setBlurSize(Math.max(1, event.target.valueAsNumber));
          }}
        />
      </label>
      <button
        type="button"
        onClick={() => {
          resetFogOfWar();
        }}
      >
        Reset
      </button>
    </div>
  );
}

export function MainMenu() {
  const map = useStorage((storage) => storage.map);
  const [localMapVideoId, setLocalMapVideoId] = useState(map.videoId);

  useEffect(() => {
    setLocalMapVideoId(map.videoId);
  }, [map.videoId]);

  const setMapUrl = useMutation(({ storage }, videoId: string) => {
    storage.get("map").set("videoId", videoId);
  }, []);

  return (
    <div className={mainMenuStyles.menu}>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          setMapUrl(localMapVideoId);
        }}
      >
        <label>
          Youtube Video ID
          <input
            value={localMapVideoId}
            onChange={(event) => {
              setLocalMapVideoId(event.target.value);
            }}
          />
        </label>
        <button type="submit">Add Map</button>
      </form>
      <GridMenu />
      <FogOfWarMenu />
    </div>
  );
}
