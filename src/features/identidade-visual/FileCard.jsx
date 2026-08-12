import {
  getFileKind,
  getFilePreview,
  normalizeAssetLabel,
  resolveAssetPath,
} from "./brandAssetUtils";

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  const sizes = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), sizes.length - 1);
  const value = bytes / 1024 ** index;
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${sizes[index]}`;
}

function FilePreview({ file, categoryLabel }) {
  const previewPath = getFilePreview(file);

  if (file.type === "image" && previewPath) {
    return (
      <div className="brand-file-preview is-image">
        <img src={previewPath} alt={file.name} loading="lazy" />
      </div>
    );
  }

  if (file.type === "pdf") {
    return (
      <div className="brand-file-preview is-document" aria-label={`Prévia de ${file.name}`}>
        <span className="brand-file-type">PDF</span>
        <strong>{categoryLabel}</strong>
      </div>
    );
  }

  if (file.type === "font") {
    return (
      <div className="brand-file-preview is-font" aria-label={`Prévia de ${file.name}`}>
        <span className="brand-file-type">Aa</span>
        <strong>Fonte</strong>
      </div>
    );
  }

  return (
    <div className="brand-file-preview is-document" aria-label={`Arquivo ${file.name}`}>
      <span className="brand-file-type">{file.extension.toUpperCase().replace('.', '') || 'FILE'}</span>
      <strong>{getFileKind(file.type)}</strong>
    </div>
  );
}

export default function FileCard({ file, categoryLabel }) {
  const displayName = normalizeAssetLabel(file.fileName);

  const assetUrl = resolveAssetPath(file.path);

  return (
    <article className="brand-file-card">
      <FilePreview file={file} categoryLabel={categoryLabel} />
      <div className="brand-file-card-body">
        <div className="brand-file-meta">
          <span>{getFileKind(file.type)}</span>
          <span>{file.extension.toUpperCase().replace('.', '') || "FILE"}</span>
        </div>
        <h3>{displayName}</h3>
        <p>{file.fileName}</p>
        <div className="brand-file-actions">
          <a className="button secondary small" href={assetUrl} target="_blank" rel="noreferrer">
            Download
          </a>
          {file.type === "image" || file.type === "pdf" ? (
            <a className="text-link small" href={assetUrl} target="_blank" rel="noreferrer">
              Abrir
            </a>
          ) : null}
        </div>
        <small>{formatBytes(file.size)}</small>
      </div>
    </article>
  );
}
