import { useEffect, useId, useMemo, useRef, useState } from "react";
import { filterCommands } from "../lib/commands";

// Accessible combobox + listbox in a modal dialog. Focus stays on the input
// (aria-activedescendant), so no focus trap is needed beyond keeping Tab put.
export default function CommandPalette({ commands, onRun, onClose }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const list = useRef(null);
  const id = useId();

  const results = useMemo(
    () => filterCommands(commands, query),
    [commands, query],
  );
  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    input.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);

  useEffect(() => {
    list.current
      ?.querySelector('[aria-selected="true"]')
      ?.scrollIntoView?.({ block: "nearest" });
  }, [activeIndex, results]);

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((activeIndex + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive(
        (activeIndex - 1 + results.length) % Math.max(results.length, 1),
      );
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[activeIndex]) onRun(results[activeIndex]);
    } else if (event.key === "Tab") {
      event.preventDefault();
    }
  }

  return (
    <div
      className="palette-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
      >
        <div className="palette-input">
          <span aria-hidden="true">&gt;_</span>
          <input
            ref={input}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${id}-list`}
            aria-activedescendant={
              results[activeIndex] ? `${id}-${results[activeIndex].id}` : ""
            }
            aria-autocomplete="list"
            aria-label="Buscar página, seção ou canal"
            placeholder="Buscar página, seção ou canal…"
            autoComplete="off"
            spellCheck="false"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd aria-hidden="true">esc</kbd>
        </div>
        <ul
          ref={list}
          id={`${id}-list`}
          className="palette-list"
          role="listbox"
          aria-label="Comandos"
        >
          {results.map((command, index) => {
            const heading = command.group !== results[index - 1]?.group;
            return (
              <li key={command.id} role="presentation">
                {heading && (
                  <span className="palette-group" aria-hidden="true">
                    {command.group}
                  </span>
                )}
                <div
                  id={`${id}-${command.id}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  className="palette-item"
                  onMouseMove={() => setActive(index)}
                  onClick={() => onRun(command)}
                >
                  <span>{command.label}</span>
                  <code>{command.hint}</code>
                </div>
              </li>
            );
          })}
        </ul>
        {results.length === 0 && (
          <p className="palette-empty" role="status">
            <code>command not found: {query}</code>
          </p>
        )}
        <p className="palette-foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navegar
          </span>
          <span>
            <kbd>↵</kbd> abrir
          </span>
          <span>
            <kbd>esc</kbd> fechar
          </span>
        </p>
      </div>
    </div>
  );
}
