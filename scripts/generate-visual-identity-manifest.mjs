import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'public', 'identidade-visual');
const targetFile = path.join(rootDir, 'src', 'data', 'visual-identity-manifest.js');

const categoryOrder = [
  'logos',
  'icones',
  'cores',
  'fontes',
  'circuitos',
];

const readDirectory = async (dirPath) => {
  const entries = await readdir(dirPath, { withFileTypes: true });
  const folders = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const orderedFolders = categoryOrder.filter((category) => folders.includes(category));
  const remainingFolders = folders.filter((category) => !categoryOrder.includes(category));

  return [...orderedFolders, ...remainingFolders];
};

const toLabel = (slug) =>
  slug
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

const toDisplayName = (name) => {
  const withoutExtension = name.replace(/\.[^/.]+$/, '');
  return withoutExtension
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const getFileType = (fileName) => {
  const extension = path.extname(fileName).toLowerCase().replace('.', '');
  if (!extension) return 'file';
  if (['png', 'jpg', 'jpeg', 'webp', 'avif', 'svg'].includes(extension)) return 'image';
  if (['pdf'].includes(extension)) return 'pdf';
  if (['woff', 'woff2', 'ttf', 'otf'].includes(extension)) return 'font';
  if (['md', 'txt'].includes(extension)) return 'document';
  return extension;
};

const getCategoryMeta = (category) => {
  const map = {
    logos: {
      description: 'Arquivos principais da marca, versões e variações do logo.',
      kind: 'brand',
    },
    icones: {
      description: 'Ícones e elementos visuais complementares da identidade.',
      kind: 'system',
    },
    fontes: {
      description: 'Fontes oficiais e arquivos tipográficos da marca.',
      kind: 'typography',
    },
    cores: {
      description: 'Paletas, guias e materiais de referência de cores.',
      kind: 'palette',
    },
    materiais: {
      description: 'Brandbook, apresentações e materiais institucionais.',
      kind: 'material',
    },
    circuitos: {
      description: 'Arquivos da categoria de identidade visual.',
      kind: 'general',
    },
  };

  return map[category] ?? {
    description: 'Arquivos da categoria de identidade visual.',
    kind: 'general',
  };
};

const ensureCategoryFolders = async () => {
  const categories = await readDirectory(sourceDir);
  return categories;
};

const createManifest = async () => {
  const categories = await ensureCategoryFolders();

  const manifest = await Promise.all(
    categories.filter((category) => categoryOrder.includes(category)).map(async (category) => {
      const categoryDir = path.join(sourceDir, category);
      const entries = await readdir(categoryDir, { withFileTypes: true });

      const files = await Promise.all(
        entries
          .filter((entry) => entry.isFile())
          .map(async (entry) => {
            const fileName = entry.name;
            const assetPath = `/identidade-visual/${category}/${fileName}`;
            const fileStats = await readFile(path.join(categoryDir, fileName));

            return {
              id: `${category}-${fileName}`,
              name: toDisplayName(fileName),
              fileName,
              path: assetPath,
              type: getFileType(fileName),
              size: fileStats.byteLength,
              extension: path.extname(fileName).toLowerCase(),
            };
          }),
      );

      const sortedFiles = files.sort((a, b) => a.fileName.localeCompare(b.fileName));
      const meta = getCategoryMeta(category);

      return {
        slug: category,
        label: toLabel(category),
        description: meta.description,
        kind: meta.kind,
        files: sortedFiles,
      };
    }),
  );

  const content = `export const visualIdentityManifest = ${JSON.stringify(manifest, null, 2)};\n\nexport default visualIdentityManifest;\n`;

  await mkdir(path.dirname(targetFile), { recursive: true });
  await writeFile(targetFile, content, 'utf8');
};

await createManifest();
