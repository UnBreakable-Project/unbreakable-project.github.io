import { describe, expect, it } from "vitest";
import { buildCommands, filterCommands, normalize } from "./commands";

const args = {
  navigation: [{ label: "Sobre", target: "sobre" }],
  socialLinks: [{ name: "GitHub", url: "https://github.com/unbreakable" }],
  siteBase: "/",
  routeHref: (path) => `/${path.replace(/^\//, "")}`,
};

describe("command palette catalogue", () => {
  it("uses in-page anchors on the home page and absolute ones elsewhere", () => {
    const home = buildCommands({ ...args, isHome: true });
    const other = buildCommands({ ...args, isHome: false });
    expect(home.find((c) => c.id === "section-sobre").href).toBe("#sobre");
    expect(other.find((c) => c.id === "section-sobre").href).toBe("/#sobre");
  });

  it("opens social channels externally", () => {
    const commands = buildCommands({ ...args, isHome: true });
    expect(commands.find((c) => c.id === "social-github")).toMatchObject({
      external: true,
      href: "https://github.com/unbreakable",
    });
  });

  it("ignores case and accents and matches every term", () => {
    expect(normalize("Início")).toBe("inicio");
    const commands = buildCommands({ ...args, isHome: true });
    const ids = (query) => filterCommands(commands, query).map((c) => c.id);
    expect(ids("EQUIPE")).toContain("team");
    expect(ids("gestão")).toContain("team");
    expect(ids("cd sobre")).toEqual(["section-sobre"]);
    expect(ids("zzzz")).toEqual([]);
    expect(ids("")).toHaveLength(commands.length);
  });
});
