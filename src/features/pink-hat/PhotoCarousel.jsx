import { useCallback, useEffect, useId, useRef, useState } from "react";

const prefersReducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

const pad = (value) => String(value).padStart(2, "0");

function Chevron({ direction }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={direction === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

// Native scroll-snap does the swiping; state only mirrors it for the caption,
// the dots and the buttons. Autoplay pauses on hover, on focus, after any manual
// navigation and is off entirely under reduced motion (WCAG 2.2.2).
export default function PhotoCarousel({ photos, label, interval = 6000 }) {
  const count = photos.length;
  const track = useRef(null);
  const indexRef = useRef(0);
  const statusId = useId();
  const [reduced] = useState(prefersReducedMotion);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!reduced && count > 1);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const goTo = useCallback(
    (target) => {
      const next = (target + count) % count;
      const element = track.current;
      setIndex(next);
      element?.scrollTo?.({
        left: next * element.clientWidth,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [count, reduced],
  );

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const onScroll = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (element.clientWidth) {
          setIndex(Math.round(element.scrollLeft / element.clientWidth));
        }
      });
    };
    const onResize = () =>
      element.scrollTo?.({
        left: indexRef.current * element.clientWidth,
        behavior: "auto",
      });
    element.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(frame);
      element.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!playing || held || count < 2) return;
    const timer = window.setInterval(
      () => goTo(indexRef.current + 1),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [playing, held, count, interval, goTo]);

  function navigate(target) {
    setPlaying(false);
    goTo(target);
  }

  function onKeyDown(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      navigate(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      navigate(index - 1);
    }
  }

  const current = photos[index] ?? photos[0];
  const autoplaying = playing && !held;

  return (
    <section
      className="ph-gallery"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
    >
      <div className="ph-gallery-frame">
        <div
          ref={track}
          className="ph-track"
          role="group"
          tabIndex={0}
          aria-label={`${label}. Use as setas do teclado para trocar de foto.`}
          onKeyDown={onKeyDown}
          onTouchStart={() => setPlaying(false)}
        >
          {photos.map(({ src, alt }, position) => (
            <div
              key={src}
              className="ph-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${position + 1} de ${count}`}
              style={{ "--photo": `url("${src}")` }}
            >
              <img
                src={src}
                alt={alt}
                loading={position === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <button
              type="button"
              className="ph-nav ph-nav-prev"
              aria-label="Foto anterior"
              onClick={() => navigate(index - 1)}
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              className="ph-nav ph-nav-next"
              aria-label="Próxima foto"
              onClick={() => navigate(index + 1)}
            >
              <Chevron direction="right" />
            </button>
          </>
        )}
      </div>

      <div className="ph-gallery-bar">
        <p className="ph-caption">
          <span aria-hidden="true">
            {pad(index + 1)} / {pad(count)}
          </span>
          {current.caption}
        </p>
        {count > 1 && (
          <div className="ph-dots">
            {photos.map(({ src, caption }, position) => (
              <button
                key={src}
                type="button"
                aria-label={`Ir para a foto ${position + 1}: ${caption}`}
                aria-current={position === index ? "true" : undefined}
                onClick={() => navigate(position)}
              />
            ))}
          </div>
        )}
        {count > 1 && !reduced && (
          <button
            type="button"
            className="ph-play"
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? "Pausar" : "Retomar"}
            <span className="ph-sr"> rotação automática</span>
          </button>
        )}
      </div>

      <p
        id={statusId}
        className="ph-sr"
        aria-live={autoplaying ? "off" : "polite"}
      >
        Foto {index + 1} de {count}: {current.caption}
      </p>
    </section>
  );
}
