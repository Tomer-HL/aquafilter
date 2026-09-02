import { useState, useEffect, useRef } from 'react'
import { Accessibility as A11yIcon, X, Plus, Minus, Contrast, Link2, Type, Pause, RotateCcw, FileText } from 'lucide-react'

const UI = {
  he: {
    open: 'אפשרויות נגישות', title: 'נגישות', close: 'סגירה',
    text: 'גודל טקסט', dec: 'הקטנת טקסט', inc: 'הגדלת טקסט',
    contrast: 'ניגודיות גבוהה', links: 'הדגשת קישורים', readable: 'גופן קריא',
    motion: 'עצירת אנימציות', reset: 'איפוס הגדרות', statement: 'הצהרת נגישות',
  },
  en: {
    open: 'Accessibility options', title: 'Accessibility', close: 'Close',
    text: 'Text size', dec: 'Decrease text', inc: 'Increase text',
    contrast: 'High contrast', links: 'Highlight links', readable: 'Readable font',
    motion: 'Pause animations', reset: 'Reset settings', statement: 'Accessibility statement',
  },
}

const ZOOMS = [1, 1.1, 1.25, 1.4]
const DEFAULTS = { zoom: 0, contrast: false, links: false, readable: false, motion: false }

function load() {
  try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem('a11y')) || {}) } }
  catch { return { ...DEFAULTS } }
}

export default function Accessibility({ lang, onStatement }) {
  const u = UI[lang]
  const [open, setOpen] = useState(false)
  const [s, setS] = useState(load)
  const panelRef = useRef(null)
  const btnRef = useRef(null)

  // Apply settings to <html>
  useEffect(() => {
    const el = document.documentElement
    el.style.zoom = ZOOMS[s.zoom] === 1 ? '' : String(ZOOMS[s.zoom])
    el.classList.toggle('a11y-contrast', s.contrast)
    el.classList.toggle('a11y-links', s.links)
    el.classList.toggle('a11y-readable', s.readable)
    el.classList.toggle('a11y-motion', s.motion)
    try { localStorage.setItem('a11y', JSON.stringify(s)) } catch { /* storage may be blocked */ }
  }, [s])

  // Close on Escape; focus first control when opening
  useEffect(() => {
    if (!open) return
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus() } }
    document.addEventListener('keydown', onKey)
    const first = panelRef.current?.querySelector('button')
    first?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const set = patch => setS(prev => ({ ...prev, ...patch }))
  const toggle = key => set({ [key]: !s[key] })

  return (
    <>
      <button ref={btnRef} className="a11y-fab" aria-label={u.open} aria-expanded={open}
        aria-haspopup="dialog" onClick={() => setOpen(o => !o)}>
        <A11yIcon size={26} />
      </button>

      {open && (
        <div className="a11y-panel" role="dialog" aria-label={u.title} ref={panelRef}>
          <div className="a11y-head">
            <strong>{u.title}</strong>
            <button className="a11y-x" aria-label={u.close} onClick={() => { setOpen(false); btnRef.current?.focus() }}>
              <X size={18} />
            </button>
          </div>

          <div className="a11y-text-row" role="group" aria-label={u.text}>
            <button className="a11y-step" aria-label={u.dec} onClick={() => set({ zoom: Math.max(0, s.zoom - 1) })}
              disabled={s.zoom === 0}><Minus size={16} /></button>
            <span className="a11y-text-label"><Type size={16} /> {u.text}</span>
            <button className="a11y-step" aria-label={u.inc} onClick={() => set({ zoom: Math.min(ZOOMS.length - 1, s.zoom + 1) })}
              disabled={s.zoom === ZOOMS.length - 1}><Plus size={16} /></button>
          </div>

          <button className={`a11y-toggle${s.contrast ? ' on' : ''}`} aria-pressed={s.contrast} onClick={() => toggle('contrast')}>
            <Contrast size={18} /> {u.contrast}
          </button>
          <button className={`a11y-toggle${s.links ? ' on' : ''}`} aria-pressed={s.links} onClick={() => toggle('links')}>
            <Link2 size={18} /> {u.links}
          </button>
          <button className={`a11y-toggle${s.readable ? ' on' : ''}`} aria-pressed={s.readable} onClick={() => toggle('readable')}>
            <Type size={18} /> {u.readable}
          </button>
          <button className={`a11y-toggle${s.motion ? ' on' : ''}`} aria-pressed={s.motion} onClick={() => toggle('motion')}>
            <Pause size={18} /> {u.motion}
          </button>

          <div className="a11y-foot">
            <button className="a11y-link-btn" onClick={() => setS({ ...DEFAULTS })}><RotateCcw size={15} /> {u.reset}</button>
            <button className="a11y-link-btn" onClick={() => { setOpen(false); onStatement() }}><FileText size={15} /> {u.statement}</button>
          </div>
        </div>
      )}
    </>
  )
}
