import { useEffect, useMemo, useRef, useState } from 'react'

// "50 microns is finer than a hair" strip — a measuring ruler in microns.
// Wide screens: a long ruler (10px per µ) that slides gently as the page scrolls.
// Narrow screens (< 700px): a fitted, still ruler from 25µ to 95µ that fills the
// width, so the 50µ and ~70µ marks and their labels are always fully visible.
// Static when the visitor prefers reduced motion or turned on "stop animations".
const W = 2200
const PX = 10
const X0 = 40
const FIT_FROM = 25
const FIT_TO = 95

function Marks({ x, from, to, every, tickH, labelY, fontPx }) {
  const out = []
  for (let u = from; u <= to; u++) {
    const key = u === 50 || u === 70
    const len = key ? tickH.key : u % 10 === 0 ? tickH.ten : u % 5 === 0 ? tickH.five : tickH.one
    if (!key && u % every !== 0) continue
    out.push(<line key={'l' + u} x1={x(u)} y1="0" x2={x(u)} y2={len} stroke={key ? '#075E86' : '#B9CDD8'} strokeWidth={key ? 2 : 1} />)
    if (u % 10 === 0 && !key) out.push(<text key={'t' + u} x={x(u)} y={labelY} textAnchor="middle" style={{ fontSize: fontPx }}>{u}µ</text>)
  }
  return out
}

export default function MicronRuler({ copy }) {
  const scaleRef = useRef(null)
  const svgRef = useRef(null)
  const [width, setWidth] = useState(0)
  const fit = width > 0 && width < 700

  // track the scale's width
  useEffect(() => {
    const el = scaleRef.current
    if (!el) return
    const update = () => setWidth(el.clientWidth)
    update()
    if ('ResizeObserver' in window) {
      const ro = new ResizeObserver(update)
      ro.observe(el)
      return () => ro.disconnect()
    }
    addEventListener('resize', update)
    return () => removeEventListener('resize', update)
  }, [])

  // sliding behaviour (wide screens only)
  useEffect(() => {
    const sc = scaleRef.current, svg = svgRef.current
    if (!sc || !svg || fit) { if (svg) svg.style.transform = ''; return }
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
  }, [fit])

  const wide = useMemo(() => {
    const x = (u) => X0 + u * PX
    return { x, marks: <Marks x={x} from={0} to={210} every={1} tickH={{ key: 46, ten: 34, five: 22, one: 12 }} labelY={62} fontPx={13} /> }
  }, [])

  let content
  if (fit) {
    const pad = 12
    const k = (width - pad * 2) / (FIT_TO - FIT_FROM)
    const x = (u) => pad + (u - FIT_FROM) * k
    content = (
      <svg key="fit" className="ruler-fit" viewBox={`0 0 ${width} 72`} width={width} height="72" direction="ltr">
        <Marks x={x} from={FIT_FROM} to={FIT_TO} every={k < 5 ? 5 : 1} tickH={{ key: 40, ten: 28, five: 18, one: 10 }} labelY={56} fontPx={11} />
        <rect x={pad} y="0" width={x(50) - pad} height="5" fill="#0A9BD6" opacity=".9" />
        {/* labels grow away from each other: 50µ to the left of its mark, 70µ to the right */}
        <text className="hl" x={x(50) + 4} y="70" textAnchor={copy.dir === 'rtl' ? 'start' : 'end'} direction={copy.dir} style={{ fontSize: 12 }}>{copy.mesh}</text>
        <text className="hl" x={x(70) - 4} y="70" textAnchor={copy.dir === 'rtl' ? 'end' : 'start'} direction={copy.dir} style={{ fontSize: 12 }}>{copy.hair}</text>
      </svg>
    )
  } else {
    content = (
      <svg key="wide" ref={svgRef} viewBox={`0 0 ${W} 84`} width={W} height="84" direction="ltr">
        {wide.marks}
        <rect x={X0} y="0" width={50 * PX} height="6" fill="#0A9BD6" opacity=".9" />
        <text className="hl" x={wide.x(50)} y="66" textAnchor="middle" direction={copy.dir}>{copy.mesh}</text>
        <text className="hl" x={wide.x(70)} y="66" textAnchor="middle" direction={copy.dir}>{copy.hair}</text>
      </svg>
    )
  }

  return (
    <div className="ruler" role="img" aria-label={copy.aria}>
      <div className="container ruler-in">
        <p className="ruler-note"><b>{copy.title}</b>{copy.text}</p>
        <div className={`ruler-scale ${fit ? 'is-fit' : ''}`} ref={scaleRef} aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  )
}
