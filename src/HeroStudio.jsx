import { useRef } from 'react'

// Hero product: the real water-splash photo on its own (no backdrop, badge or label).
// It tilts in 3D toward the pointer; no tilt for reduced motion or the accessibility
// widget's "stop animations".
export default function HeroStudio({ alt }) {
  const stage = useRef(null)
  const tilt = useRef(null)

  const still = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.classList.contains('a11y-motion')

  const move = (e) => {
    if (still() || !stage.current) return
    const r = stage.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    tilt.current.style.transform = `rotateY(${(x * 24).toFixed(2)}deg) rotateX(${(-y * 12).toFixed(2)}deg)`
  }
  const reset = () => { if (tilt.current) tilt.current.style.transform = '' }

  return (
    <div className="hero-visual hero-studio" ref={stage} onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset}>
      <div className="hero-studio-tilt" ref={tilt}>
        <img className="hero-product" src="/products/hero-splash-full.webp" alt={alt} />
      </div>
    </div>
  )
}
