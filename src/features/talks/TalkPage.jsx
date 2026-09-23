import { ArrowIcon } from "../../components/SiteUI";
import { formatEventDate } from "../../lib/events";
import { routeHref } from "../../lib/routes";
import { talks } from "./talks";
import "./talks.css";

function SectionHead({ id, eyebrow, title, description }) {
  return (
    <header className="talk-head">
      <p className="talk-eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {description && <p>{description}</p>}
    </header>
  );
}

function Hero({ slug, talk }) {
  const { kind, series, title, date, time, speaker, lead, cover } = talk;
  return (
    <section className="talk-hero" aria-labelledby="talk-title">
      <div className="talk-hero-copy">
        <p className="path-prompt" aria-hidden="true">
          <span>unbreakable@unb</span>:<span>~</span>$ cat ./eventos/{slug}.md
        </p>
        <p className="talk-chip">
          <span>{kind}</span>
          {series}
        </p>
        <h1 id="talk-title">{title}</h1>
        <p className="talk-when">
          <time dateTime={date}>{formatEventDate(date)}</time>
          {time && <span>{time}</span>}
        </p>
        <div className="talk-speaker">
          <p className="talk-speaker-name">{speaker.name}</p>
          {speaker.note && <p>{speaker.note}</p>}
          {speaker.roles && (
            <ul aria-label="Atuação da palestrante">
              {speaker.roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          )}
        </div>
        <p className="talk-lead">{lead}</p>
      </div>
      <figure
        className={cover.portrait ? "talk-cover is-portrait" : "talk-cover"}
      >
        <img
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
        />
        <figcaption>{cover.caption}</figcaption>
      </figure>
    </section>
  );
}

function Chain({ eyebrow, title, description, steps }) {
  return (
    <section className="talk-section talk-split" aria-labelledby="talk-chain">
      <SectionHead
        id="talk-chain"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <ol className="talk-steps">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={step.highlight ? "is-highlight" : undefined}
          >
            <span className="talk-step-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="talk-step-phase">{step.phase}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Nodes and links alternate left to right; the zone wraps a run of nodes (and
// the links between them) in a dashed "network" boundary. Stacks on phones.
function FlowDiagram({ label, caption, zone, nodes, links }) {
  const items = nodes.flatMap((node, index) => {
    const nodeItem = (
      <div key={`node-${index}`} className={`talk-node is-${node.role}`}>
        <strong>{node.title}</strong>
        {node.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>
    );
    const link = links[index];
    if (!link) return [nodeItem];
    return [
      nodeItem,
      <div
        key={`link-${index}`}
        className={link.both ? "talk-link is-both" : "talk-link"}
      >
        <span className="talk-link-line" aria-hidden="true" />
        <span className="talk-link-label">
          <b>{link.label}</b>
          {link.note}
        </span>
      </div>,
    ];
  });
  // Item positions: node i sits at 2i, the link after it at 2i + 1.
  const start = zone.from * 2;
  const end = zone.to * 2 + 1;

  return (
    <figure className="talk-diagram" aria-label={label}>
      <div className="talk-flow">
        {items.slice(0, start)}
        <div className="talk-zone">
          <span className="talk-zone-label">{zone.label}</span>
          {items.slice(start, end)}
        </div>
        {items.slice(end)}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

function Cards({ items, className = "" }) {
  return (
    <ul className={`talk-cards ${className}`}>
      {items.map(({ tag, title, description }) => (
        <li key={title} className="talk-card">
          <span className="talk-card-tag">{tag}</span>
          <h3>{title}</h3>
          <p>{description}</p>
        </li>
      ))}
    </ul>
  );
}

function Pivot({ eyebrow, title, description, diagram, concepts }) {
  return (
    <section className="talk-section" aria-labelledby="talk-pivot">
      <SectionHead
        id="talk-pivot"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <FlowDiagram {...diagram} />
      <Cards items={concepts} />
    </section>
  );
}

// Colours the data-carrying labels of a tunnelled name apart from the
// sequence label ("t1") and the attacker's domain.
function TunnelQuery({ name }) {
  const parts = name.split(".");
  const sequence = parts.findIndex((part) => /^t\d+$/.test(part));
  return (
    <code>
      <span className="is-data">{parts.slice(0, sequence).join(".")}</span>.
      <span className="is-seq">{parts[sequence]}</span>.
      {parts.slice(sequence + 1).join(".")}
    </code>
  );
}

function Threat({ eyebrow, title, description, diagram, steps, queries }) {
  return (
    <section className="talk-section" aria-labelledby="talk-threat">
      <SectionHead
        id="talk-threat"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <FlowDiagram {...diagram} />
      <ol className="talk-mini-steps">
        {steps.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </li>
        ))}
      </ol>
      <figure className="talk-queries">
        <div>
          <p className="talk-queries-label">Consulta comum</p>
          <code>{queries.normal}</code>
        </div>
        <div>
          <p className="talk-queries-label">Consultas de um túnel</p>
          {queries.tunnel.map((name) => (
            <TunnelQuery key={name} name={name} />
          ))}
        </div>
        <figcaption>{queries.caption}</figcaption>
      </figure>
    </section>
  );
}

function Signals({ eyebrow, title, description, items }) {
  return (
    <section className="talk-section" aria-labelledby="talk-signals">
      <SectionHead
        id="talk-signals"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <Cards items={items} className="is-four" />
    </section>
  );
}

function AwardIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="m8.5 13.8-1.5 7.7 5-2.8 5 2.8-1.5-7.7" />
    </svg>
  );
}

function Slide({ eyebrow, src, alt, width, height, caption }) {
  return (
    <section className="talk-section" aria-label={eyebrow}>
      <p className="talk-eyebrow">{eyebrow}</p>
      <figure className="talk-slide">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
        <figcaption>{caption}</figcaption>
      </figure>
    </section>
  );
}

function Research({ eyebrow, title, description, publications, award }) {
  return (
    <section
      className="talk-section talk-split"
      aria-labelledby="talk-research"
    >
      <SectionHead
        id="talk-research"
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
      <div className="talk-research">
        <ul className="talk-publications">
          {publications.map((item) => (
            <li key={item.title}>
              <span className="talk-card-tag">{item.kind}</span>
              <p className={item.quoted ? "is-quoted" : undefined}>
                {item.title}
              </p>
              <small>{item.venue}</small>
            </li>
          ))}
        </ul>
        <div className="talk-award">
          <AwardIcon />
          <div>
            <strong>{award.title}</strong>
            <span>{award.venue}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Quote({ text, author, source }) {
  return (
    <section className="talk-section" aria-label="Citação">
      <figure className="talk-quote">
        <blockquote>
          <p>{text}</p>
        </blockquote>
        <figcaption>
          <strong>{author}</strong>, {source}
        </figcaption>
      </figure>
    </section>
  );
}

function Closing({ slug, title, description }) {
  const others = Object.entries(talks).filter(([other]) => other !== slug);
  return (
    <section className="talk-section talk-closing" aria-labelledby="talk-end">
      <div>
        <h2 id="talk-end">{title}</h2>
        <p>{description}</p>
      </div>
      <div className="talk-closing-actions">
        <a className="button primary" href={routeHref("/contato")}>
          Canais oficiais <ArrowIcon />
        </a>
        {others.map(([other, talk]) => (
          <a key={other} className="text-link" href={routeHref(talk.path)}>
            Outra palestra: {talk.title} <ArrowIcon />
          </a>
        ))}
        <a className="text-link" href={routeHref("/eventos")}>
          Todos os eventos <ArrowIcon />
        </a>
      </div>
    </section>
  );
}

export default function TalkPage({ slug }) {
  const talk = talks[slug];
  return (
    <main id="conteudo-principal" className={`talk is-${talk.theme}`}>
      <Hero slug={slug} talk={talk} />
      {talk.slide && <Slide {...talk.slide} />}
      {talk.chain && <Chain {...talk.chain} />}
      {talk.pivot && <Pivot {...talk.pivot} />}
      {talk.threat && <Threat {...talk.threat} />}
      {talk.signals && <Signals {...talk.signals} />}
      {talk.research && <Research {...talk.research} />}
      {talk.quote && <Quote {...talk.quote} />}
      <Closing slug={slug} {...talk.closing} />
    </main>
  );
}
