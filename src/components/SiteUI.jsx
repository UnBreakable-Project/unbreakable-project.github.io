import { siteContent } from "../content/site.mdx";
import { routeHref } from "../lib/routes";
const { events } = siteContent;

export function ArrowIcon({ direction = "right" }) {
  const paths = {
    right: "M3 12h17M14 5l7 7-7 7",
    down: "M12 3v17M5 14l7 7 7-7",
  };
  return (
    <svg className="action-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={paths[direction]} />
    </svg>
  );
}

export function EventList({ compact = false }) {
  return (
    <div className={compact ? "event-list compact" : "event-list"}>
      {events.map(({ type, title, presenter, href }) => (
        <article key={title} className="event-row">
          <span>{type}</span>
          <h3>{href ? <a href={routeHref(href)}>{title}</a> : title}</h3>
          <p>{presenter}</p>
        </article>
      ))}
    </div>
  );
}
