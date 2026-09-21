import Accordion from "../../components/Accordion";
import logo from "../../assets/unbreakableLogo_9.svg";
import { siteContent } from "../../content/site.mdx";
import { ArrowIcon, EventList } from "../../components/SiteUI";
import { routeHref } from "../../lib/routes";
import "./home.css";

const { home, faqs } = siteContent;

function Prompt({ command, children }) {
  return (
    <>
      <p className="micro prompt" aria-label={`unbreakable@unb:~$ ${command}`}>
        <span className="prompt-user" aria-hidden="true">
          unbreakable@unb
        </span>
        <span className="prompt-sep" aria-hidden="true">
          :
        </span>
        <span className="prompt-path" aria-hidden="true">
          ~
        </span>
        <span className="prompt-sep" aria-hidden="true">
          $
        </span>{" "}
        <span
          className="typed"
          style={{ "--chars": command.length }}
          aria-hidden="true"
        >
          {command}
        </span>
        <span className="cursor" aria-hidden="true" />
      </p>
      <p className="prompt-out">{children}</p>
    </>
  );
}

export default function Home() {
  return (
    <main id="conteudo-principal" className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <Prompt command="whoami">
            UnBreakable / Universidade de Brasília
          </Prompt>
          <h1 id="hero-title">
            {home.heroTitle.lead} <br />
            <em data-text={home.heroTitle.emphasis}>
              {home.heroTitle.emphasis}
            </em>
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
        <div className="hero-side">
          <div className="hero-object">
            <img src={logo} alt="UnBreakable" />
          </div>
        </div>
      </section>

      <section id="sobre" className="intro section">
        <p className="section-index">01 / Sobre</p>
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
        <p className="section-index">02 / Método</p>
        <div className="method-title">
          <h2>{home.method.title}</h2>
        </div>
        <div className="method-copy">
          <p>{home.method.description}</p>
          <div className="method-accordions">
            {home.method.points.map(({ title, description }, index) => (
              <Accordion
                className="method-step"
                key={title}
                title={title}
                number={`0${index + 1}`}
                defaultOpen={index === 0}
              >
                <p>{description}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      <section className="events-section section">
        <p className="section-index">03 / Eventos</p>
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
        <p className="section-index">04 / FAQ</p>
        <div className="section-title">
          <h2>{home.faq.title}</h2>
          <p>{home.faq.description}</p>
        </div>
        <div className="faq-list">
          {faqs.map(({ question, answer }, index) => (
            <Accordion
              key={question}
              title={question}
              defaultOpen={index === 0}
            >
              <p>{answer}</p>
            </Accordion>
          ))}
        </div>
      </section>

      <section id="participar" className="participate">
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
