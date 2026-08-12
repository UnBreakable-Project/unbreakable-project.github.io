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

export function getFilePreview(file) {
  if (!file) return null;
  if (file.type === "image") return resolveAssetPath(file.path);
  if (file.type === "pdf") return resolveAssetPath("/identidade-visual/materiais/brandbook.pdf");
  return null;
}
