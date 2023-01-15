"use client";
import { useEffect, useState } from "react";
import mainMenuStyles from "./MainMenu.module.css";
import { useMutation, useStorage } from "./Store";

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
    </div>
  );
}
