import { useEffect, useRef } from "react";

// Keep native details/summary keyboard behavior; animate measured heights so
// long answers and resized text never depend on an arbitrary max-height.
export default function Accordion({
  title,
  number,
  defaultOpen = false,
  className = "",
  children,
}) {
  const element = useRef(null);
  const animation = useRef(null);
  const expanded = useRef(defaultOpen);

  useEffect(() => {
    const preference = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const settle = () => {
      if (!preference.matches) return;
      animation.current?.cancel();
      animation.current = null;
      element.current.open = expanded.current;
    };
    preference?.addEventListener("change", settle);
    return () => {
      animation.current?.cancel();
      preference?.removeEventListener("change", settle);
    };
  }, []);

  function toggle(event) {
    event.preventDefault();
    const details = element.current;
    const startHeight = details.getBoundingClientRect().height;
    expanded.current = !expanded.current;
    animation.current?.cancel();
    animation.current = null;

    if (
      !details.animate ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      details.open = expanded.current;
      return;
    }

    const finish = () => {
      details.open = expanded.current;
      animation.current = null;
    };
    // Measure both natural states, then keep the content rendered during close.
    details.open = expanded.current;
    const endHeight = details.getBoundingClientRect().height;
    details.open = true;
    const current = details.animate(
      [
        { height: `${startHeight}px`, overflow: "hidden" },
        { height: `${endHeight}px`, overflow: "hidden" },
      ],
      { duration: 260, easing: "cubic-bezier(0.2, 0, 0, 1)" },
    );
    animation.current = current;
    current.onfinish = finish;
  }

  return (
    <details
      ref={element}
      className={`accordion ${className}`}
      open={defaultOpen}
    >
      <summary onClick={toggle}>
        {number && (
          <span className="accordion-number" aria-hidden="true">
            {number}
          </span>
        )}
        <span>{title}</span>
        <span className="accordion-toggle" aria-hidden="true" />
      </summary>
      <div className="accordion-panel">{children}</div>
    </details>
  );
}
