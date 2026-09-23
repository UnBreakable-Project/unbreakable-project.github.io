export const siteUrl = "https://unbreakable-project.github.io";
export const shareImage = `${siteUrl}/identidade-visual/logos/unbreakableLogo_9.png`;
// Served from public/ so the event page can use it as its sharing image.
export const pinkHatPoster = "/eventos/banner_pink_hat.png";
// Short aliases. The build writes a static redirect page for each one, since
// GitHub Pages has no server-side rules.
export const redirects = {
  "/pinkhat": "/eventos/ctf-pink-hat",
};
export const pageMeta = {
  "/": {
    title: "UnBreakable — Segurança ofensiva na UnB",
    description:
      "Uma matliha para ir além da teoria: conheça o grupo de estudos de segurança ofensiva da Universidade de Brasília.",
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
    imageWidth: 646,
    imageHeight: 803,
  },
  "/eventos/ligolo-ng": {
    title: "Movimentação Lateral utilizando o Ligolo-ng | UnBreakable",
    description:
      "Primeira palestra oficial do UnBreakable: o Prof. Alan Tamer Vasques percorre um pentest completo, da enumeração ao root, com pivô pelo Ligolo-ng.",
    image: `${siteUrl}/eventos/ligolo-ng.jpg`,
    imageAlt:
      "Slide de abertura da palestra Movimentação Lateral utilizando o Ligolo-ng",
    imageWidth: 666,
    imageHeight: 371,
  },
  "/eventos/tunelamento-dns": {
    title: "Detecção de Exfiltração por Tunelamento DNS | UnBreakable",
    description:
      "Palestra online da Profa. Lorena Borges sobre como detectar a exfiltração de dados por tunelamento DNS em infraestruturas de nuvem.",
    image: `${siteUrl}/eventos/tunelamento-dns.jpg`,
    imageAlt:
      "Banner da palestra Método de Detecção de Exfiltração por Tunelamento DNS",
    imageWidth: 800,
    imageHeight: 1066,
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
      "Consulte as orientações da marca e baixe logos, circuitos e referências de cores oficiais do UnBreakable.",
  },
};
export const notFoundMeta = {
  title: "Página não encontrada | UnBreakable",
  description:
    "Este endereço não foi encontrado. Volte ao início para conhecer o UnBreakable.",
};
