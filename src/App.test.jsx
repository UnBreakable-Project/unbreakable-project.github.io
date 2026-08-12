import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
});

function renderApp() {
  return render(<App />);
}

describe("UnBreakable", () => {
  it("renders the main content landmark and the official channels", () => {
    renderApp();

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "GitHub" })).toHaveLength(2);
    expect(
      screen.getByRole("link", { name: "Pular para o conteúdo principal" }),
    ).toHaveAttribute("href", "#conteudo-principal");
  });

  it("renders navigation links with anchors for scroll spy", () => {
    renderApp();

    const nav = screen.getByRole("navigation", {
      name: "Navegação principal",
    });
    const sobreLink = within(nav).getByRole("link", { name: "Sobre" });
    const metodoLink = within(nav).getByRole("link", { name: "Método" });
    const faqLink = within(nav).getByRole("link", { name: "FAQ" });

    expect(sobreLink).toHaveAttribute("href", "#sobre");
    expect(metodoLink).toHaveAttribute("href", "#metodo");
    expect(faqLink).toHaveAttribute("href", "#faq");

    fireEvent.scroll(window, { target: { scrollY: 300 } });
  });

  it("renders the static study terminal", () => {
    renderApp();

    expect(
      screen.getByLabelText("Exemplo de fluxo de estudo"),
    ).toHaveTextContent("hipótese → teste → evidência → write-up");
    expect(
      screen.queryByLabelText("Linha de comando do terminal"),
    ).not.toBeInTheDocument();
  });

  it("renders the dedicated official channels page", () => {
    window.history.replaceState({}, "", "/contato");
    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: "Canais oficiais" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: /Instagram/ })
        .some(
          (link) =>
            link.getAttribute("href") ===
            "https://www.instagram.com/unbreakableunb/",
        ),
    ).toBe(true);
    expect(
      within(
        screen.getByRole("list", {
          name: "Canais oficiais do UnBreakable",
        }),
      ).getAllByRole("listitem"),
    ).toHaveLength(5);
    expect(
      screen.queryByRole("heading", { name: "Quer fazer parte?" }),
    ).not.toBeInTheDocument();
  });

  it("renders the identity visual gallery page", () => {
    window.history.replaceState({}, "", "/identidade-visual");
    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: "Identidade Visual" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Categorias de identidade visual" }),
    ).toBeInTheDocument();
  });
});
