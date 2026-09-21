"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

function subscribe(callback: () => void): () => void {
  const id = window.setInterval(callback, 1000);
  return () => window.clearInterval(id);
}

function getSnapshot(): number {
  return Math.floor(Date.now() / 1000);
}

function getServerSnapshot(): number {
  return 0;
}

export default function LocalTime() {
  const seconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (seconds === 0) {
    return <span className="label text-muted">--:--:-- local</span>;
  }

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: site.timeZone,
  }).format(new Date(seconds * 1000));

  return (
    <time className="label text-muted" dateTime={new Date(seconds * 1000).toISOString()}>
      {time} local
    </time>
  );
}