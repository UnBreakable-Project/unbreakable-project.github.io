export const siteUrl = "https://unbreakable-project.github.io";
export const shareImage = `${siteUrl}/identidade-visual/logos/unbreakableLogo_9.png`;
// Served from public/ so the event page can use it as its sharing image.
export const pinkHatPoster = "/eventos/ctf-pink-hat.jpg";
// Short aliases. The build writes a static redirect page for each one, since
// GitHub Pages has no server-side rules.
export const redirects = {
  "/pinkhat": "/eventos/ctf-pink-hat",
};
export const pageMeta = {
  "/": {
    title: "UnBreakable — Segurança ofensiva na UnB",
    description:
      "Uma matilha para ir além da teoria: conheça o grupo de estudos de segurança ofensiva da Universidade de Brasília.",
  },
  "/eventos": {
    title: "Eventos | UnBreakable",
    description:
      "Palestras, oficinas e competições: acompanhe a agenda e o histórico de atividades do UnBreakable.",
  },
  "/eventos/ctf-pink-hat": {
    title: "CTF Pink Hat — Pwning Like a Girl | UnBreakable",
    description:
      "Primeira edição do CTF Pink Hat, na Faculdade IDP: desafios, workshops e oficinas de segurança ofensiva com participação do UnBreakable.",
    image: `${siteUrl}${pinkHatPoster}`,
    imageAlt: "Arte do CTF Pink Hat — Pwning Like a Girl",
    imageWidth: 1080,
    imageHeight: 1350,
  },
  "/equipe": {
    title: "Equipe | UnBreakable",
    description:
      "Conheça as pessoas que sustentam a comunidade e o percurso de aprendizagem do UnBreakable na UnB.",
  },
  "/contato": {
    title: "Canais oficiais | UnBreakable",
    description:
      "Encontre os canais do UnBreakable para acompanhar a agenda, os projetos e as publicações do grupo.",
  },
  "/identidade-visual": {
    title: "Identidade Visual | UnBreakable",
    description:
      "Consulte as orientações da marca e baixe logos, ícones, circuitos e referências de cores oficiais do UnBreakable.",
  },
};
export const notFoundMeta = {
  title: "Página não encontrada | UnBreakable",
  description:
    "Este endereço não foi encontrado. Volte ao início para conhecer o UnBreakable.",
};
