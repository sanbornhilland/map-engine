"use client";
import { useEffect, useState } from "react";
import mainMenuStyles from "./MainMenu.module.css";
import { useMutation, useStorage } from "./Store";

export function MainMenu() {
  const map = useStorage((storage) => storage.map);
  const [localMapUrl, setLocalMapUrl] = useState(map.url);

  useEffect(() => {
    setLocalMapUrl(map.url);
  }, [map.url]);

  const setMapUrl = useMutation(({ storage }, url: string) => {
    storage.get("map").set("url", url);
  }, []);

  return (
    <div className={mainMenuStyles.menu}>
      <form
        onSubmit={(event) => {
          event.preventDefault();

          setMapUrl(localMapUrl);
        }}
      >
        <label>
          Map URL
          <input
            value={localMapUrl}
            onChange={(event) => {
              setLocalMapUrl(event.target.value);
            }}
          />
        </label>
        <button type="submit">Add Map</button>
      </form>
    </div>
  );
}
