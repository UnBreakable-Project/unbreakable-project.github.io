import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import Accordion from "./Accordion";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setup(reduced = false) {
  vi.stubGlobal("matchMedia", () => ({
    matches: reduced,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  const animations = [];
  render(
    <Accordion title="Etapa" defaultOpen>
      <p>Conteúdo da etapa</p>
    </Accordion>,
  );
  const summary = screen.getByText("Etapa").closest("summary");
  const details = summary.parentElement;
  details.animate = vi.fn(() => {
    const animation = { cancel: vi.fn(), onfinish: null };
    animations.push(animation);
    return animation;
  });
  return { summary, details, animations };
}

describe("Accordion", () => {
  it("keeps content mounted during close and hides it on completion", () => {
    const { summary, details, animations } = setup();
    fireEvent.click(summary);
    expect(details.open).toBe(true);
    animations[0].onfinish();
    expect(details.open).toBe(false);
    fireEvent.click(summary);
    animations[1].onfinish();
    expect(details.open).toBe(true);
  });
  it("reverses an unfinished transition on repeated activation", () => {
    const { summary, details, animations } = setup();
    fireEvent.click(summary);
    fireEvent.click(summary);
    expect(animations[0].cancel).toHaveBeenCalled();
    animations[1].onfinish();
    expect(details.open).toBe(true);
  });
  it("toggles immediately when reduced motion is requested", () => {
    const { summary, details } = setup(true);
    fireEvent.click(summary);
    expect(details.open).toBe(false);
    expect(details.animate).not.toHaveBeenCalled();
  });
});
