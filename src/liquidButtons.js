// Liquid-glass buttons: the highlight follows the pointer, and on touch screens
// (no hover) a tap keeps the "hover" look for a moment. Styles live in index.css.
const SEL = '.btn-primary, .btn-ghost'

function place(btn, e) {
  const r = btn.getBoundingClientRect()
  btn.style.setProperty('--mx', `${e.clientX - r.left}px`)
  btn.style.setProperty('--my', `${e.clientY - r.top}px`)
}

export function initLiquidButtons() {
  if (typeof document === 'undefined') return
  document.addEventListener('pointermove', (e) => {
    const btn = e.target.closest?.(SEL)
    if (btn) place(btn, e)
  }, { passive: true })

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return
    const btn = e.target.closest?.(SEL)
    if (!btn) return
    place(btn, e)
    btn.classList.add('is-on')
    clearTimeout(btn._liquidT)
    btn._liquidT = setTimeout(() => btn.classList.remove('is-on'), 1200)
  }, { passive: true })
}
