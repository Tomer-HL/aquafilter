import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ShieldCheck, Check } from 'lucide-react'

/* 3D coverflow carousel for the product lineup (mobile only).
   - Selected product faces the viewer; neighbours turn away at an angle.
   - Swipe/drag, arrows, dots, keyboard (←/→), tap a side card to bring it forward.
   - Tapping the front card opens the existing product-details modal (onOpen).
   - Loops. RTL-aware: in Hebrew the next product sits on the LEFT.
   - Animation is skipped for prefers-reduced-motion and the a11y "stop animations" option. */
export default function ModelsCoverflow({ items, rtl, onOpen, hint, labels }) {
  const N = items.length
  const stageRef = useRef(null)
  const cardRefs = useRef([])
  const st = useRef({ pos: 0, target: 0, dragging: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, vel: 0, moved: false })
  const [active, setActive] = useState(0)
  const [touched, setTouched] = useState(false)

  const mod = i => ((i % N) + N) % N
  const noMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-motion')

  const goTo = i => {                      // shortest way round the loop
    const s = st.current
    let diff = mod(i - Math.round(s.target))
    if (diff > N / 2) diff -= N
    s.target = Math.round(s.target) + diff
  }
  const step = d => { setTouched(true); st.current.target = Math.round(st.current.target) + d }

  // Render loop — writes transforms straight to the DOM (no React re-render per frame)
  useEffect(() => {
    let raf
    const side = rtl ? -1 : 1               // which side "next" sits on
    const frame = () => {
      const s = st.current
      if (!s.dragging) {
        s.pos += (s.target - s.pos) * (noMotion() ? 1 : 0.12)
        if (Math.abs(s.target - s.pos) < 0.001) s.pos = s.target
      }
      cardRefs.current.forEach((c, i) => {
        if (!c) return
        let o = i - s.pos
        if (o > N / 2) o -= N
        if (o < -N / 2) o += N
        const ao = Math.abs(o), sg = Math.sign(o), k = Math.min(ao, 1), far = Math.max(0, ao - 1)
        const x = side * sg * (k * 120 + far * 40)
        c.style.transform = `translateX(${x}px) translateZ(${-k * 160 - far * 60}px) rotateY(${-side * sg * k * 48}deg)`
        c.style.opacity = ao > 2.2 ? 0 : 1 - far * 0.45
        c.style.filter = `brightness(${1 - k * 0.15})`
        c.style.zIndex = 100 - Math.round(ao * 10)
        c.style.pointerEvents = ao < 1.6 ? 'auto' : 'none'
      })
      const a = mod(Math.round(s.pos))
      setActive(prev => (prev === a ? prev : a))
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [N, rtl])

  // Pointer drag / swipe
  const PX_PER_CARD = 130
  const onDown = e => {
    const s = st.current
    Object.assign(s, { dragging: true, moved: false, startX: e.clientX, lastX: e.clientX, startPos: s.pos, lastT: performance.now(), vel: 0 })
    setTouched(true)
  }
  const onMove = e => {
    const s = st.current
    if (!s.dragging) return
    const dx = e.clientX - s.startX
    if (!s.moved && Math.abs(dx) > 6) { s.moved = true; stageRef.current?.setPointerCapture?.(e.pointerId) }
    const dir = rtl ? 1 : -1                // RTL: drag right → next. LTR: drag left → next.
    s.pos = s.target = s.startPos + dir * dx / PX_PER_CARD
    const now = performance.now()
    s.vel = dir * (e.clientX - s.lastX) / Math.max(1, now - s.lastT)
    s.lastX = e.clientX; s.lastT = now
  }
  const onUp = () => {
    const s = st.current
    if (!s.dragging) return
    s.dragging = false
    const fling = Math.max(-1, Math.min(1, s.vel * 250 / PX_PER_CARD))
    s.target = Math.round(s.pos + fling)
  }

  const onCardClick = (i, m) => {
    if (st.current.moved) { st.current.moved = false; return }   // a drag, not a tap
    if (i === active) onOpen(m)
    else { setTouched(true); goTo(i) }
  }

  const onKey = e => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const towardsNext = rtl ? e.key === 'ArrowLeft' : e.key === 'ArrowRight'
    step(towardsNext ? 1 : -1)
  }

  const PrevIcon = rtl ? ChevronRight : ChevronLeft
  const NextIcon = rtl ? ChevronLeft : ChevronRight

  return (
    <div className="cf" role="region" aria-roledescription="carousel" aria-label={labels.region}>
      <div
        className="cf-stage" ref={stageRef} tabIndex={0} onKeyDown={onKey}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div className="cf-floor" aria-hidden="true" />
        <div className="cf-track">
          {items.map((m, i) => (
            <button
              type="button" className="cf-card" key={i}
              ref={el => (cardRefs.current[i] = el)}
              onClick={() => onCardClick(i, m)}
              aria-hidden={i !== active}
              tabIndex={i === active ? 0 : -1}
              aria-label={`${labels.details}: ${m.name}`}
            >
              <span className="cf-media">
                <span className="model-water" aria-hidden="true" />
                <span className="model-warranty"><ShieldCheck size={13} /> {m.warranty}</span>
                <img src={m.img} alt="" draggable="false" />
              </span>
              <span className="cf-body">
                <span className="cf-name">{m.name}</span>
                <span className="cf-desc">{m.desc}</span>
                <span className="cf-chips">
                  {m.chips.map((c, j) => <span className="model-chip" key={j}><Check size={12} /> {c}</span>)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className={`cf-hint${touched ? ' is-hidden' : ''}`} aria-hidden="true">{hint}</p>

      <div className="cf-controls">
        <button type="button" className="cf-arrow" onClick={() => step(-1)} aria-label={labels.prev}><PrevIcon size={18} /></button>
        <div className="cf-dots">
          {items.map((m, i) => (
            <button
              type="button" key={i} className={`cf-dot${i === active ? ' on' : ''}`}
              aria-label={`${i + 1} / ${N}: ${m.name}`} aria-current={i === active}
              onClick={() => { setTouched(true); goTo(i) }}
            />
          ))}
        </div>
        <button type="button" className="cf-arrow" onClick={() => step(1)} aria-label={labels.next}><NextIcon size={18} /></button>
      </div>
      <p className="sr-only" aria-live="polite">{`${active + 1} / ${N}: ${items[active].name}`}</p>
    </div>
  )
}
