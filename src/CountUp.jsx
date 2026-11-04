import { useEffect, useRef, useState } from 'react'

// Counts a stat like "500+" up from 0 every time it scrolls into view.
// Keeps any prefix/suffix ("+", ","). Skipped only when the site's own
// accessibility widget has "stop animations" turned on.
export default function CountUp({ value, duration = 1500 }) {
  const m = String(value).match(/^(\D*)([\d,]+)(.*)$/)
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : 0
  const ref = useRef(null)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!m) return
    const el = ref.current
    const still = () => document.documentElement.classList.contains('a11y-motion')
    if (!('IntersectionObserver' in window)) { setN(target); return }
    let raf
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf)
      if (!e.isIntersecting) { setN(0); return }
      if (still()) { setN(target); return }
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1)
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [value])

  if (!m) return <b>{value}</b>
  return (
    <b ref={ref}>
      {n === target ? value : `${m[1]}${n.toLocaleString('en-US')}${m[3]}`}
    </b>
  )
}
