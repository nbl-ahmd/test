import { getConsoleFunction, setConsoleFunction } from "three";

const SUPPRESSED = "Clock: This module has been deprecated";

/**
 * three r183+ marks THREE.Clock deprecated and warns on construction, but
 * @react-three/fiber still instantiates it internally. We forward every three
 * message except that single, upstream-owned warning.
 */
export function silenceKnownThreeWarnings(): void {
  if (typeof window === "undefined") return;
  if (getConsoleFunction()) return;

  setConsoleFunction((type, message, ...params) => {
    if (type === "warn" && message.includes(SUPPRESSED)) return;

    if (type === "warn") console.warn(message, ...params);
    else if (type === "error") console.error(message, ...params);
    else console.log(message, ...params);
  });
}

silenceKnownThreeWarnings();