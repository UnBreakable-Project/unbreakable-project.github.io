import { useEffect } from "react";

const sequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function useKonami(callback) {
  useEffect(() => {
    let position = 0;
    const onKeyDown = (event) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.closest("input, textarea")
      ) {
        position = 0;
        return;
      }
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      position =
        key === sequence[position] ? position + 1 : key === sequence[0] ? 1 : 0;
      if (position === sequence.length) {
        position = 0;
        callback();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [callback]);
}
