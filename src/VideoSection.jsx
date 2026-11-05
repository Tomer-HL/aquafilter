import { useEffect, useRef, useState } from 'react'
import { Play, Captions } from 'lucide-react'

// "How it works" explainer video.
// Nothing loads or plays until the visitor presses play (preload="none"), so there is
// never sound on page load. Phones get the vertical cut, wider screens the 16:9 cut.
// Subtitles (WebVTT, IS 5568) are rendered in a caption bar UNDER the video so they
// never cover the picture. In full screen they fall back to the player's own captions.
// The player's CC menu stays in sync with the bar.
export default function VideoSection({ lang, copy, mobile }) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [capOn, setCapOn] = useState(true)
  const [capLang, setCapLang] = useState(lang)
  const [cap, setCap] = useState('')
  const [fs, setFs] = useState(false)
  const v = mobile ? 'mobile' : 'desktop'

  useEffect(() => { setCapLang(lang) }, [lang])

  // Track modes: the chosen language is 'hidden' (fires cues, draws nothing) for the
  // bar, or 'showing' while in full screen; everything else 'disabled'.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const tracks = el.textTracks
    const apply = () => {
      for (const t of tracks) {
        const want = capOn && t.language === capLang ? (fs ? 'showing' : 'hidden') : 'disabled'
        if (t.mode !== want) t.mode = want
      }
    }
    const onCue = (e) => {
      const c = e.target.activeCues
      setCap(c && c.length ? [...c].map(x => x.text).join('\n') : '')
    }
    // Mirror changes made from the player's own CC menu.
    const onChange = () => {
      if (fs) return
      const showing = [...tracks].find(t => t.mode === 'showing')
      if (showing) { setCapOn(true); setCapLang(showing.language); showing.mode = 'hidden'; return }
      if (![...tracks].some(t => t.mode === 'hidden')) { setCapOn(false); setCap('') }
    }
    apply()
    for (const t of tracks) t.addEventListener('cuechange', onCue)
    tracks.addEventListener('change', onChange)
    return () => {
      for (const t of tracks) t.removeEventListener('cuechange', onCue)
      tracks.removeEventListener('change', onChange)
    }
  }, [capOn, capLang, fs, v])

  // Full screen (standard + iOS)
  useEffect(() => {
    const el = ref.current
    const onFs = () => setFs(document.fullscreenElement === el || document.webkitFullscreenElement === el)
    const on = () => setFs(true), off = () => setFs(false)
    document.addEventListener('fullscreenchange', onFs)
    document.addEventListener('webkitfullscreenchange', onFs)
    el?.addEventListener('webkitbeginfullscreen', on)
    el?.addEventListener('webkitendfullscreen', off)
    return () => {
      document.removeEventListener('fullscreenchange', onFs)
      document.removeEventListener('webkitfullscreenchange', onFs)
      el?.removeEventListener('webkitbeginfullscreen', on)
      el?.removeEventListener('webkitendfullscreen', off)
    }
  }, [v])

  const start = () => {
    setStarted(true)
    const el = ref.current
    if (el) { const p = el.play(); if (p && p.catch) p.catch(() => {}) }
  }

  return (
    <section className="section video-sec" id="video">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{copy.eyebrow}</span>
          <h2>{copy.title}</h2>
          <p>{copy.sub}</p>
        </div>
        <div className={`vid-card ${mobile ? 'is-portrait' : ''}`}>
          <div className="vid-wrap">
            <video
              key={v}
              ref={ref}
              className="vid"
              controls={started}
              preload="none"
              playsInline
              poster={`/videos/poster-${v}.jpg`}
              aria-label={copy.title}
            >
              <source src={`/videos/hardwater-${v}.mp4`} type="video/mp4" />
              <track kind="subtitles" src="/videos/captions-he.vtt" srcLang="he" label="עברית" />
              <track kind="subtitles" src="/videos/captions-en.vtt" srcLang="en" label="English" />
            </video>
            {!started && (
              <button className="vid-play" onClick={start} aria-label={copy.play}>
                <span className="vid-play-ic"><Play size={mobile ? 34 : 40} fill="currentColor" aria-hidden="true" /></span>
                <span className="vid-play-label">{copy.play} · {copy.duration}</span>
              </button>
            )}
          </div>
          {started && (
            <div className="vid-caps">
              <p className="vid-cap-text" dir={capLang === 'he' ? 'rtl' : 'ltr'} lang={capLang} aria-live="off">
                {capOn ? cap : ''}
              </p>
              <button className={`vid-cc ${capOn ? 'on' : ''}`} onClick={() => setCapOn(o => !o)}
                aria-pressed={capOn} aria-label={copy.captions}>
                <Captions size={20} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        {copy.note && <p className="vid-note">{copy.note}</p>}
      </div>
    </section>
  )
}
