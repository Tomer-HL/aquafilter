import { useEffect, useMemo, useRef } from 'react'

// "50 microns is finer than a hair" strip — a measuring ruler in microns (10px per µ, 0..210µ)
// that slides gently as the page scrolls. Static when the visitor prefers reduced motion
// or turned on "stop animations" in the accessibility widget.
const W = 2200
const PX = 10
const X0 = 40

export default function MicronRuler({ copy }) {
  const scaleRef = useRef(null)
  const svgRef = useRef(null)

  const marks = useMemo(() => {
    const out = []
    for (let u = 0; u <= 210; u++) {
      const x = X0 + u * PX
      const key = u === 50 || u === 70
      const len = key ? 46 : u % 10 === 0 ? 34 : u % 5 === 0 ? 22 : 12
      out.push(<line key={'l' + u} x1={x} y1="0" x2={x} y2={len} stroke={key ? '#075E86' : '#B9CDD8'} strokeWidth={key ? 2 : 1} />)
      if (u % 10 === 0 && !key) out.push(<text key={'t' + u} x={x} y="62" textAnchor="middle">{u}µ</text>)
    }
    return out
  }, [])

  useEffect(() => {
    const sc = scaleRef.current, svg = svgRef.current
    if (!sc || !svg) return
    const still = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('a11y-motion')
    let raf = 0
    const update = () => {
      raf = 0
      const max = W - sc.clientWidth
      if (still()) { svg.style.transform = `translateX(${-(max * 0.2).toFixed(1)}px)`; return }
      const r = sc.getBoundingClientRect()
      const p = 1 - Math.max(0, Math.min(1, (r.top + r.height) / (innerHeight + r.height)))
      svg.style.transform = `translateX(${(-(max * 0.08) - p * max * 0.35).toFixed(1)}px)`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div className="ruler" role="img" aria-label={copy.aria}>
      <div className="container ruler-in">
        <p className="ruler-note"><b>{copy.title}</b>{copy.text}</p>
        <div className="ruler-scale" ref={scaleRef} aria-hidden="true">
          <svg ref={svgRef} viewBox={`0 0 ${W} 84`} width={W} height="84" direction="ltr">
            {marks}
            <rect x={X0} y="0" width={50 * PX} height="6" fill="#0A9BD6" opacity=".9" />
            <text className="hl" x={X0 + 50 * PX} y="66" textAnchor="middle" direction={copy.dir}>{copy.mesh}</text>
            <text className="hl" x={X0 + 70 * PX} y="66" textAnchor="middle" direction={copy.dir}>{copy.hair}</text>
          </svg>
        </div>
      </div>
    </div>
  )
}
