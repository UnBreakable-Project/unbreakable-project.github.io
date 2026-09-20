import { readFile, writeFile, mkdir } from "node:fs/promises";
import { URL } from "node:url";
import {
  pageMeta,
  notFoundMeta,
  siteUrl,
  shareImage,
} from "../src/data/page-meta.js";

const template = await readFile(
  new URL("../dist/index.html", import.meta.url),
  "utf8",
);
const escape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
// Injected at build time only: the dev server needs inline scripts for HMR.
// React writes style props through the CSSOM, so no 'unsafe-inline' is needed.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join("; ");
const organization = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UnBreakable",
  url: siteUrl,
  logo: shareImage,
  description: pageMeta["/"].description,
}).replaceAll("<", "\\u003c");
// Recon starts at the front end: the console banner points here.
const flag = "UNB{recon_comeca_na_frente}";

function render(meta, path) {
  const title = escape(meta.title);
  const description = escape(meta.description);
  return template
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/s,
      `<meta name="description" content="${description}" />`,
    )
    .replace(
      "</head>",
      `
      <meta http-equiv="Content-Security-Policy" content="${contentSecurityPolicy}" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="UnBreakable" />
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${shareImage}" />
      <meta property="og:image:alt" content="Marca oficial do UnBreakable" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${shareImage}" />
      ${path ? `<link rel="canonical" href="${siteUrl}${path}" /><meta property="og:url" content="${siteUrl}${path}" />` : '<meta name="robots" content="noindex" />'}
      ${path === "/" ? `<script type="application/ld+json">${organization}</script>` : ""}
    </head>`,
    );
}
for (const [path, meta] of Object.entries(pageMeta)) {
  const directory = new URL(
    `../dist${path === "/" ? "/" : `${path}/`}`,
    import.meta.url,
  );
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("index.html", directory), render(meta, path));
}
await writeFile(
  new URL("../dist/404.html", import.meta.url),
  render(notFoundMeta, null),
);

const dist = (file) => new URL(`../dist/${file}`, import.meta.url);
await writeFile(
  dist("sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(pageMeta)
  .map((path) => `  <url><loc>${siteUrl}${path}</loc></url>`)
  .join("\n")}
</urlset>
`,
);
await writeFile(
  dist("robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);
await writeFile(
  dist("humans.txt"),
  `/* GRUPO */
UnBreakable — grupo de estudos de segurança ofensiva da Universidade de Brasília
Site: ${siteUrl}

/* SITE */
Stack: React, Vite, MDX, GitHub Pages
Standards: HTML5, CSS3

/* CTF */
Recon é a primeira fase. Você chegou aqui, então decodifique:
${Buffer.from(flag).toString("base64")}
`,
);
