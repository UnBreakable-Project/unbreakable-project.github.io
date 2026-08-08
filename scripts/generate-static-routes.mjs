import { copyFile, mkdir } from "node:fs/promises";
import { URL } from "node:url";

const routes = ["eventos", "equipe", "contato"];

await Promise.all(
  routes.map(async (route) => {
    const directory = new URL(`../dist/${route}/`, import.meta.url);
    await mkdir(directory, { recursive: true });
    await copyFile(
      new URL("../dist/index.html", import.meta.url),
      new URL("index.html", directory),
    );
  }),
);

await copyFile(
  new URL("../dist/index.html", import.meta.url),
  new URL("../dist/404.html", import.meta.url),
);
