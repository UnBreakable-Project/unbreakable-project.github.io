export default function VisualIdentityTabs({
  categories,
  activeCategory,
  onSelect,
}) {
  return (
    <div className="brand-tabs-wrap">
      <nav className="brand-tabs" aria-label="Categorias de identidade visual">
        {categories.map(({ slug, label }) => (
          <button
            key={slug}
            type="button"
            className={activeCategory === slug ? "is-active" : ""}
            onClick={() => onSelect(slug)}
            aria-pressed={activeCategory === slug}
          >
            {label}
          </button>
        ))}
      </nav>
      <p className="brand-tabs-hint" aria-hidden="true">
        Deslize para ver todas as categorias
      </p>
    </div>
  );
}
