import { siteContent } from "../../content/site.mdx";
import { ArrowIcon } from "../../components/SiteUI";
import { wposPoster } from "../../data/page-meta";
import { eventIsUpcoming, formatEventDate } from "../../lib/events";
import { routeHref } from "../../lib/routes";
import PhotoCarousel from "../pink-hat/PhotoCarousel";
// The event-page kit (hero, cards, carousel, podium) is themed through the
// --ph-* tokens; wpos.css redefines them on .wpos for the WPOS navy/green look.
import "../pink-hat/pink-hat.css";
import "../pink-hat/gallery.css";
import "./wpos.css";

const { wpos, socialLinks } = siteContent;
const instagram = socialLinks.find(({ name }) => name === "Instagram");

// Only the gallery photos are bundled (the "1794869610…" shots plus the trophy
// photo); the folder also holds the poster and the reference logo, which the
// page does not import.
const photoModules = import.meta.glob(
  [
    "../../assets/eventos/wpos/1794869610*.jpg",
    "../../assets/eventos/wpos/trofeus.jpeg",
  ],
  { eager: true, import: "default" },
);
const photoByFileName = Object.fromEntries(
  Object.entries(photoModules).map(([path, url]) => [
    path.split("/").pop(),
    url,
  ]),
);
const photos = wpos.gallery.photos.map((photo) => ({
  ...photo,
  src: photoByFileName[photo.file],
}));

// Pixel dissolve echoing a flag, nodding to the "Capture the Flag". "#" = square.
const pixelRows = [
  "######",
  "##....",
  "##.##.",
  "##....",
  "##.###",
  "##....",
  "##....",
  "##....",
];

// Hooded pixel figure, after the trophies in the photos. "#" = filled square.
const trophyRows = [
  "....######....",
  "...########...",
  "..##########..",
  "..###....###..",
  "..##......##..",
  "..###....###..",
  "...########...",
  "..##########..",
  ".############.",
  "##############",
  "##############",
  "##############",
  "##############",
];

// Slow-drifting squares behind the hero: [left %, top %, size px, delay s].
const floaters = [
  [6, 18, 10, 0],
  [3, 80, 14, 1.4],
  [38, 8, 8, 0.7],
  [52, 84, 12, 2.1],
  [61, 26, 8, 3.2],
  [90, 12, 12, 1.1],
  [94, 78, 8, 2.6],
];

function renderPixels(rows, size = 10, gap = 1) {
  return rows.flatMap((row, y) =>
    [...row].map((cell, x) =>
      cell === "#" ? (
        <rect
          key={`${x}-${y}`}
          x={x * size}
          y={y * size}
          width={size - gap}
          height={size - gap}
        />
      ) : null,
    ),
  );
}

function Pixels() {
  return (
    <svg
      className="ph-pixels"
      viewBox="0 0 60 80"
      aria-hidden="true"
      focusable="false"
    >
      {renderPixels(pixelRows, 10, 2)}
    </svg>
  );
}

// A circuit trace echoing the green traces in the WPOS wolf logo.
const circuitNodes = [
  [2, 10],
  [26, 4],
  [50, 10],
  [74, 16],
  [98, 10],
  [122, 4],
  [138, 10],
];
function Circuit({ className = "ph-chevrons" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 140 20"
      aria-hidden="true"
      focusable="false"
    >
      <polyline points={circuitNodes.map(([x, y]) => `${x},${y}`).join(" ")} />
      {circuitNodes.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="2.6" />
      ))}
    </svg>
  );
}

function Divider() {
  return (
    <div className="ph-divider" aria-hidden="true">
      <Circuit className="ph-chevrons ph-chevrons-sm" />
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 21s7-5.6 7-11.2A7 7 0 0 0 5 9.8C5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function Trophy({ place }) {
  return (
    <svg
      className="ph-trophy"
      viewBox="0 0 140 130"
      aria-hidden="true"
      focusable="false"
    >
      {renderPixels(trophyRows, 10, 1)}
      <text x="70" y="122" textAnchor="middle">
        {place}
      </text>
    </svg>
  );
}

function Podium({ eyebrow, title, description, places }) {
  return (
    <section className="ph-section" aria-labelledby="wp-podium">
      <p className="ph-eyebrow">{eyebrow}</p>
      <h2 id="wp-podium">{title}</h2>
      <p className="ph-lede">{description}</p>
      {/* DOM order is 1, 2, 3 for reading; CSS lays it out as 2-1-3. */}
      <ol className="ph-podium" aria-label="Pódio">
        {places.map(({ place, label, medal }) => (
          <li
            key={place}
            className={`ph-place ph-place-${place}`}
            data-medal={medal}
          >
            <Trophy place={place} />
            <div className="ph-step">
              <span className="ph-plate">{label}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function WposPage() {
  const upcoming = eventIsUpcoming(wpos.date);
  const [, month, day] = wpos.date.split("-");

  return (
    <main id="conteudo-principal" className="wpos">
      <section className="ph-hero" aria-labelledby="wp-title">
        <div className="ph-floaters" aria-hidden="true">
          {floaters.map(([left, top, size, delay]) => (
            <span
              key={`${left}-${top}`}
              style={{
                "--x": `${left}%`,
                "--y": `${top}%`,
                "--s": `${size}px`,
                "--d": `${delay}s`,
              }}
            />
          ))}
        </div>
        <div className="ph-hero-copy">
          <p className="ph-status">
            <span className="ph-dot" aria-hidden="true" />
            {upcoming ? "Próximo evento" : "Evento realizado"}
          </p>
          <Circuit />
          <h1 id="wp-title">
            <span className="ph-ctf-row">
              <Pixels />
              <span className="ph-ctf" data-text="CTF">
                CTF
              </span>
            </span>{" "}
            <span className="ph-name">
              <span className="ph-pink">WPOS</span> <span>·26</span>
            </span>
          </h1>
          <p className="ph-tagline">
            Capture the <em>Flag</em>
          </p>
          <p className="ph-intro">{wpos.intro}</p>
          <div className="ph-actions">
            {instagram && (
              <a
                className="ph-button"
                href={instagram.url}
                target="_blank"
                rel="noreferrer"
              >
                Acompanhar no Instagram <ArrowIcon />
              </a>
            )}
            <a className="ph-link" href={routeHref("/eventos")}>
              Todos os eventos <ArrowIcon />
            </a>
          </div>
        </div>
        <figure className="ph-poster">
          <img
            src={wposPoster}
            alt="Cartaz do CTF do UnBreakable no WPOS-26"
            width="1080"
            height="1080"
          />
        </figure>
      </section>

      <section className="ph-when" aria-label="Data e local">
        <div className="ph-when-item">
          <CalendarIcon />
          <div>
            <time className="ph-big" dateTime={wpos.date}>
              <span className="ph-pink">{day}/</span>
              {month}
            </time>
            <p>{formatEventDate(wpos.date)}</p>
          </div>
        </div>
        <div className="ph-when-item">
          <PinIcon />
          <div>
            <p className="ph-big">{wpos.place}</p>
            <p>{wpos.location}</p>
          </div>
        </div>
      </section>

      <section className="ph-section" aria-labelledby="wp-activities">
        <p className="ph-eyebrow">Sobre o evento</p>
        <h2 id="wp-activities">
          Desafie suas habilidades de segurança ofensiva
        </h2>
        <ul className="ph-cards">
          {wpos.activities.map(({ tag, title, description }, index) => (
            <li key={tag} className="ph-card">
              <span className="ph-card-tag">
                {String(index + 1).padStart(2, "0")} / {tag}
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
        </ul>
      </section>

      <Divider />

      <section className="ph-section" aria-labelledby="wp-gallery-title">
        <p className="ph-eyebrow">Galeria</p>
        <h2 id="wp-gallery-title">O CTF em fotos.</h2>
        <PhotoCarousel label={wpos.gallery.label} photos={photos} />
      </section>

      <Divider />

      <Podium {...wpos.podium} />

      <section className="ph-closing">
        <div>
          <h2>{wpos.closing.title}</h2>
          <p>{wpos.closing.description}</p>
        </div>
        <a className="ph-button" href={routeHref("/contato")}>
          Canais oficiais <ArrowIcon />
        </a>
      </section>
    </main>
  );
}
