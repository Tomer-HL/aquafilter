import { useState } from 'react'
import { Quote, ExternalLink } from 'lucide-react'
import { MIDRAG, REVIEWS } from './midragReviews.js'

// Customer reviews section — real Midrag reviews, quoted verbatim (originals are Hebrew).
function ReviewCard({ r, lang, copy }) {
  const [open, setOpen] = useState(false)
  const long = r.text.length > 170
  const [y, m] = r.date.split('-')
  const when = new Date(+y, +m - 1, 1).toLocaleDateString(lang === 'he' ? 'he-IL' : 'en-GB', { month: 'long', year: 'numeric' })
  return (
    <article className="review" dir="rtl" lang="he">
      <div className="review-top">
        <Quote className="review-q" size={30} aria-hidden="true" />
        <span className="review-score" aria-label={`${copy.scoreLabel} ${r.score}/10`}>{r.score}<small>/10</small></span>
      </div>
      <p className="review-service">{r.service}</p>
      <p className={`review-text ${long && !open ? 'clamped' : ''}`}>{r.text}</p>
      {long && (
        <button className="review-more" onClick={() => setOpen(o => !o)} aria-expanded={open}>
          {open ? copy.less : copy.more}
        </button>
      )}
      <footer className="review-foot">
        <b>{r.name}</b><span>{r.city}</span><span className="review-date" lang={lang}>{when}</span>
      </footer>
    </article>
  )
}

export default function Reviews({ lang, copy }) {
  return (
    <section className="section reviews-sec" id="reviews">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
        </div>

        <a className="midrag-badge" href={MIDRAG.url} target="_blank" rel="noopener noreferrer">
          <span className="mb-score">{MIDRAG.score}</span>
          <span className="mb-txt">
            <span className="mb-of">{copy.outOf}</span>
            <span>{copy.badge(MIDRAG.count)}</span>
          </span>
        </a>

        <div className="reviews-grid">
          {REVIEWS.map((r, i) => <ReviewCard key={i} r={r} lang={lang} copy={copy} />)}
        </div>

        <div className="reviews-cta">
          <a className="btn btn-ghost" href={MIDRAG.url} target="_blank" rel="noopener noreferrer">
            {copy.all(MIDRAG.count)} <ExternalLink size={16} aria-hidden="true" />
          </a>
          {copy.note && <p className="reviews-note">{copy.note}</p>}
        </div>
      </div>
    </section>
  )
}
