import { siteContent } from "../../content/site.mdx";
import { ArrowIcon } from "../../components/SiteUI";
import { pinkHatPoster } from "../../data/page-meta";
import { eventIsUpcoming, formatEventDate } from "../../lib/events";
import { routeHref } from "../../lib/routes";
import "./pink-hat.css";

const { pinkHat, nextEvent, socialLinks } = siteContent;
const instagram = socialLinks.find(({ name }) => name === "Instagram");

// Pixel dissolve echoing the "C" of the event logo. "#" = filled square.
const pixelRows = [
  "..#.##",
  ".#..##",
  "#.#.##",
  "..#.##",
  ".#.###",
  "#...##",
  "..#.##",
  ".#.###",
];

function Pixels() {
  return (
    <svg
      className="ph-pixels"
      viewBox="0 0 60 80"
      aria-hidden="true"
      focusable="false"
    >
      {pixelRows.flatMap((row, y) =>
        [...row].map((cell, x) =>
          cell === "#" ? (
            <rect
              key={`${x}-${y}`}
              x={x * 10}
              y={y * 10}
              width="8"
              height="8"
            />
          ) : null,
        ),
      )}
    </svg>
  );
}

function Chevrons() {
  return (
    <svg
      className="ph-chevrons"
      viewBox="0 0 140 20"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: 7 }, (_, index) => (
        <polyline
          key={index}
          style={{ "--i": index }}
          points={`${index * 20 + 4},2 ${index * 20 + 14},10 ${index * 20 + 4},18`}
        />
      ))}
    </svg>
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

export default function PinkHatPage() {
  const upcoming = eventIsUpcoming(pinkHat.date);
  const [, month, day] = pinkHat.date.split("-");

  return (
    <main id="conteudo-principal" className="pinkhat">
      <section className="ph-hero" aria-labelledby="ph-title">
        <div className="ph-hero-copy">
          <p className="ph-status">
            <span className="ph-dot" aria-hidden="true" />
            {upcoming ? "Próximo evento" : "Evento realizado"}
          </p>
          <Chevrons />
          <h1 id="ph-title">
            <span className="ph-ctf-row">
              <Pixels />
              <span className="ph-ctf">CTF</span>
            </span>{" "}
            <span className="ph-name">
              <span className="ph-pink">Pink</span> <span>Hat</span>
            </span>
          </h1>
          <p className="ph-tagline">
            Pwning like a <em>girl</em>
          </p>
          <p className="ph-intro">{pinkHat.intro}</p>
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
            src={pinkHatPoster}
            alt={nextEvent.imageAlt}
            width="1080"
            height="1350"
          />
        </figure>
      </section>

      <section className="ph-when" aria-label="Data e local">
        <div className="ph-when-item">
          <CalendarIcon />
          <div>
            <time className="ph-big" dateTime={pinkHat.date}>
              <span className="ph-pink">{day}/</span>
              {month}
            </time>
            <p>{formatEventDate(pinkHat.date)}</p>
          </div>
        </div>
        <div className="ph-when-item">
          <PinIcon />
          <div>
            <p className="ph-big">{pinkHat.place}</p>
            <p>{pinkHat.location}</p>
          </div>
        </div>
      </section>

      <section className="ph-section" aria-labelledby="ph-activities">
        <p className="ph-eyebrow">Sobre o evento</p>
        <h2 id="ph-activities">Desafios, workshops e oficinas.</h2>
        <ul className="ph-cards">
          {pinkHat.activities.map(({ tag, title, description }, index) => (
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

      <section className="ph-panel" aria-label="Realização e apoio">
        <div>
          <h2>Realização</h2>
          <ul>
            {pinkHat.organizers.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Apoio</h2>
          <ul>
            {pinkHat.supporters.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ph-closing">
        <div>
          <h2>{pinkHat.closing.title}</h2>
          <p>{pinkHat.closing.description}</p>
        </div>
        <a className="ph-button" href={routeHref("/contato")}>
          Canais oficiais <ArrowIcon />
        </a>
      </section>
    </main>
  );
}
