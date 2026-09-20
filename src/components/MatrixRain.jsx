import { useEffect, useRef } from "react";

const glyphs = "アイウエオカキクケコサシスセソ0123456789ABCDEF<>/{}$#";
const DURATION = 5200;

// Easter egg. Under reduced motion only the static badge is shown.
export default function MatrixRain({ onDone }) {
  const canvas = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const context = canvas.current?.getContext?.("2d");
    let frame = 0;
    let stopped = false;

    const finish = window.setTimeout(onDone, reduced ? 2400 : DURATION);
    const dismiss = () => onDone();
    window.addEventListener("keydown", dismiss);

    if (!reduced && context) {
      const size = 16;
      const element = canvas.current;
      element.width = window.innerWidth;
      element.height = window.innerHeight;
      const drops = Array.from(
        { length: Math.ceil(element.width / size) },
        () => Math.random() * -40,
      );
      let last = 0;
      const draw = (time) => {
        if (stopped) return;
        frame = window.requestAnimationFrame(draw);
        if (time - last < 55) return;
        last = time;
        context.fillStyle = "rgba(8, 11, 9, 0.12)";
        context.fillRect(0, 0, element.width, element.height);
        context.font = `${size}px "IBM Plex Mono", monospace`;
        drops.forEach((row, column) => {
          const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
          context.fillStyle = row % 9 < 1 ? "#f3f7f1" : "#a3ff12";
          context.fillText(glyph, column * size, row * size);
          drops[column] =
            row * size > element.height && Math.random() > 0.975 ? 0 : row + 1;
        });
      };
      frame = window.requestAnimationFrame(draw);
    }

    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(finish);
      window.removeEventListener("keydown", dismiss);
    };
  }, [onDone]);

  return (
    <div className="matrix" role="status" onClick={onDone}>
      <canvas ref={canvas} aria-hidden="true" />
      <p className="matrix-badge">
        <span aria-hidden="true">root@unb:~# </span>ACCESS GRANTED
      </p>
    </div>
  );
}
