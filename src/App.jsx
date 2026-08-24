import { useState, useEffect } from 'react'
import {
  Droplet, Droplets, Filter, ShieldCheck, Award, Wrench, Sparkles,
  Search, ShoppingCart, Heart, Phone, Menu, X, Globe, Check,
  ArrowRight, ArrowLeft, Star, MapPin, Clock, Mail, Facebook, Instagram, MessageCircle,
} from 'lucide-react'
import { content, brands } from './i18n.js'
import './App.css'

const tierIcons = [Droplets, Filter, Droplet, ShieldCheck, Filter]
const featureIcons = [Sparkles, Award, Wrench, ShieldCheck]
const catIcons = [Droplets, Filter, ShieldCheck, Sparkles]
const benefitIcons = [Droplet, Wrench, ShieldCheck, Award]

export default function App() {
  const [lang, setLang] = useState('he')
  const [menuOpen, setMenuOpen] = useState(false)
  const [annIdx, setAnnIdx] = useState(0)
  const [zoom, setZoom] = useState(null)
  const t = content[lang]
  const rtl = t.dir === 'rtl'
  const Arrow = rtl ? ArrowLeft : ArrowRight

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
  }, [lang, t.dir])

  useEffect(() => {
    const id = setInterval(() => setAnnIdx(i => (i + 1) % t.announcements.length), 4000)
    return () => clearInterval(id)
  }, [t.announcements.length])

  // Lightbox: lock scroll + close on Escape while open
  useEffect(() => {
    if (!zoom) return
    const onKey = e => { if (e.key === 'Escape') setZoom(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [zoom])

  const toggleLang = () => setLang(l => (l === 'he' ? 'en' : 'he'))

  return (
    <>
      {/* Announcement */}
      <div className="topbar">
        <div className="container">
          <Droplet size={15} />
          <span>{t.announcements[annIdx]}</span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label={t.brand.name}>
            <img className="brand-logo" src="/logo.png" alt={t.brand.name} width="52" height="52" />
            <span className="brand-text">
              <span className="brand-name">{t.brand.name}</span>
              <span className="brand-tag">{t.brand.tagline}</span>
            </span>
          </a>

          <nav className="main-nav" aria-label="Main">
            <a href="#tiers">{t.nav.under}</a>
            <a href="#categories">{t.nav.whole}</a>
            <a href="#tiers">{t.nav.catalog}</a>
            <a href="#categories">{t.nav.parts}</a>
            <a href="#finder">{t.nav.finder}</a>
            <a className="sale" href="#tiers">{t.nav.sale}</a>
            <a href="#about">{t.nav.about}</a>
          </nav>

          <div className="header-actions">
            <a className="phone-pill" href="tel:0506830881"><Phone size={17} /><span>{t.header.phone}</span></a>
            <button className="icon-btn hide-sm" aria-label={t.header.search}><Search size={20} /></button>
            <button className="icon-btn hide-sm" aria-label="Wishlist"><Heart size={20} /></button>
            <button className="icon-btn hide-sm" aria-label={t.header.cart}>
              <ShoppingCart size={20} /><span className="cart-count">0</span>
            </button>
            <button className="lang-toggle" onClick={toggleLang} aria-label="Switch language">
              <Globe size={16} /> {lang === 'he' ? 'EN' : 'עב'}
            </button>
            <button className="icon-btn burger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`drawer-backdrop${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`drawer${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <span className="brand">
            <img className="brand-logo sm" src="/logo.png" alt={t.brand.name} width="42" height="42" />
            <span className="brand-text"><span className="brand-name">{t.brand.name}</span><span className="brand-tag">{t.brand.tagline}</span></span>
          </span>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button>
        </div>
        {Object.values(t.nav).map((label, i) => (
          <a key={i} href="#tiers" onClick={() => setMenuOpen(false)}>{label}</a>
        ))}
        <button className="lang-toggle" style={{ marginTop: 14 }} onClick={toggleLang}>
          <Globe size={16} /> {t.label === 'עברית' ? 'Switch to English' : 'עבור לעברית'}
        </button>
      </aside>

      <main id="top">
        {/* Hero */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">{t.hero.eyebrow}</span>
              <h1>{t.hero.title}</h1>
              <p className="lead">{t.hero.subtitle}</p>
              <div className="hero-cta">
                <a className="btn btn-primary" href="#finder">{t.hero.ctaPrimary} <Arrow size={18} /></a>
                <a className="btn btn-ghost" href="#tiers">{t.hero.ctaSecondary}</a>
              </div>
              <div className="hero-highlights">
                {t.hero.highlights.map((h, i) => (
                  <span className="hpill" key={i}><Check size={15} /> {h}</span>
                ))}
              </div>
              <div className="hero-stats">
                <div className="stat"><b>{t.hero.stat1}</b><span>{t.hero.stat1l}</span></div>
                <div className="stat"><b>{t.hero.stat2}</b><span>{t.hero.stat2l}</span></div>
                <div className="stat"><b>{t.hero.stat3}</b><span>{t.hero.stat3l}</span></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-blob" />
              <img className="hero-product" src="/products/amiad-compact.png" alt={t.mainFilters.items[0].name} />
              <span className="hero-badge"><b>85%</b>{t.hero.badge}</span>
              <span className="hero-gift"><Sparkles size={16} /> {t.mainFilter.gift}</span>
            </div>
          </div>
        </section>

        {/* Recommended systems — our actual implemented products (single source: mainFilters) */}
        <section className="section" id="tiers">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{t.tiersHead.eyebrow}</span>
              <h2>{t.tiersHead.title}</h2>
              <p>{t.tiersHead.sub}</p>
            </div>
            <div className="models-grid">
              {t.mainFilters.items.map((m, i) => (
                <article className="model-card" key={i}>
                  <button className="model-media" onClick={() => setZoom(m)} aria-label={`${t.zoomLabel}: ${m.name}`}>
                    <span className="model-warranty"><ShieldCheck size={14} /> {m.warranty}</span>
                    <img src={m.img} alt={m.name} loading="lazy" />
                    <span className="zoom-hint" aria-hidden="true"><Search size={16} /></span>
                  </button>
                  <div className="model-body">
                    <h3>{m.name}</h3>
                    <p className="model-desc">{m.desc}</p>
                    <div className="model-chips">
                      {m.chips.map((c, j) => (
                        <span className="model-chip" key={j}><Check size={13} /> {c}</span>
                      ))}
                    </div>
                    <a className="btn btn-primary" href="tel:0506830881"><Phone size={16} /> {t.mainFilters.orderCta}</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Combined Main Filter spotlight */}
        <section className="section main-filter" id="main-filter" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{t.mainFilter.eyebrow}</span>
              <h2>{t.mainFilter.title}</h2>
              <p>{t.mainFilter.sub}</p>
            </div>
            <div className="mf-specs">
              {t.mainFilter.specs.map((s, i) => (
                <span className="mf-chip" key={i}><Check size={15} /> {s}</span>
              ))}
              <span className="mf-chip gift"><Sparkles size={15} /> {t.mainFilter.gift}</span>
            </div>
            <div className="features-grid">
              {t.mainFilter.benefits.map((b, i) => {
                const Icon = benefitIcons[i]
                return (
                  <div className="feature" key={i}>
                    <div className="fi"><Icon size={24} /></div>
                    <h3>{b.title}</h3>
                    <p>{b.desc}</p>
                  </div>
                )
              })}
            </div>
            <div className="mf-cta">
              <a className="btn btn-primary" href="tel:0506830881"><Phone size={18} /> {t.mainFilter.cta}</a>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{t.featuresHead.eyebrow}</span>
              <h2>{t.featuresHead.title}</h2>
            </div>
            <div className="features-grid">
              {t.features.map((f, i) => {
                const Icon = featureIcons[i]
                return (
                  <div className="feature" key={i}>
                    <div className="fi"><Icon size={24} /></div>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="section cats" id="categories">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">{t.catHead.eyebrow}</span>
              <h2>{t.catHead.title}</h2>
            </div>
            <div className="cats-grid">
              {t.categories.map((c, i) => {
                const Icon = catIcons[i]
                return (
                  <article className="cat" key={i}>
                    <div className="cat-icon"><Icon size={28} /></div>
                    <div>
                      <h3>{c.name}</h3>
                      <p>{c.desc}</p>
                      <a className="cat-link" href="#tiers">{c.link} <Arrow size={16} /></a>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Finder CTA */}
        <section className="section" style={{ paddingTop: 0 }} id="finder">
          <div className="container">
            <div className="finder">
              <span className="eyebrow">{t.finder.eyebrow}</span>
              <h2>{t.finder.title}</h2>
              <p>{t.finder.sub}</p>
              <a className="btn" href="#top">{t.finder.cta} <Arrow size={18} /></a>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="section about" id="about" style={{ paddingTop: 0 }}>
          <div className="container about-grid">
            <div className="about-media">
              <img className="about-logo" src="/logo.png" alt={t.brand.name} />
              <span className="since">{t.about.badge}</span>
            </div>
            <div>
              <span className="eyebrow">{t.about.eyebrow}</span>
              <h2>{t.about.title}</h2>
              <p>{t.about.body}</p>
              <a className="btn btn-primary" href="#top">{t.about.cta} <Arrow size={18} /></a>
            </div>
          </div>
        </section>

        {/* Brands */}
        <section className="brands">
          <div className="container">
            <h3>{t.brandsHead.title}</h3>
            <div className="brand-row">
              {brands.map(b => <span className="brand-chip" key={b}>{b}</span>)}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="newsletter">
            <h3>{t.footer.newsletter}</h3>
            <form onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder={t.footer.emailPh} aria-label={t.footer.emailPh} required />
              <button className="btn" type="submit">{t.footer.subscribe}</button>
            </form>
          </div>

          <div className="foot-grid">
            <div className="foot-brand">
              <span className="brand">
                <img className="brand-logo sm" src="/logo.png" alt={t.brand.name} width="44" height="44" />
                <span className="brand-text"><span className="brand-name">{t.brand.name}</span><span className="brand-tag">{t.brand.tagline}</span></span>
              </span>
              <p>{t.footer.tagline}</p>
              <div className="foot-social">
                <a href="#top" aria-label="Facebook"><Facebook size={18} /></a>
                <a href="#top" aria-label="Instagram"><Instagram size={18} /></a>
                <a href="https://wa.me/972506830881" aria-label="WhatsApp"><MessageCircle size={18} /></a>
              </div>
            </div>
            <div className="foot-col">
              <h4>{t.footer.colShop}</h4>
              <ul>{t.footer.shopLinks.map(l => <li key={l}><a href="#tiers">{l}</a></li>)}</ul>
            </div>
            <div className="foot-col">
              <h4>{t.footer.colInfo}</h4>
              <ul>{t.footer.infoLinks.map(l => <li key={l}><a href="#about">{l}</a></li>)}</ul>
            </div>
            <div className="foot-col foot-contact">
              <h4>{t.footer.colContact}</h4>
              <a className="line" href="tel:0506830881"><Phone size={16} /> {t.header.phone}</a>
              <div className="line"><MapPin size={16} /> {t.footer.address}</div>
              <div className="line"><Clock size={16} /> {t.footer.hours}</div>
              <div className="line"><Mail size={16} /> info@am-filters.co.il</div>
            </div>
          </div>

          <div className="foot-bottom">© {new Date().getFullYear()} {t.brand.name} · {t.footer.rights}</div>
        </div>
      </footer>

      {/* Product image lightbox */}
      {zoom && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={zoom.name} onClick={() => setZoom(null)}>
          <button className="lightbox-close" onClick={() => setZoom(null)} aria-label={t.close}><X size={26} /></button>
          <figure className="lightbox-fig" onClick={e => e.stopPropagation()}>
            <img src={zoom.img} alt={zoom.name} />
            <figcaption>{zoom.name}</figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
