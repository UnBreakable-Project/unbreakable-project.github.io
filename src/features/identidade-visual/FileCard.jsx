import {
  getFileKind,
  normalizeAssetLabel,
  resolveAssetPath,
} from "./brandAssetUtils";

function FilePreview({ file, categoryLabel, onCopyColor }) {
  if (file.type === "image") {
    return (
      <div
        className={`brand-file-preview is-image ${
          file.previewSurface === "light" ? "has-light-surface" : ""
        }`}
      >
        <img src={resolveAssetPath(file.path)} alt="" loading="lazy" />
      </div>
    );
  }

  if (file.type === "pdf") {
    if (file.color) {
      return (
        <div
          className="brand-file-preview is-swatch"
          style={{
            "--swatch-color": file.color,
            "--swatch-text": getSwatchTextColor(file.color),
          }}
          aria-label={`${file.label}: ${file.color}`}
        >
          <div className="brand-color-controls">
            <input
              className="brand-color-value"
              type="text"
              value={file.color}
              readOnly
              aria-label={`Código ${file.color} de ${file.label}`}
              onFocus={(event) => event.currentTarget.select()}
              onClick={(event) => event.currentTarget.select()}
            />
            <button
              type="button"
              className="brand-color-copy"
              onClick={() => onCopyColor(file.color, file.label)}
              aria-label={`Copiar código ${file.color} de ${file.label}`}
            >
              Copiar código
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="brand-file-preview is-document"
        aria-label={`Prévia de ${file.name}`}
      >
        <span className="brand-file-type">PDF</span>
        <strong>{categoryLabel}</strong>
      </div>
    );
  }

  if (file.type === "font") {
    return (
      <div
        className="brand-file-preview is-font"
        aria-label={`Prévia de ${file.name}`}
      >
        <span className="brand-file-type">Aa</span>
        <strong>Fonte</strong>
      </div>
    );
  }

  return (
    <div
      className="brand-file-preview is-document"
      aria-label={`Arquivo ${file.name}`}
    >
      <span className="brand-file-type">
        {file.extension.toUpperCase().replace(".", "") || "FILE"}
      </span>
      <strong>{getFileKind(file.type)}</strong>
    </div>
  );
}

function getSwatchTextColor(color) {
  const hex = color.replace("#", "");
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

  return luminance > 150 ? "#080510" : "#f7f3ff";
}

export default function FileCard({
  file,
  categoryLabel,
  onCopyColor,
  onDownload,
}) {
  const displayName = file.label ?? normalizeAssetLabel(file.fileName);
  const formats = file.formats ?? [file];
  const hasMultipleFormats = formats.length > 1;

  return (
    <article className="brand-file-card">
      <FilePreview
        file={file}
        categoryLabel={categoryLabel}
        onCopyColor={onCopyColor}
      />
      <div className="brand-file-card-body">
        <div className="brand-file-meta">
          <span>
            {file.type === "pdf" ? "Documento" : getFileKind(file.type)}
          </span>
        </div>
        <h3>{displayName}</h3>
        <div className="brand-file-recommendation-slot">
          {file.recommended && (
            <span className="brand-file-recommended">Versão preferida</span>
          )}
        </div>
        <p>{file.usage ?? file.fileName}</p>
        <div
          className={`brand-file-actions ${
            hasMultipleFormats ? "is-format-list" : ""
          }`}
        >
          {formats.map((format) => {
            const formatName = format.extension.replace(".", "").toUpperCase();

            return (
              <a
                key={format.path}
                className="button secondary small"
                href={resolveAssetPath(format.path)}
                download
                onClick={() =>
                  onDownload(
                    hasMultipleFormats
                      ? `${displayName} em ${formatName}`
                      : displayName,
                  )
                }
              >
                {`Baixar ${formatName}`}
              </a>
            );
          })}
          {!hasMultipleFormats &&
          (file.type === "image" || file.type === "pdf") ? (
            <a
              className="text-link small"
              href={resolveAssetPath(file.path)}
              target="_blank"
              rel="noreferrer"
            >
              Abrir em nova aba
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
