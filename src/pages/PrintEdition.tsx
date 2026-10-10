import { Printer } from 'lucide-react';
import Container from '../components/Container';
import { details, bio } from '../components/About';
import { channels } from '../components/Contact';
import { projects, ORDER } from './Projects';
import { papers } from './Blogs';
import { experience, leadership, interests, Role } from './Experience';

const SITE = 'https://shrey-parekh.vercel.app';
const EMAIL = 'shreyparekh3@gmail.com';
const PHONE = '+91 90049 05435';

/* On paper a link is only as good as the address printed beside it, so every
   URL is set in full. Chrome keeps them clickable in a saved PDF as well. */
const bare = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const Url = ({ href }: { href: string }) => <a href={href}>{bare(href)}</a>;

const contents = [
  { n: 'I', label: 'About', count: '' },
  { n: 'II', label: 'Selected work', count: `${projects.length} works` },
  { n: 'III', label: 'Papers', count: `${papers.length} papers` },
  { n: 'IV', label: 'Experience', count: `${experience.length + leadership.length} roles` },
  { n: 'V', label: 'Correspondence', count: '' },
];

const Head = ({ n, label }: { n: string; label: string }) => (
  <div className="ed-head">
    <span className="ed-head-n">{n}</span>
    <h2 className="ed-head-label">{label}</h2>
  </div>
);

const RoleEntry = ({ role }: { role: Role }) => (
  <article className="ed-entry">
    <div className="ed-entry-meta">
      <span>{role.org}</span>
      <span>{[role.period, role.place].filter(Boolean).join(' · ')}</span>
    </div>
    <h3 className="ed-entry-title">{role.role}</h3>
    <ul className="ed-points">
      {role.points.map((pt) => (
        <li key={pt}>{pt}</li>
      ))}
    </ul>
    {role.href && (
      <p className="ed-line">
        {/* hrefLabel is usually the URL itself, which the link already prints. */}
        <span className="ed-term">Link</span>
        <Url href={role.href} />
      </p>
    )}
  </article>
);

/* The whole site as one document, typeset for A4 and printed by the browser's
   own dialog, which also saves it as a PDF. It reads the same data the pages
   do, so it can't fall out of date. */
const PrintEdition = () => {
  const typeset = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <Container className="ed-wrap py-12 sm:py-16">
      <div className="ed-toolbar">
        <p>
          The whole site, typeset as one document. Print it, or choose “Save as PDF” in the print
          dialog to keep a copy.
        </p>
        <button type="button" onClick={() => window.print()} className="ed-print-btn">
          <Printer size={15} aria-hidden="true" />
          Print or save as PDF
        </button>
      </div>

      <div className="ed-paper">
        {/* Cover */}
        <div className="ed-cover">
          <p className="ed-kicker">The print edition</p>
          <h1 className="ed-name">
            Shrey <span className="font-script">Parekh</span>
          </h1>
          <p className="ed-tag">
            Artificial intelligence, machine learning, and things built with curiosity.
          </p>
          <div className="ed-cover-meta">
            <span>AI/ML Engineer · Mumbai, India</span>
            <span>Typeset {typeset}</span>
          </div>

          <ol className="ed-contents" aria-label="Contents">
            {contents.map((c) => (
              <li key={c.n}>
                <span className="ed-contents-n">{c.n}</span>
                <span>{c.label}</span>
                <span aria-hidden="true" className="ed-leader" />
                <span className="ed-contents-count">{c.count}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* I. About */}
        <section className="ed-section">
          <Head n="I" label="About" />
          {bio.map((para) => (
            <p key={para} className="ed-text">
              {para}
            </p>
          ))}
          <dl className="ed-details">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="ed-term">{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ed-line">
            <span className="ed-term">Off the clock</span>
            {interests.join(', ')}
          </p>
        </section>

        {/* II. Selected work */}
        <section className="ed-section">
          <Head n="II" label="Selected work" />
          {ORDER.map((tag) => (
            <div key={tag}>
              <p className="ed-group-name">{tag}</p>
              {projects
                .filter((p) => p.tag === tag)
                .map((p) => (
                  <article key={p.id} className="ed-entry">
                    <div className="ed-entry-meta">
                      <span>{p.no}</span>
                      <span>{[p.year, p.status].filter(Boolean).join(' · ')}</span>
                    </div>
                    <h3 className="ed-entry-title">{p.title}</h3>
                    <p className="ed-text">{p.summary}</p>
                    <p className="ed-line">
                      <span className="ed-term">Built with</span>
                      {p.stack.join(', ')}
                    </p>
                    {p.live && (
                      <p className="ed-line">
                        <span className="ed-term">Live</span>
                        <Url href={p.live} />
                      </p>
                    )}
                    {p.deliverables
                      .filter((d) => d.href)
                      .map((d) => (
                        <p key={d.label} className="ed-line">
                          <span className="ed-term">{d.label}</span>
                          <Url href={d.href as string} />
                        </p>
                      ))}
                  </article>
                ))}
            </div>
          ))}
        </section>

        {/* III. Papers */}
        <section className="ed-section">
          <Head n="III" label="Papers" />
          {papers.map((p) => (
            <article key={p.id} className="ed-entry">
              <div className="ed-entry-meta">
                <span>
                  {p.numeral} · {p.kind}
                </span>
                <span>
                  {p.status}
                  {p.venue ? `, ${p.venue}${p.year ? `, ${p.year}` : ''}` : ''}
                </span>
              </div>
              <h3 className="ed-entry-title">{p.title}</h3>
              <p className="ed-text">{p.abstract}</p>
              <p className="ed-line">
                <span className="ed-term">Keywords</span>
                {p.keywords.join(', ')}
              </p>
              {p.pdf && (
                <p className="ed-line">
                  <span className="ed-term">Full paper</span>
                  <Url href={`${SITE}${p.pdf}`} />
                </p>
              )}
            </article>
          ))}
        </section>

        {/* IV. Experience */}
        <section className="ed-section">
          <Head n="IV" label="Experience" />
          <p className="ed-group-name">Work</p>
          {experience.map((r) => (
            <RoleEntry key={r.id} role={r} />
          ))}
          <p className="ed-group-name">Extracurriculars</p>
          {leadership.map((r) => (
            <RoleEntry key={r.id} role={r} />
          ))}
        </section>

        {/* V. Correspondence */}
        <section className="ed-section">
          <Head n="V" label="Correspondence" />
          <p className="ed-line">
            <span className="ed-term">Email</span>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
          <p className="ed-line">
            <span className="ed-term">Phone</span>
            {PHONE}
          </p>
          {channels
            .filter((c) => c.href)
            .map((c) => (
              <p key={c.label} className="ed-line">
                <span className="ed-term">{c.label}</span>
                <Url href={c.href as string} />
              </p>
            ))}
          <p className="ed-line">
            <span className="ed-term">Online</span>
            <Url href={SITE} />
          </p>

          <p className="ed-colophon">
            Set in Playfair Display and EB Garamond. Generated from {bare(SITE)} in {typeset}. The
            site itself is always the current version.
          </p>
        </section>
      </div>
    </Container>
  );
};

export default PrintEdition;
