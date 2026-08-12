export function normalizeAssetLabel(fileName) {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return withoutExtension
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function resolveAssetPath(assetPath) {
  if (!assetPath) return assetPath;
  if (/^https?:\/\//.test(assetPath)) return assetPath;
  const normalized = assetPath.replace(/^\/+/, "");
  return `${import.meta.env.BASE_URL}${normalized}`;
}

export function getCategoryLabel(slug) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function groupImageFormats(files) {
  const handled = new Set();

  return files.reduce((groupedFiles, file) => {
    if (handled.has(file.id)) return groupedFiles;

    const baseName = file.fileName.replace(/\.(png|svg)$/i, "");
    const formats = files.filter(
      (candidate) =>
        candidate.fileName.replace(/\.(png|svg)$/i, "") === baseName &&
        [".png", ".svg"].includes(candidate.extension),
    );

    if (formats.length < 2) {
      groupedFiles.push(file);
      return groupedFiles;
    }

    const orderedFormats = formats.toSorted((first, second) =>
      first.extension === ".svg" ? -1 : second.extension === ".svg" ? 1 : 0,
    );
    const primaryFormat = orderedFormats[0];

    orderedFormats.forEach((format) => handled.add(format.id));
    groupedFiles.push({
      ...primaryFormat,
      id: `${file.id}-formats`,
      formats: orderedFormats,
    });

    return groupedFiles;
  }, []);
}

export function buildVisualIdentityManifest(assetCategories, content) {
  const configuredCategories = content.categories ?? [];
  const assetsBySlug = new Map(
    assetCategories.map((category) => [category.slug, category]),
  );
  const configuredSlugs = configuredCategories.map((category) => category.slug);
  const remainingSlugs = assetCategories
    .map((category) => category.slug)
    .filter((slug) => !configuredSlugs.includes(slug));

  return [...configuredSlugs, ...remainingSlugs].flatMap((slug) => {
    const assets = assetsBySlug.get(slug);
    if (!assets?.files.length) return [];

    const categoryContent = configuredCategories.find(
      (category) => category.slug === slug,
    );
    const fileContent = categoryContent?.files ?? {};
    const files = assets.files
      .map((file) => ({
        ...file,
        ...(fileContent[file.fileName] ?? {}),
      }))
      .sort(
        (first, second) =>
          (first.order ?? Number.MAX_SAFE_INTEGER) -
            (second.order ?? Number.MAX_SAFE_INTEGER) ||
          first.fileName.localeCompare(second.fileName),
      );

    return [
      {
        slug,
        label: categoryContent?.label ?? getCategoryLabel(slug),
        description:
          categoryContent?.description ??
          "Arquivos da identidade visual do UnBreakable.",
        usage:
          categoryContent?.usage ??
          "Use este material como apoio à identidade visual oficial.",
        files: groupImageFormats(files),
      },
    ];
  });
}

export function getFileKind(type) {
  const map = {
    image: "Imagem",
    pdf: "PDF",
    font: "Fonte",
    document: "Documento",
    file: "Arquivo",
  };

  return map[type] ?? "Arquivo";
}
