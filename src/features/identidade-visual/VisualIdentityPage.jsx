import { useEffect, useMemo, useState } from "react";
import { visualIdentityManifest } from "../../data/visual-identity-manifest";
import { resolveAssetPath } from "./brandAssetUtils";
import FileCard from "./FileCard";
import VisualIdentityTabs from "./VisualIdentityTabs";

function emptyStateMessage() {
  return "Ainda não há arquivos nesta categoria.";
}

export default function VisualIdentityPage() {
  const [activeCategory, setActiveCategory] = useState(visualIdentityManifest[0]?.slug ?? "");

  useEffect(() => {
    if (!visualIdentityManifest.some((category) => category.slug === activeCategory)) {
      setActiveCategory(visualIdentityManifest[0]?.slug ?? "");
    }
  }, [activeCategory]);

  const currentCategory = useMemo(
    () =>
      visualIdentityManifest.find((category) => category.slug === activeCategory) ??
      visualIdentityManifest[0],
    [activeCategory],
  );

  return (
    <>
      <section className="page-head identity-head">
        <img src={resolveAssetPath("/identidade-visual/logos/logo-principal.svg")} alt="" />
        <div>
          <h1>Identidade Visual</h1>
          <p>
            Arquivos de marca, materiais institucionais e referências visuais para uso e consulta oficial.
          </p>
        </div>
      </section>

      <main id="conteudo-principal" className="page-content identity-page">
        <div className="identity-summary">
          <p>
            A pasta de identidade visual é organizada por categoria para facilitar a consulta, o uso e a manutenção da marca.
          </p>
        </div>

        {visualIdentityManifest.length > 0 ? (
          <>
            <VisualIdentityTabs
              categories={visualIdentityManifest}
              activeCategory={currentCategory?.slug ?? ""}
              onSelect={setActiveCategory}
            />

            <section className="brand-category-panel" aria-live="polite">
              {currentCategory ? (
                <>
                  <header className="brand-category-header">
                    <div>
                      <span className="micro">Categoria</span>
                      <h2>{currentCategory.label}</h2>
                    </div>
                    <p>{currentCategory.description}</p>
                  </header>

                  {currentCategory.files.length > 0 ? (
                    <div className="brand-file-grid">
                      {currentCategory.files.map((file) => (
                        <FileCard
                          key={file.id}
                          file={file}
                          categoryLabel={currentCategory.label}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="brand-empty-state">{emptyStateMessage()}</div>
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
