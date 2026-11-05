import { useRef } from 'react'

// Hero product in a "studio": soft grey backdrop, the real splash photo, a floor
// shadow and a faint reflection. The filter tilts in 3D toward the pointer
// (no tilt for reduced motion or the accessibility widget's "stop animations").
export default function HeroStudio({ alt, children }) {
  const stage = useRef(null)
  const tilt = useRef(null)
  const shadow = useRef(null)

  const still = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-motion')

  const move = (e) => {
    if (still() || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    tilt.current.style.transform = `rotateY(${(x * 24).toFixed(2)}deg) rotateX(${(-y * 12).toFixed(2)}deg)`
    shadow.current.style.transform = `translateX(${(-x * 36).toFixed(1)}px) scaleX(${(1 - Math.abs(x) * 0.3).toFixed(3)})`
  }
  const reset = () => {
    if (tilt.current) tilt.current.style.transform = ''
    if (shadow.current) shadow.current.style.transform = ''
  }

  return (
    <div className="hero-visual hero-studio" ref={stage} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <span className="hero-studio-shadow" ref={shadow} aria-hidden="true" />
      <div className="hero-studio-tilt" ref={tilt}>
        <img className="hero-product" src="/products/hero-splash-full.webp" alt={alt} />
        <img className="hero-studio-refl" src="/products/hero-splash-full.webp" alt="" aria-hidden="true" />
      </div>
      {children}
    </div>
  )
}
