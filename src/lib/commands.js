// Command palette catalogue. Kept free of React so it can be unit-tested and
// so every destination comes from the same content the rest of the site uses.

export function normalize(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export function buildCommands({
  navigation,
  socialLinks,
  siteBase,
  isHome,
  routeHref,
}) {
  const anchor = (id) => (isHome ? `#${id}` : `${siteBase}#${id}`);

  return [
    {
      id: "home",
      group: "Navegar",
      label: "Início",
      hint: "cd ~",
      href: siteBase,
    },
    ...navigation.map(({ label, target }) => ({
      id: `section-${target}`,
      group: "Navegar",
      label,
      hint: `cd ~/${target}`,
      href: anchor(target),
    })),
    {
      id: "events",
      group: "Páginas",
      label: "Eventos",
      hint: "ls ./eventos",
      keywords: "palestras oficinas competições agenda",
      href: routeHref("/eventos"),
    },
    {
      id: "pinkhat",
      group: "Páginas",
      label: "CTF Pink Hat",
      hint: "cd ./eventos/ctf-pink-hat",
      keywords: "pwning like a girl evento ctf",
      href: routeHref("/eventos/ctf-pink-hat"),
    },
    {
      id: "team",
      group: "Páginas",
      label: "Equipe",
      hint: "cat ./equipe",
      keywords: "gestão pessoas membros whoami",
      href: routeHref("/equipe"),
    },
    {
      id: "identity",
      group: "Páginas",
      label: "Identidade Visual",
      hint: "ls ./identidade-visual",
      keywords: "logos cores ícones circuitos marca brand",
      href: routeHref("/identidade-visual"),
    },
    {
      id: "contact",
      group: "Páginas",
      label: "Canais oficiais",
      hint: "cat ./contato",
      keywords: "contato redes sociais",
      href: routeHref("/contato"),
    },
    ...socialLinks.map(({ name, url }) => ({
      id: `social-${name.toLowerCase()}`,
      group: "Canais",
      label: name,
      hint: `open ${name.toLowerCase()}`,
      href: url,
      external: true,
    })),
    {
      id: "matrix",
      group: "Segredos",
      label: "Acesso root",
      hint: "sudo su",
      keywords: "matrix hack root konami",
      action: "matrix",
    },
  ];
}

export function filterCommands(commands, query) {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return commands;
  return commands.filter((command) => {
    const haystack = normalize(
      `${command.label} ${command.hint} ${command.keywords ?? ""} ${command.group}`,
    );
    return terms.every((term) => haystack.includes(term));
  });
}
