import { useState, useMemo, useRef, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Phone, Sparkles, ShieldCheck } from 'lucide-react'
import { QUESTIONS, REASONS, recommend, slugOf } from './recommend.js'
import { WhatsAppIcon } from './icons.jsx'

// Questionnaire-specific copy (kept here so i18n.js stays product-focused)
const UI = {
  he: {
    eyebrow: 'התאמה חכמה',
    title: 'איזה פתרון סינון מים מתאים לי?',
    sub: 'כמה שאלות קצרות ונמליץ לכם על הפתרון המתאים ביותר מבין המערכות שלנו.',
    start: 'התחלת ההתאמה',
    step: 'שאלה', of: 'מתוך',
    back: 'חזרה', restart: 'התחלה מחדש',
    resultEyebrow: 'תוצאת ההתאמה',
    yourMatch: 'הפתרון המתאים לכם ביותר',
    match: 'התאמה',
    why: 'לפי התשובות שלכם, חיפשתם פתרון עבור:',
    alt: 'אפשרות נוספת לשקול',
    detailsCta: 'לפרטי המוצר',
    waCta: 'דברו איתנו בוואטסאפ',
    bands: { excellent: 'התאמה מצוינת', high: 'התאמה גבוהה', good: 'התאמה טובה', partial: 'התאמה חלקית', low: 'התאמה חלשה' },
    unsureTitle: 'לא מצאנו התאמה חד־משמעית לפי התשובות שלכם',
    unsureBody: 'כדי להתאים לכם את הפתרון בצורה מדויקת, מומלץ לדבר איתנו — נשמח לייעץ ללא התחייבות.',
    unsurePou: 'נראה שאתם מחפשים פתרון למי שתייה או לנקודה מסוימת. המערכות שמוצגות כאן הן מסננים ראשיים לכל הבית — נשמח להתאים לכם פתרון מי שתייה בשיחה.',
    unsureChlorine: 'לשיפור טעם וריח של כלור במי שתייה נדרש פתרון ייעודי (פחם פעיל / אוסמוזה). נשמח להמליץ בשיחה.',
    optionsToCheck: 'אפשרויות אפשריות לבדיקה',
    callCta: 'לייעוץ בטלפון',
  },
  en: {
    eyebrow: 'Smart match',
    title: 'Which water-filtration solution fits me?',
    sub: 'A few short questions and we’ll recommend the best fit among our systems.',
    start: 'Start matching',
    step: 'Question', of: 'of',
    back: 'Back', restart: 'Start over',
    resultEyebrow: 'Your match',
    yourMatch: 'The best solution for you',
    match: 'match',
    why: 'Based on your answers, you were looking for:',
    alt: 'Another option to consider',
    detailsCta: 'Product details',
    waCta: 'Chat with us on WhatsApp',
    bands: { excellent: 'Excellent match', high: 'High match', good: 'Good match', partial: 'Partial match', low: 'Low match' },
    unsureTitle: 'We couldn’t find a clear match from your answers',
    unsureBody: 'To match the right solution precisely, it’s best to talk to us — happy to advise, no obligation.',
    unsurePou: 'It looks like you need a drinking-water or single-point solution. The systems shown here are whole-house main filters — we’ll gladly match a drinking-water solution over a call.',
    unsureChlorine: 'Improving chlorine taste/odor in drinking water needs a dedicated solution (activated carbon / RO). We’ll gladly advise over a call.',
    optionsToCheck: 'Possible options to check',
    callCta: 'Call for advice',
  },
}

const bandOf = score =>
  score >= 90 ? 'excellent' : score >= 75 ? 'high' : score >= 60 ? 'good' : score >= 40 ? 'partial' : 'low'

export default function Questionnaire({ lang, items, onDetails, waUrl, phone }) {
  const rtl = lang === 'he'
  const u = UI[lang]
  const Arrow = rtl ? ArrowLeft : ArrowRight
  const total = QUESTIONS.length

  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const liveRef = useRef(null)
  const headingRef = useRef(null)

  const bySlug = useMemo(() => {
    const map = {}
    items.forEach(it => { map[slugOf(it)] = it })
    return map
  }, [items])

  const result = useMemo(() => (done ? recommend(answers) : null), [done, answers])

  // Move focus to the new question / result for screen-reader + keyboard users
  useEffect(() => {
    if (started && headingRef.current) headingRef.current.focus()
  }, [step, started, done])

  const choose = (qid, oid) => {
    const next = { ...answers, [qid]: oid }
    setAnswers(next)
    if (step < total - 1) setStep(step + 1)
    else setDone(true)
  }
  const back = () => {
    if (done) { setDone(false); return }
    if (step > 0) setStep(step - 1)
    else setStarted(false)
  }
  const restart = () => { setStarted(false); setStep(0); setAnswers({}); setDone(false) }

  // ---------- Intro ----------
  if (!started) {
    return (
      <section className="section quiz" id="finder-quiz">
        <div className="container">
          <div className="quiz-intro">
            <span className="eyebrow">{u.eyebrow}</span>
            <h2>{u.title}</h2>
            <p>{u.sub}</p>
            <button className="btn btn-primary quiz-start" onClick={() => setStarted(true)}>
              <Sparkles size={18} /> {u.start}
            </button>
          </div>
        </div>
      </section>
    )
  }

  // ---------- Result ----------
  if (done && result) {
    const isUnsure = result.status === 'unsure'
    return (
      <section className="section quiz" id="finder-quiz">
        <div className="container">
          <div className="quiz-card" role="region" aria-live="polite" ref={liveRef}>
            {!isUnsure ? (
              <QuizResult u={u} lang={lang} result={result} bySlug={bySlug} onDetails={onDetails}
                waUrl={waUrl} headingRef={headingRef} Arrow={Arrow} />
            ) : (
              <QuizUnsure u={u} lang={lang} result={result} bySlug={bySlug} onDetails={onDetails}
                waUrl={waUrl} phone={phone} headingRef={headingRef} />
            )}
            <div className="quiz-footer">
              <button className="btn btn-ghost" onClick={restart}><RotateCcw size={16} /> {u.restart}</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ---------- A question ----------
  const q = QUESTIONS[step]
  const pct = Math.round(((step) / total) * 100)
  return (
    <section className="section quiz" id="finder-quiz">
      <div className="container">
        <div className="quiz-card">
          <div className="quiz-progress" aria-hidden="true"><span style={{ inlineSize: `${pct}%` }} /></div>
          <div className="quiz-step-label">{u.step} {step + 1} {u.of} {total}</div>

          <h2 className="quiz-q" tabIndex={-1} ref={headingRef}>{q[lang].q}</h2>
          {q[lang].sub && <p className="quiz-q-sub">{q[lang].sub}</p>}

          <div className="quiz-options" role="group" aria-label={q[lang].q}>
            {q.options.map(opt => {
              const active = answers[q.id] === opt.id
              return (
                <button key={opt.id} className={`quiz-opt${active ? ' active' : ''}`}
                  aria-pressed={active} onClick={() => choose(q.id, opt.id)}>
                  <span className="quiz-opt-tick" aria-hidden="true"><Check size={16} /></span>
                  <span>{opt[lang]}</span>
                </button>
              )
            })}
          </div>

          <div className="quiz-nav">
            <button className="btn btn-ghost" onClick={back}>
              <Arrow size={16} style={{ transform: 'scaleX(-1)' }} /> {u.back}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ---- Clear recommendation ----
function QuizResult({ u, lang, result, bySlug, onDetails, waUrl, headingRef, Arrow }) {
  const p = result.primary
  const item = bySlug[p.slug]
  const band = bandOf(p.score)
  const reasons = [...new Set(p.reasons)].map(k => REASONS[k]?.[lang]).filter(Boolean)
  const alt = result.alternative ? bySlug[result.alternative.slug] : null

  return (
    <>
      <span className="eyebrow">{u.resultEyebrow}</span>
      <h2 className="quiz-result-title" tabIndex={-1} ref={headingRef}>{u.yourMatch}</h2>

      <div className="quiz-primary">
        <div className="quiz-primary-media">
          <span className="model-water" aria-hidden="true" />
          <img src={item.img} alt={item.name} />
        </div>
        <div className="quiz-primary-info">
          <div className="quiz-score">
            <span className="quiz-score-num">{p.score}%</span>
            <span className={`quiz-band band-${band}`}>{u.bands[band]}</span>
          </div>
          <h3>{item.name}</h3>
          {reasons.length > 0 && (
            <>
              <p className="quiz-why">{u.why}</p>
              <ul className="quiz-why-list">
                {reasons.map((r, i) => <li key={i}><Check size={15} /> {r}</li>)}
              </ul>
            </>
          )}
          <div className="quiz-cta-row">
            <button className="btn btn-primary" onClick={() => onDetails(item)}>{u.detailsCta} <Arrow size={16} /></button>
            <a className="btn btn-wa" href={waUrl} target="_blank" rel="noopener noreferrer" aria-label={u.waCta}>
              <WhatsAppIcon size={18} /> {u.waCta}
            </a>
          </div>
        </div>
      </div>

      {alt && (
        <div className="quiz-alt">
          <span className="quiz-alt-label">{u.alt}</span>
          <button className="quiz-alt-card" onClick={() => onDetails(alt)}>
            <img src={alt.img} alt={alt.name} />
            <span className="quiz-alt-name">{alt.name}</span>
            <span className="quiz-alt-score">{result.alternative.score}% {u.match}</span>
          </button>
        </div>
      )}
    </>
  )
}

// ---- Unsure / low-confidence ----
function QuizUnsure({ u, lang, result, bySlug, onDetails, waUrl, phone, headingRef }) {
  const msg = result.unsureReason === 'pou' ? u.unsurePou
    : result.unsureReason === 'chlorine' ? u.unsureChlorine : u.unsureBody
  return (
    <>
      <span className="eyebrow">{u.resultEyebrow}</span>
      <h2 className="quiz-result-title" tabIndex={-1} ref={headingRef}>{u.unsureTitle}</h2>
      <p className="quiz-unsure-body">{msg}</p>
      <div className="quiz-cta-row">
        <a className="btn btn-wa" href={waUrl} target="_blank" rel="noopener noreferrer" aria-label={u.waCta}>
          <WhatsAppIcon size={18} /> {u.waCta}
        </a>
        <a className="btn btn-ghost" href={`tel:${phone}`}><Phone size={16} /> {u.callCta}</a>
      </div>

      {result.results && result.results.length > 0 && (
        <div className="quiz-maybe">
          <span className="quiz-maybe-label">{u.optionsToCheck}</span>
          <div className="quiz-maybe-row">
            {result.results.map(r => {
              const it = bySlug[r.slug]
              return (
                <button key={r.slug} className="quiz-alt-card" onClick={() => onDetails(it)}>
                  <img src={it.img} alt={it.name} />
                  <span className="quiz-alt-name">{it.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
