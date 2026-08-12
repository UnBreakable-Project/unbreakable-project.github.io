import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "public", "identidade-visual");
const targetFile = path.join(
  rootDir,
  "src",
  "data",
  "visual-identity-manifest.js",
);

const getFileType = (fileName) => {
  const extension = path.extname(fileName).toLowerCase().replace(".", "");

  if (!extension) return "file";
  if (["png", "jpg", "jpeg", "webp", "avif", "svg"].includes(extension)) {
    return "image";
  }
  if (extension === "pdf") return "pdf";
  if (["woff", "woff2", "ttf", "otf"].includes(extension)) return "font";
  if (["md", "txt"].includes(extension)) return "document";

  return extension;
};

const createAssetManifest = async () => {
  const entries = await readdir(sourceDir, { withFileTypes: true });
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second));

  const categories = await Promise.all(
    folders.map(async (slug) => {
      const categoryDir = path.join(sourceDir, slug);
      const files = await readdir(categoryDir, { withFileTypes: true });

      return {
        slug,
        files: files
          .filter((entry) => entry.isFile())
          .map((entry) => {
            const fileName = entry.name;

            return {
              id: `${slug}-${fileName}`,
              fileName,
              path: `/identidade-visual/${slug}/${fileName}`,
              type: getFileType(fileName),
              extension: path.extname(fileName).toLowerCase(),
            };
          })
          .sort((first, second) =>
            first.fileName.localeCompare(second.fileName),
          ),
      };
    }),
  );

  const content = `export const visualIdentityAssets = ${JSON.stringify(categories, null, 2)};\n\nexport default visualIdentityAssets;\n`;

  await mkdir(path.dirname(targetFile), { recursive: true });
  await writeFile(targetFile, content, "utf8");
};

await createAssetManifest();
