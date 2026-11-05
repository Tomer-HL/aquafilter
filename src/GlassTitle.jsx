import { useEffect, useRef } from 'react'

// Hero headline: the question stays dark, the answer ("שמים לזה סוף!") is made of the
// same blue glass as the buttons, with a shine that follows the pointer over the hero
// and drifts on its own on touch screens. Shine stays put for reduced motion / "stop
// animations"; high-contrast mode shows plain black text.
export default function GlassTitle({ text }) {
  const ref = useRef(null)
  const i = text.indexOf('?')
  const q = i >= 0 ? text.slice(0, i + 1) : ''
  const a = i >= 0 ? text.slice(i + 1).trim() : text

  useEffect(() => {
    const g = ref.current
    if (!g) return
    const hero = g.closest('section') || g.parentElement
    const still = () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('a11y-motion')
    let raf = 0, t = 0, visible = true, pointerOn = false
    const set = (x, y) => { g.style.setProperty('--mx', `${x}px`); g.style.setProperty('--my', `${y}px`) }
    const loop = () => {
      raf = 0
      if (!visible || pointerOn) return
      if (!still()) {
        t += 0.012
        const r = g.getBoundingClientRect()
        set(r.width * (0.5 + 0.5 * Math.sin(t)), r.height * 0.35)
      }
      raf = requestAnimationFrame(loop)
    }
    const start = () => { if (!raf) raf = requestAnimationFrame(loop) }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse' || still()) return
      pointerOn = true
      const r = g.getBoundingClientRect()
      set(e.clientX - r.left, e.clientY - r.top)
    }
    const onLeave = () => { pointerOn = false; start() }
    hero.addEventListener('pointermove', onMove, { passive: true })
    hero.addEventListener('pointerleave', onLeave)
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start() })
      : null
    io?.observe(g)
    start()
    return () => {
      hero.removeEventListener('pointermove', onMove)
      hero.removeEventListener('pointerleave', onLeave)
      io?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <h1 className="glass-title">
      {q && <>{q} </>}
      <span className="glass-line"><span className="glass-text" ref={ref} data-text={a}>{a}</span></span>
    </h1>
  )
}
