import CountUp from './CountUp.jsx'

// Trust numbers strip (500+ customers · 10 years · warranty), shown right under the
// micron ruler. Numbers marked to count animate up when scrolled into view.
export default function TrustStats({ lang, stats }) {
  return (
    <section className="trust-strip" aria-label={lang === 'he' ? 'במספרים' : 'In numbers'}>
      <div className="container trust-stats">
        {stats.map(([value, label, count], i) => (
          <div className="stat" key={lang + i}>
            {count ? <CountUp value={value} /> : <b>{value}</b>}
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
