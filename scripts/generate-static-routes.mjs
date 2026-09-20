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
