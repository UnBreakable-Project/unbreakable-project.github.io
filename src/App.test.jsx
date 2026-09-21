import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: undefined,
  });
});

function renderApp() {
  return render(<App />);
}

describe("UnBreakable", () => {
  it("shows a recovery link for an unknown route", () => {
    window.history.replaceState({}, "", "/nao-existe");
    renderApp();
    expect(
      screen.getByRole("heading", { level: 1, name: "Página não encontrada" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Voltar ao início/ }),
    ).toHaveAttribute("href", "/");
    expect(document.title).toBe("Página não encontrada | UnBreakable");
  });

  it("closes the mobile menu with Escape and restores focus", () => {
    renderApp();
    const toggle = screen.getByRole("button", { name: "Abrir menu" });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveAttribute("aria-controls", "primary-navigation");
    fireEvent.keyDown(window, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveFocus();
  });

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

  it("renders the method section without the terminal", () => {
    renderApp();

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "O ataque termina no write-up.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/As sessões usam máquinas do Hack The Box/),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText("Exemplo de fluxo de estudo"),
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
      screen.getByRole("navigation", {
        name: "Categorias de identidade visual",
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Fontes" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("Versão preferida")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "canais oficiais" }),
    ).toHaveAttribute("href", "/contato");
    expect(
      screen
        .getAllByRole("link", { name: /^Baixar / })
        .every((link) => link.hasAttribute("download")),
    ).toBe(true);
  });

  it("updates the identity category and exposes accessible action feedback", () => {
    window.history.replaceState({}, "", "/identidade-visual");
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Ícones" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Ícones" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "Exibindo a categoria Ícones.",
    );
    expect(screen.getAllByRole("link", { name: "Baixar SVG" })).toHaveLength(8);
    expect(screen.getAllByRole("link", { name: "Baixar PNG" })).toHaveLength(8);

    fireEvent.click(screen.getByRole("button", { name: "Cores" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "Copiar código #FFFFFF de Branco",
      }),
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "Não foi possível copiar automaticamente #FFFFFF. Copie o código exibido.",
    );
    expect(screen.getByDisplayValue("#FFFFFF")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Circuitos" }));

    expect(
      screen.getByRole("heading", { level: 2, name: "Circuitos" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Baixar SVG" })).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: "Baixar PNG" })).toHaveLength(3);

    fireEvent.click(screen.getAllByRole("link", { name: "Baixar SVG" })[0]);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Solicitação de download de Circuito colorido em SVG acionada.",
    );
  });

  it("copies a color code when the clipboard is available", async () => {
    const writeText = vi.fn().mockResolvedValue();
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    window.history.replaceState({}, "", "/identidade-visual");
    renderApp();

    fireEvent.click(screen.getByRole("button", { name: "Cores" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: "Copiar código #FFFFFF de Branco",
      }),
    );

    expect(writeText).toHaveBeenCalledWith("#FFFFFF");
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Código #FFFFFF de Branco copiado.",
    );
  });

  it("opens the command palette with Ctrl+K, filters and restores focus", () => {
    renderApp();
    const trigger = screen.getByRole("button", {
      name: "Abrir paleta de comandos",
    });
    trigger.focus();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const dialog = screen.getByRole("dialog", { name: "Paleta de comandos" });
    const input = within(dialog).getByRole("combobox");
    expect(input).toHaveFocus();

    fireEvent.change(input, { target: { value: "identidade" } });
    const options = within(dialog).getAllByRole("option");
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent("Identidade Visual");
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id);

    fireEvent.change(input, { target: { value: "zzzz" } });
    expect(within(dialog).getByRole("status")).toHaveTextContent(
      "command not found: zzzz",
    );

    fireEvent.keyDown(input, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("opens the palette with / but not while typing in a field", () => {
    renderApp();
    fireEvent.keyDown(window, { key: "/" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });

    window.history.replaceState({}, "", "/identidade-visual");
    cleanup();
    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Cores" }));
    fireEvent.keyDown(screen.getByDisplayValue("#FFFFFF"), { key: "/" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("runs the easter egg from the palette", () => {
    renderApp();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "sudo" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText(/ACCESS GRANTED/)).toBeInTheDocument();
  });

  it("presents the 404 as a terminal with links back to the site", () => {
    window.history.replaceState({}, "", "/nao-existe");
    renderApp();
    expect(
      screen.getByRole("list", { name: "Diretórios do site" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "equipe/" })).toHaveAttribute(
      "href",
      "/equipe",
    );
  });

  it("renders the hero prompt, config file and method pipeline", () => {
    renderApp();
    expect(
      screen.getByLabelText("unbreakable@unb:~$ whoami"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Conteúdo de ~/unbreakable.conf"),
    ).toHaveTextContent("Tópicos Avançados em Computadores");
    const pipeline = screen.getByRole("list", {
      name: "Fluxo de trabalho do grupo",
    });
    expect(within(pipeline).getAllByRole("listitem")).toHaveLength(4);
  });

  it("renders the CTF Pink Hat event page from the site content", () => {
    window.history.replaceState({}, "", "/eventos/ctf-pink-hat");
    renderApp();

    expect(
      screen.getByRole("heading", { level: 1, name: /CTF\s+Pink\s+Hat/ }),
    ).toBeInTheDocument();
    expect(document.title).toMatch(/^CTF Pink Hat/);
    expect(screen.getByText("Evento realizado")).toBeInTheDocument();
    expect(screen.getByText("Desafios")).toBeInTheDocument();
    const panel = screen.getByRole("region", { name: "Realização e apoio" });
    expect(within(panel).getByText("UnBreakable")).toBeInTheDocument();
    expect(within(panel).getByText("Neospace")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Todos os eventos/ }),
    ).toHaveAttribute("href", "/eventos");
    expect(screen.queryByText(/inscrições|inscreva/i)).not.toBeInTheDocument();
  });

  it("links the events page to the Pink Hat page and keeps the menu active", () => {
    window.history.replaceState({}, "", "/eventos");
    renderApp();
    expect(
      screen.getByRole("link", { name: /Ver página do evento/ }),
    ).toHaveAttribute("href", "/eventos/ctf-pink-hat");

    cleanup();
    window.history.replaceState({}, "", "/eventos/ctf-pink-hat");
    renderApp();
    const nav = screen.getByRole("navigation", {
      name: "Navegação principal",
    });
    expect(within(nav).getByRole("link", { name: "Eventos" })).toHaveClass(
      "is-active",
    );
  });

  it("redirects the /pinkhat alias to the event page", () => {
    const replace = vi.fn();
    const original = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...original, pathname: "/pinkhat", replace },
    });
    try {
      renderApp();
      expect(replace).toHaveBeenCalledWith("/eventos/ctf-pink-hat");
      expect(screen.getByRole("link", { name: "siga o link" })).toHaveAttribute(
        "href",
        "/eventos/ctf-pink-hat",
      );
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: original,
      });
    }
  });

  it("renders the team page with gestão atual and no fundação references", () => {
    window.history.replaceState({}, "", "/equipe");
    renderApp();

    expect(
      screen.getByRole("heading", { level: 2, name: "Gestão atual" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Fundação/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/fundador/i)).not.toBeInTheDocument();
    expect(screen.getByText("Enzo Teles")).toBeInTheDocument();
    expect(
      screen.getByText("Prof. Roberto Rodrigues-Filho"),
    ).toBeInTheDocument();
    expect(screen.getByText("Luisa de Souza")).toBeInTheDocument();
  });
});
