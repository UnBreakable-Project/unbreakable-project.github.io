export default function VisualIdentityTabs({ categories, activeCategory, onSelect }) {
  return (
    <nav
      className="brand-tabs"
      aria-label="Categorias de identidade visual"
      aria-live="polite"
    >
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
  );
}
