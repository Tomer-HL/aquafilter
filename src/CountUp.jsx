import { useEffect, useRef, useState } from 'react'

// Counts a stat like "500+" up from 0 the first time it scrolls into view.
// Keeps any prefix/suffix ("+", ",") and skips the animation for reduced motion
// or when the accessibility widget's "stop animations" option is on.
export default function CountUp({ value, duration = 1200 }) {
  const m = String(value).match(/^(\D*)([\d,]+)(.*)$/)
  const target = m ? parseInt(m[2].replace(/,/g, ''), 10) : 0
  const ref = useRef(null)
  const [n, setN] = useState(m ? 0 : null)

  useEffect(() => {
    if (!m) return
    const el = ref.current
    const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('a11y-motion')
    if (still || !('IntersectionObserver' in window)) { setN(target); return }
    let raf
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1)
        setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
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
