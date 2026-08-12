import { useState } from "react";
import { siteContent } from "../../content/site.mdx";
import { visualIdentityAssets } from "../../data/visual-identity-manifest";
import {
  buildVisualIdentityManifest,
  resolveAssetPath,
} from "./brandAssetUtils";
import FileCard from "./FileCard";
import VisualIdentityTabs from "./VisualIdentityTabs";

const identityContent = siteContent.visualIdentity;
const visualIdentityManifest = buildVisualIdentityManifest(
  visualIdentityAssets,
  identityContent,
);

function resolveContentHref(href) {
  if (/^https?:\/\//.test(href)) return href;
  return `${import.meta.env.BASE_URL}${href.replace(/^\//, "")}`;
}

function groupFilesByApplication(files) {
  const groups = new Map();

  files.forEach((file) => {
    const group = file.group ?? "Outros arquivos";
    const groupedFiles = groups.get(group) ?? [];
    groupedFiles.push(file);
    groups.set(group, groupedFiles);
  });

  return Array.from(groups, ([label, groupedFiles]) => ({
    label,
    files: groupedFiles,
  }));
}

export default function VisualIdentityPage() {
  const [activeCategory, setActiveCategory] = useState(
    visualIdentityManifest[0]?.slug ?? "",
  );
  const [statusMessage, setStatusMessage] = useState("");

  const currentCategory =
    visualIdentityManifest.find(
      (category) => category.slug === activeCategory,
    ) ?? visualIdentityManifest[0];
  const primaryLogo = visualIdentityManifest
    .find((category) => category.slug === "logos")
    ?.files.find((file) => file.recommended);

  const announce = (message) => setStatusMessage(message);

  const selectCategory = (slug) => {
    const category = visualIdentityManifest.find((item) => item.slug === slug);
    setActiveCategory(slug);
    announce(`Exibindo a categoria ${category?.label ?? slug}.`);
  };

  const copyColor = async (color, label) => {
    try {
      if (!globalThis.navigator?.clipboard?.writeText) {
        throw new Error("Área de transferência indisponível");
      }

      await globalThis.navigator.clipboard.writeText(color);
      announce(`Código ${color} de ${label} copiado.`);
    } catch {
      announce(
        `Não foi possível copiar automaticamente ${color}. Copie o código exibido.`,
      );
    }
  };

  const renderFileCard = (file, categoryLabel) => (
    <FileCard
      key={file.id}
      file={file}
      categoryLabel={categoryLabel}
      onCopyColor={copyColor}
      onDownload={(name) =>
        announce(`Solicitação de download de ${name} acionada.`)
      }
    />
  );

  return (
    <>
      <section className="page-head identity-head">
        {primaryLogo && <img src={resolveAssetPath(primaryLogo.path)} alt="" />}
        <div>
          <h1>{identityContent.title}</h1>
          <p>{identityContent.description}</p>
        </div>
      </section>

      <main id="conteudo-principal" className="page-content identity-page">
        <div className="identity-summary">
          <p>{identityContent.introduction}</p>
          <div
            className="brand-usage-essentials"
            aria-labelledby="uso-essencial"
          >
            <h2 id="uso-essencial">{identityContent.essentials.title}</h2>
            <ul>
              {identityContent.essentials.rules.map((rule) => (
                <li key={rule.text ?? rule.before}>
                  {rule.text ?? rule.before}
                  {rule.link && (
                    <a href={resolveContentHref(rule.link.href)}>
                      {rule.link.label}
                    </a>
                  )}
                  {rule.after}
                </li>
              ))}
            </ul>
          </div>
          <p
            className="brand-status"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {statusMessage}
          </p>
        </div>

        {visualIdentityManifest.length > 0 ? (
          <>
            <VisualIdentityTabs
              categories={visualIdentityManifest}
              activeCategory={currentCategory?.slug ?? ""}
              onSelect={selectCategory}
            />

            <section className="brand-category-panel">
              {currentCategory ? (
                <>
                  <header className="brand-category-header">
                    <div>
                      <h2>{currentCategory.label}</h2>
                    </div>
                    <div>
                      <p>{currentCategory.description}</p>
                      <p className="brand-category-guidance">
                        {currentCategory.usage}
                      </p>
                    </div>
                  </header>

                  {currentCategory.files.length > 0 ? (
                    (() => {
                      const fileGroups = groupFilesByApplication(
                        currentCategory.files,
                      );
                      const hasApplicationGroups =
                        fileGroups.length > 1 ||
                        currentCategory.files.some((file) => file.group);

                      if (!hasApplicationGroups) {
                        return (
                          <div className="brand-file-grid">
                            {currentCategory.files.map((file) =>
                              renderFileCard(file, currentCategory.label),
                            )}
                          </div>
                        );
                      }

                      return (
                        <div className="brand-file-groups">
                          {fileGroups.map((group) => (
                            <section
                              key={group.label}
                              className="brand-file-group"
                              aria-label={group.label}
                            >
                              <h3>{group.label}</h3>
                              <div className="brand-file-grid">
                                {group.files.map((file) =>
                                  renderFileCard(file, currentCategory.label),
                                )}
                              </div>
                            </section>
                          ))}
                        </div>
                      );
                    })()
                  ) : (
                    <div className="brand-empty-state">
                      Ainda não há arquivos nesta categoria.
                    </div>
                  )}
                </>
              ) : null}
            </section>
          </>
        ) : (
          <div className="brand-empty-state">Nenhuma categoria encontrada.</div>
        )}
      </main>
    </>
  );
}
