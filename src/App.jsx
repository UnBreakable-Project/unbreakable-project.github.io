import { eventIsUpcoming, formatEventDate } from "./lib/events";
import {
  pageMeta,
  notFoundMeta,
  pinkHatPoster,
  redirects,
} from "./data/page-meta";
import { useCallback, useEffect, useMemo, useState } from "react";
import CommandPalette from "./components/CommandPalette";
import MatrixRain from "./components/MatrixRain";
import { buildCommands } from "./lib/commands";
import { useKonami } from "./lib/konami";
import Home from "./features/home/Home";
import Accordion from "./components/Accordion";
import { ArrowIcon } from "./components/SiteUI";
import { routeHref } from "./lib/routes";
import mark from "./assets/unbreakable-mark.svg";
import PinkHatPage from "./features/pink-hat/PinkHatPage";
import TalkPage from "./features/talks/TalkPage";
import { findTalkSlug, talks } from "./features/talks/talks";
import { siteContent } from "./content/site.mdx";
import VisualIdentityPage from "./features/identidade-visual/VisualIdentityPage";

const photoModules = import.meta.glob(
  "./assets/Fotos-gestão/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

const photoByFileName = Object.fromEntries(
  Object.entries(photoModules).map(([path, url]) => [
    path.split("/").pop(),
    url,
  ]),
);

function resolvePhoto(profile) {
  if (!profile.photo) return null;
  return photoByFileName[profile.photo] ?? null;
}

const resolveProfiles = (profiles) =>
  profiles.map((profile) => ({
    ...profile,
    photo: resolvePhoto(profile),
  }));

const {
  navigation: links,
  events,
  nextEvent,
  pages,
  socialLinks,
} = siteContent;
const members = resolveProfiles(siteContent.members);

const siteBase = import.meta.env.BASE_URL;

function currentPath() {
  const basePath = siteBase.endsWith("/") ? siteBase.slice(0, -1) : siteBase;
  const path = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length) || "/"
    : window.location.pathname;

  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function homeAnchor(id, isHome) {
  return isHome ? `#${id}` : `${siteBase}#${id}`;
}

const isApple =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad/.test(
    navigator.userAgentData?.platform ?? navigator.platform,
  );

function isEditable(target) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.closest("input, textarea, select"))
  );
}

function Header({ onOpenPalette }) {
  const isHome = currentPath() === "/";
  const path = currentPath();
  const isContact = path === "/contato";
  const isIdentityVisual = path === "/identidade-visual";
  const talkSlug = findTalkSlug(path);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = links.map(({ target }) => target);
    let frameId = 0;

    const updateActiveSection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollY < 120) {
        setActiveSection("");
        return;
      }

      if (
        documentHeight > windowHeight &&
        scrollY + windowHeight >= documentHeight - 60
      ) {
        setActiveSection("participar");
        return;
      }

      const headerHeight =
        document.querySelector(".site-header")?.getBoundingClientRect()
          .height ?? 0;
      const readingLine = scrollY + headerHeight + windowHeight * 0.24;
      const current = sectionIds.reduce((active, id) => {
        const section = document.getElementById(id);
        return section && section.offsetTop <= readingLine ? id : active;
      }, "");

      setActiveSection(current);
    };

    const onScroll = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("hashchange", onScroll);
    updateActiveSection();

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.querySelector(".menu-button")?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const currentActiveSection = isHome ? activeSection : "";

  return (
    <header
      className={
        path === "/eventos/ctf-pink-hat"
          ? "site-header is-pinkhat"
          : talkSlug
            ? `site-header is-talk is-${talks[talkSlug].theme}`
            : "site-header"
      }
    >
      <div className="header-inner">
        <a className="brand" href={siteBase} onClick={() => setOpen(false)}>
          <img className="brand-mark" src={mark} alt="" />
          <span className="brand-name">
            UnBreakable<em>UnB</em>
          </span>
        </a>
        <nav
          id="primary-navigation"
          className={open ? "nav open" : "nav"}
          aria-label="Navegação principal"
        >
          {links.map(({ label, target }) => {
            const isActive = isHome && currentActiveSection === target;
            return (
              <a
                key={target}
                href={homeAnchor(target, isHome)}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            );
          })}
          <a
            href={routeHref("/eventos")}
            className={path.startsWith("/eventos") ? "is-active" : undefined}
            aria-current={path === "/eventos" ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Eventos
          </a>
          <a
            href={routeHref("/equipe")}
            className={path === "/equipe" ? "is-active" : undefined}
            aria-current={path === "/equipe" ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Equipe
          </a>
          <a
            href={routeHref("/identidade-visual")}
            className={isIdentityVisual ? "is-active" : undefined}
            aria-current={isIdentityVisual ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Identidade Visual
          </a>
          <a
            className={
              isContact ? "mobile-contact is-active" : "mobile-contact"
            }
            href={routeHref("/contato")}
            aria-current={isContact ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            Canais oficiais
          </a>
        </nav>
        <div className="header-actions">
          <button
            type="button"
            className="palette-trigger"
            aria-label="Abrir paleta de comandos"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            onClick={onOpenPalette}
          >
            <span aria-hidden="true">&gt;_</span>
            <kbd aria-hidden="true">{isApple ? "⌘K" : "Ctrl K"}</kbd>
          </button>
          <a
            className={isContact ? "header-cta is-active" : "header-cta"}
            href={routeHref("/contato")}
            aria-current={isContact ? "page" : undefined}
          >
            Canais oficiais
          </a>
          <button
            className="menu-button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen(!open)}
          >
            <i />
            <i />
          </button>
        </div>
      </div>
    </header>
  );
}

function SocialIcon({ name }) {
  if (name === "GitHub")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 19c-4.2 1.3-4.2-2.1-5.9-2.6M14.9 22v-3.4c0-1 .1-1.5-.5-2.1 2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.2-3.2 4.4 4.4 0 0 0-.1-3.2s-1-.3-3.4 1.2a11.7 11.7 0 0 0-6.2 0C6.6 4 5.6 4.3 5.6 4.3a4.4 4.4 0 0 0-.1 3.2 4.7 4.7 0 0 0-1.2 3.2c0 4.7 2.8 5.7 5.5 6-.5.5-.5 1.1-.5 2.1V22"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (name === "LinkedIn")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6ZM6 9H2v12h4V9ZM4 6.5A2.3 2.3 0 1 0 4 2a2.3 2.3 0 0 0 0 4.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (name === "Instagram")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17.4" cy="6.6" r=".8" fill="currentColor" />
      </svg>
    );
  if (name === "TikTok")
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 4c.5 2.5 2 4 4.5 4.4v3.2a8.7 8.7 0 0 1-4.5-1.3v5.8a5.2 5.2 0 1 1-4.5-5.2v3.2a2 2 0 1 0 1.3 1.9V4H14Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="6"
        width="18"
        height="12"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
    </svg>
  );
}

function LinkedInProfile({ name, href }) {
  if (!href) {
    return (
      <span
        className="profile-link is-pending"
        role="img"
        aria-label={`LinkedIn de ${name} — link pendente`}
        title="Link do LinkedIn será adicionado em breve"
      >
        <SocialIcon name="LinkedIn" />
      </span>
    );
  }

  return (
    <a
      className="profile-link"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Perfil de ${name} no LinkedIn`}
      title={`Abrir LinkedIn de ${name}`}
    >
      <SocialIcon name="LinkedIn" />
    </a>
  );
}

function ProfileCard({ name, role, photo, photoClass, linkedin }) {
  return (
    <article className="profile-card">
      {photo ? (
        <img
          className={`member-photo ${photoClass ?? ""}`}
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="member-photo is-empty" aria-hidden="true" />
      )}
      <div className="profile-card-content">
        <div className="profile-card-info">
          {role && <span className="profile-card-role">{role}</span>}
          <h3>{name}</h3>
        </div>
        <LinkedInProfile name={name} href={linkedin} />
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer id="contato" className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <a className="footer-brand-lockup" href={siteBase}>
            <img src={mark} alt="" />
            <span>
              UnBreakable<em>UnB</em>
            </span>
          </a>
          <p>
            Grupo de estudos de segurança ofensiva da Universidade de Brasília.
          </p>
          <div
            className="footer-social"
            aria-label="Redes sociais do UnBreakable"
          >
            {socialLinks.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={name}
              >
                <SocialIcon name={name} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-col">
          <h2>Grupo</h2>
          <a href={`${siteBase}#sobre`}>Sobre</a>
          <a href={`${siteBase}#metodo`}>Metodologia</a>
          <a href={`${siteBase}#faq`}>FAQ</a>
          <a href={`${siteBase}#participar`}>Como participar</a>
          <a href={routeHref("/eventos")}>Eventos</a>
          <a href={routeHref("/equipe")}>Equipe</a>
          <a href={routeHref("/identidade-visual")}>Identidade Visual</a>
          <a href={routeHref("/contato")}>Contato</a>
        </div>
        <div className="footer-col">
          <h2>Contato</h2>
          {socialLinks.map(({ name, url }) => (
            <a key={name} href={url} target="_blank" rel="noreferrer">
              {name}
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <small>© 2026 UnBreakable · Universidade de Brasília</small>
        <a className="footer-top-link" href="#conteudo-principal">
          <span aria-hidden="true">unbreakable@unb:~$ </span>cd ~
        </a>
      </div>
    </footer>
  );
}

function PageHead({ title, text, command }) {
  return (
    <section className="page-head">
      <div>
        {command && (
          <p className="path-prompt" aria-hidden="true">
            <span>unbreakable@unb</span>:<span>~</span>$ {command}
          </p>
        )}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}
function EventSummary({ label, title, meta }) {
  return (
    <span className="event-summary">
      <span className="event-summary-label">{label}</span>
      <span className="event-summary-title">{title}</span>
      {meta && <span className="event-summary-meta">{meta}</span>}
    </span>
  );
}

function Eventos() {
  const upcoming = eventIsUpcoming(nextEvent.date);
  // The featured event always leads its list and starts expanded.
  const featured = (
    <Accordion
      className="event-accordion is-featured"
      defaultOpen
      title={
        <EventSummary
          label={upcoming ? "Próximo evento" : "Evento realizado"}
          title={nextEvent.title}
          meta={formatEventDate(nextEvent.date)}
        />
      }
    >
      <div className="next-event">
        <div className="next-event-details">
          <p>{nextEvent.description}</p>
          <small>{nextEvent.location}</small>
          {nextEvent.href && (
            <a className="text-link" href={routeHref(nextEvent.href)}>
              Ver página do evento <ArrowIcon />
            </a>
          )}
        </div>
        <figure className="next-event-image">
          <img src={pinkHatPoster} alt={nextEvent.imageAlt} />
        </figure>
      </div>
    </Accordion>
  );
  const history = events.map(
    ({ type, title, presenter, date, href, image }) => (
      <Accordion
        key={title}
        className="event-accordion"
        title={
          <EventSummary
            label={type}
            title={title}
            meta={date && formatEventDate(date)}
          />
        }
      >
        <div
          className={
            image ? "event-accordion-text has-image" : "event-accordion-text"
          }
        >
          <div>
            <p>
              Apresentação: <strong>{presenter}</strong>
            </p>
            {href && (
              <a className="text-link" href={routeHref(href)}>
                Ver página da palestra <ArrowIcon />
              </a>
            )}
          </div>
          {image && (
            <figure className="event-accordion-image">
              <img
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
              />
            </figure>
          )}
        </div>
      </Accordion>
    ),
  );

  return (
    <>
      <PageHead
        title={pages.events.title}
        text={pages.events.description}
        command="ls ./eventos"
      />
      <main id="conteudo-principal" className="page-content">
        <h2 className="minor-heading">Próximos eventos</h2>
        {upcoming ? (
          <div className="event-accordions">{featured}</div>
        ) : (
          <p className="agenda-empty">
            Novas datas serão divulgadas nos{" "}
            <a href={routeHref("/contato")}>canais oficiais</a>.
          </p>
        )}
        <h2 className="minor-heading">Histórico de atividades</h2>
        <div className="event-accordions">
          {!upcoming && featured}
          {history}
        </div>
      </main>
    </>
  );
}
function Equipe() {
  return (
    <>
      <PageHead
        title={pages.team.title}
        text={pages.team.description}
        command="cat ./equipe"
      />
      <main id="conteudo-principal" className="page-content">
        <h2 className="team-heading">Gestão atual</h2>
        <div className="profile-grid">
          {members.map((profile) => (
            <ProfileCard key={profile.name} {...profile} />
          ))}
        </div>
      </main>
    </>
  );
}
function Contato() {
  return (
    <>
      <PageHead
        title={pages.contact.title}
        text={pages.contact.description}
        command="cat ./contato"
      />
      <main id="conteudo-principal" className="page-content contact-page">
        <ul
          className="channel-list"
          aria-label="Canais oficiais do UnBreakable"
        >
          {socialLinks.map(({ name, url, description }) => (
            <li key={name}>
              <a
                className="channel-row"
                href={url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="channel-icon" aria-hidden="true">
                  <SocialIcon name={name} />
                </span>
                <span className="channel-copy">
                  <strong>{name}</strong>
                  <small>{description}</small>
                  <span className="channel-action">
                    Acessar canal <ArrowIcon />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

function NotFound() {
  const directories = [
    ["sobre", `${siteBase}#sobre`],
    ["eventos", routeHref("/eventos")],
    ["equipe", routeHref("/equipe")],
    ["identidade-visual", routeHref("/identidade-visual")],
    ["contato", routeHref("/contato")],
  ];
  return (
    <main id="conteudo-principal" className="page-content not-found">
      <p className="micro">404 / UnBreakable</p>
      <h1>Página não encontrada</h1>
      <p>Este endereço não existe ou foi alterado.</p>
      <div className="not-found-links">
        <a className="button primary" href={siteBase}>
          Voltar ao início <ArrowIcon />
        </a>
        <ul aria-label="Diretórios do site">
          {directories.map(([name, href]) => (
            <li key={name}>
              <a href={href}>{name}/</a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function IdentidadeVisual() {
  return <VisualIdentityPage />;
}

export default function App() {
  const path = currentPath();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const commands = useMemo(
    () =>
      buildCommands({
        navigation: links,
        socialLinks,
        siteBase,
        isHome: path === "/",
        routeHref,
      }),
    [path],
  );
  const openMatrix = useCallback(() => setMatrix(true), []);
  const closeMatrix = useCallback(() => setMatrix(false), []);
  useKonami(openMatrix);

  useEffect(() => {
    const onKeyDown = (event) => {
      const chord =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      const slash =
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isEditable(event.target);
      if (!chord && !slash) return;
      event.preventDefault();
      setPaletteOpen((open) => (chord ? !open : true));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function runCommand(command) {
    setPaletteOpen(false);
    if (command.action === "matrix") {
      openMatrix();
    } else if (command.external) {
      window.open(command.href, "_blank", "noopener,noreferrer");
    } else if (command.href.startsWith("#")) {
      document
        .getElementById(command.href.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", command.href);
    } else {
      window.location.assign(command.href);
    }
  }

  const redirectTarget = redirects[path];
  useEffect(() => {
    if (redirectTarget) {
      window.location.replace(routeHref(redirectTarget));
      return;
    }
    const meta = pageMeta[path] ?? notFoundMeta;
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
  }, [path, redirectTarget]);
  const page = redirectTarget ? (
    <main id="conteudo-principal" className="page-content not-found">
      <p className="micro">302 / UnBreakable</p>
      <h1>Redirecionando…</h1>
      <p>
        Se nada acontecer, <a href={routeHref(redirectTarget)}>siga o link</a>.
      </p>
    </main>
  ) : path === "/eventos" ? (
    <Eventos />
  ) : path === "/eventos/ctf-pink-hat" ? (
    <PinkHatPage />
  ) : findTalkSlug(path) ? (
    <TalkPage slug={findTalkSlug(path)} />
  ) : path === "/equipe" ? (
    <Equipe />
  ) : path === "/contato" ? (
    <Contato />
  ) : path === "/identidade-visual" ? (
    <IdentidadeVisual />
  ) : path === "/" ? (
    <Home />
  ) : (
    <NotFound />
  );

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>
      <Header onOpenPalette={() => setPaletteOpen(true)} />
      {page}
      <Footer />
      {paletteOpen && (
        <CommandPalette
          commands={commands}
          onRun={runCommand}
          onClose={() => setPaletteOpen(false)}
        />
      )}
      {matrix && <MatrixRain onDone={closeMatrix} />}
    </>
  );
}
