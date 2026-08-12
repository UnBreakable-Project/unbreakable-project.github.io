import { useEffect, useState } from "react";
import logo from "./assets/unbreakableLogo_9.svg";
import mark from "./assets/unbreakable-mark.svg";
import circuit from "./assets/circuitos_1.png";
import pinkHat from "./assets/pinkhat.jpg";
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
  faqs,
  home,
  nextEvent,
  pages,
  socialLinks,
} = siteContent;
const founders = resolveProfiles(siteContent.founders);
const members = resolveProfiles(siteContent.members);

const siteBase = import.meta.env.BASE_URL;

function currentPath() {
  const basePath = siteBase.endsWith("/") ? siteBase.slice(0, -1) : siteBase;
  const path = window.location.pathname.startsWith(basePath)
    ? window.location.pathname.slice(basePath.length) || "/"
    : window.location.pathname;

  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

function routeHref(path) {
  return `${siteBase}${path.replace(/^\//, "")}`;
}

function homeAnchor(id, isHome) {
  return isHome ? `#${id}` : `${siteBase}#${id}`;
}

function ArrowIcon({ direction = "right" }) {
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

function Header() {
  const isHome = currentPath() === "/";
  const path = currentPath();
  const isContact = path === "/contato";
  const isIdentityVisual = path === "/identidade-visual";
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!isHome) return;

    const sectionIds = ["sobre", "metodo", "faq"];
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
        setActiveSection("contato");
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

  const currentActiveSection = isHome ? activeSection : "";

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href={siteBase} onClick={() => setOpen(false)}>
          <img className="brand-mark" src={mark} alt="" />
          <span className="brand-name">
            UnBreakable<em>UnB</em>
          </span>
        </a>
        <nav
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
            className={path === "/eventos" ? "is-active" : undefined}
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
      </div>
    </footer>
  );
}

function EventList({ compact = false }) {
  return (
    <div className={compact ? "event-list compact" : "event-list"}>
      {events.map(({ type, title, presenter }) => (
        <article key={title} className="event-row">
          <span>{type}</span>
          <h3>{title}</h3>
          <p>{presenter}</p>
        </article>
      ))}
    </div>
  );
}

function StudyTerminal() {
  return (
    <div className="terminal" aria-label="Exemplo de fluxo de estudo">
      <div className="terminal-top">
        <i />
        <i />
        <i />
        <span>terminal</span>
      </div>
      <code>
        <span>$ ls</span>
        <br />
        anotacoes.md
        <br />
        <br />
        <span>$ cat anotacoes.md</span>
        <br />
        hipótese → teste → evidência → write-up
      </code>
    </div>
  );
}

function Home() {
  return (
    <main id="conteudo-principal">
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-circuit" src={circuit} alt="" />
        <div className="hero-copy">
          <h1 id="hero-title">
            {home.heroTitle.lead} <em>{home.heroTitle.emphasis}</em>
          </h1>
          <p className="lede">{home.heroLede}</p>
          <div className="actions">
            <a className="button primary" href="#sobre">
              Conheça o grupo <ArrowIcon direction="down" />
            </a>
            <a className="text-link" href={routeHref("/eventos")}>
              Ver eventos <ArrowIcon />
            </a>
          </div>
        </div>
        <div className="hero-object">
          <img src={logo} alt="UnBreakable" />
        </div>
      </section>

      <section id="sobre" className="intro section">
        <div className="section-title">
          <h2>{home.intro.title}</h2>
        </div>
        <div className="prose">
          {home.intro.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section id="metodo" className="method section">
        <div className="method-copy">
          <h2>{home.method.title}</h2>
          <p>{home.method.description}</p>
          <ul>
            {home.method.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <StudyTerminal />
      </section>

      <section className="events-section section">
        <div className="section-heading-row">
          <div>
            <h2>{home.events.title}</h2>
            <p>{home.events.description}</p>
          </div>
          <a className="text-link" href={routeHref("/eventos")}>
            Todos os eventos <ArrowIcon />
          </a>
        </div>
        <EventList compact />
      </section>

      <section id="faq" className="faq section">
        <div className="section-title">
          <h2>{home.faq.title}</h2>
          <p>{home.faq.description}</p>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => (
            <details key={question} open={index === 0}>
              <summary>
                <span>{question}</span>
                <span className="faq-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path className="vertical" d="M12 5v14" />
                  </svg>
                </span>
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="participate">
        <div>
          <h2>{home.participate.title}</h2>
          <p>{home.participate.description}</p>
        </div>
        <a className="button secondary" href={routeHref("/contato")}>
          Canais oficiais <ArrowIcon />
        </a>
      </section>
    </main>
  );
}

function PageHead({ title, text }) {
  return (
    <section className="page-head">
      <img src={circuit} alt="" />
      <div>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  );
}
function Eventos() {
  return (
    <>
      <PageHead title={pages.events.title} text={pages.events.description} />
      <main id="conteudo-principal" className="page-content">
        <div className="next-event">
          <span>PRÓXIMO EVENTO</span>
          <div className="next-event-details">
            <time>
              {nextEvent.day}{" "}
              <b>
                {nextEvent.month}
                <br />
                {nextEvent.year}
              </b>
            </time>
            <div>
              <h2>{nextEvent.title}</h2>
              <p>{nextEvent.description}</p>
              <small>{nextEvent.location}</small>
            </div>
          </div>
          <figure className="next-event-image">
            <img src={pinkHat} alt={nextEvent.imageAlt} />
          </figure>
        </div>
        <h2 className="minor-heading">Já realizamos</h2>
        <EventList />
      </main>
    </>
  );
}
function Equipe() {
  return (
    <>
      <PageHead title={pages.team.title} text={pages.team.description} />
      <main id="conteudo-principal" className="page-content">
        <h2 className="team-heading">Fundação</h2>
        <div className="profile-grid">
          {founders.map((profile) => (
            <ProfileCard key={profile.name} {...profile} />
          ))}
        </div>
        <h2 className="team-heading">Gestão</h2>
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
      <PageHead title={pages.contact.title} text={pages.contact.description} />
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
                </span>
              </a>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

function IdentidadeVisual() {
  return <VisualIdentityPage />;
}

export default function App() {
  const path = currentPath();
  const page =
    path === "/eventos" ? (
      <Eventos />
    ) : path === "/equipe" ? (
      <Equipe />
    ) : path === "/contato" ? (
      <Contato />
    ) : path === "/identidade-visual" ? (
      <IdentidadeVisual />
    ) : (
      <Home />
    );

  return (
    <>
      <a className="skip-link" href="#conteudo-principal">
        Pular para o conteúdo principal
      </a>
      <Header />
      {page}
      <Footer />
    </>
  );
}
