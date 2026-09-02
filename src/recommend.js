// ============================================================================
// Water-filtration recommendation engine  (pure logic — no UI/JSX here)
// ----------------------------------------------------------------------------
// Source of truth: the 5 real catalog products (mainFilters.items in i18n.js)
// and their banners. ALL five are point-of-entry (whole-house / main-line)
// COMBINED filters: 50µ stainless-steel mesh sediment filtration + anti-scale
// (up to 85%). None of them is a point-of-use / drinking-water / carbon / RO
// unit — so drinking-water, taste/odor (chlorine) or single-point/appliance
// requests have NO match here and must fall into UNSURE mode (→ contact us).
//
// Weighted scoring (max 100):
//   base (valid main-line solution) ... 10
//   coverage / installation .......... 25
//   main water problem ............... 30   (highest weight)
//   desired outcome .................. 15
//   property / usage ................. 10
//   maintenance / convenience ........ 10
// Hard exclusions override any score (Part 18).
// ============================================================================

// ---- Per-product suitability profiles (derived only from banners/verified data)
export const PROFILES = {
  compact: {
    coverage: 'poe',
    problems: ['scale', 'sediment', 'combo'],
    flushValve: true, washable: false, twoStage: false,
    madeInIsrael: true, warrantyYears: 1, compact: true,
  },
  combined: {
    coverage: 'poe',
    problems: ['scale', 'sediment', 'combo'],
    flushValve: false, washable: true, twoStage: false,
    madeInIsrael: false, warrantyYears: 1, compact: false,
  },
  'two-stage': {
    coverage: 'poe',
    problems: ['scale', 'sediment', 'combo', 'heavy'],
    flushValve: false, washable: false, twoStage: true,
    madeInIsrael: false, warrantyYears: 2, compact: false,
  },
  asf770: {
    coverage: 'poe',
    problems: ['scale', 'sediment', 'combo'],
    flushValve: true, washable: false, twoStage: false,
    madeInIsrael: false, warrantyYears: 3, compact: false,
  },
  alpha: {
    coverage: 'poe',
    problems: ['scale', 'sediment', 'combo'],
    flushValve: true, washable: false, twoStage: false,
    madeInIsrael: true, warrantyYears: 1, compact: false,
  },
}

// item.img '/products/product-compact.png' -> 'compact'
export const slugOf = item => {
  const m = /product-([a-z0-9-]+)\.(png|jpg)/i.exec(item.img || '')
  return m ? m[1] : ''
}

// ---- Questions (bilingual). Each option carries an `id`; scoring reads ids. ----
export const QUESTIONS = [
  {
    id: 'coverage',
    he: { q: 'מה תרצו לסנן?', sub: 'איפה הפתרון אמור לפעול' },
    en: { q: 'What would you like to filter?', sub: 'Where the solution should work' },
    options: [
      { id: 'whole', he: 'את כל המים בבית (כניסה ראשית)', en: 'All water in the home (main line)' },
      { id: 'drinking', he: 'מי שתייה ובישול בלבד', en: 'Drinking & cooking water only' },
      { id: 'point', he: 'ברז / נקודת מים מסוימת', en: 'A specific tap / point of use' },
      { id: 'appliance', he: 'מכשיר מסוים (דוד, מדיח וכד׳)', en: 'A specific appliance' },
      { id: 'unsure', he: 'אני לא בטוח/ה', en: 'I’m not sure' },
    ],
  },
  {
    id: 'problem',
    he: { q: 'מה הבעיה העיקרית שברצונכם לפתור?', sub: 'הגורם הכי חשוב' },
    en: { q: 'What is the main problem you want to solve?', sub: 'The most important factor' },
    options: [
      { id: 'scale', he: 'אבנית (הגנה על דוד וצנרת)', en: 'Limescale (protect boiler & pipes)' },
      { id: 'sediment', he: 'חול / חלודה / לכלוך / משקעים', en: 'Sand / rust / dirt / sediment' },
      { id: 'heavy', he: 'הרבה משקעים / סינון מוגבר', en: 'Heavy sediment / stronger filtration' },
      { id: 'combo', he: 'שילוב של אבנית ולכלוך', en: 'Both limescale and dirt' },
      { id: 'chlorine', he: 'טעם או ריח של כלור במי שתייה', en: 'Chlorine taste/odor in drinking water' },
      { id: 'unsure', he: 'אני לא בטוח/ה', en: 'I’m not sure' },
    ],
  },
  {
    id: 'property',
    he: { q: 'איזה סוג נכס?', sub: 'עוזר להתאים את גודל הפתרון' },
    en: { q: 'What type of property?', sub: 'Helps match the right size' },
    options: [
      { id: 'apartment', he: 'דירה', en: 'Apartment' },
      { id: 'house', he: 'בית פרטי', en: 'Private house' },
      { id: 'business', he: 'עסק / משרד', en: 'Business / office' },
      { id: 'other', he: 'אחר', en: 'Other' },
    ],
  },
  {
    id: 'outcome',
    he: { q: 'מה הכי חשוב לכם?', sub: 'התוצאה שאתם מחפשים' },
    en: { q: 'What matters most to you?', sub: 'The outcome you want' },
    options: [
      { id: 'pipes', he: 'הגנה על הצנרת והבית', en: 'Protecting plumbing & home' },
      { id: 'clear', he: 'מים נקיים וצלולים', en: 'Clean, clear water' },
      { id: 'boiler', he: 'הגנה על הדוד ומכשירי המים', en: 'Protecting boiler & appliances' },
      { id: 'warranty', he: 'אחריות ארוכה ככל האפשר', en: 'The longest possible warranty' },
      { id: 'israel', he: 'מוצר תוצרת ישראל', en: 'A product made in Israel' },
      { id: 'combo', he: 'שילוב של כמה דברים', en: 'A combination of these' },
    ],
  },
  {
    id: 'maintenance',
    he: { q: 'מה מעדיפים בתחזוקה?', sub: 'איך נוח לכם לתחזק את המסנן' },
    en: { q: 'Maintenance preference?', sub: 'How you prefer to maintain it' },
    options: [
      { id: 'flush', he: 'שטיפה קלה עם שסתום שטיפה', en: 'Easy rinsing via a flush valve' },
      { id: 'washable', he: 'מחסנית רשת לשטיפה ולשימוש חוזר', en: 'Washable, reusable mesh cartridge' },
      { id: 'any', he: 'לא משנה לי', en: 'No preference' },
    ],
  },
]

// ---- Reason labels (bilingual) surfaced in the "why it matches" explanation ----
export const REASONS = {
  whole:    { he: 'סינון בכניסה הראשית לכל הבית', en: 'Whole-home filtration at the main line' },
  scale:    { he: 'טיפול ומניעת אבנית עד 85%', en: 'Prevents limescale up to 85%' },
  sediment: { he: 'סינון חול, חלודה ולכלוך (50 מיקרון)', en: 'Filters sand, rust & dirt (50 micron)' },
  heavy:    { he: 'סינון דו־שלבי למשקעים מרובים', en: 'Two-stage filtration for heavy sediment' },
  combo:    { he: 'מחסנית משולבת — אבנית ולכלוך יחד', en: 'Combined cartridge — scale and dirt together' },
  pipes:    { he: 'הגנה על הצנרת והבית', en: 'Protects plumbing and home' },
  clear:    { he: 'מים נקיים וצלולים', en: 'Clean, clear water' },
  boiler:   { he: 'הגנה על הדוד וגופי החימום', en: 'Protects the boiler & heating elements' },
  warranty: { he: 'אחריות ארוכה', en: 'Long warranty' },
  israel:   { he: 'תוצרת ישראל (עמיעד)', en: 'Made in Israel (Amiad)' },
  flush:    { he: 'שסתום שטיפה לתחזוקה קלה', en: 'Flush valve for easy maintenance' },
  washable: { he: 'מחסנית רשת לשטיפה ולשימוש חוזר', en: 'Washable, reusable mesh cartridge' },
  apartment:{ he: 'גודל קומפקטי שחוסך מקום', en: 'Compact, space-saving size' },
}

// ---- Core scorer for a single product --------------------------------------
function scoreProduct(slug, a) {
  const p = PROFILES[slug]
  if (!p) return { slug, score: 0, excluded: true, reasons: [] }

  // ----- HARD EXCLUSIONS (Part 18): fundamental incompatibility -----
  // Requests that need point-of-use / drinking-water / carbon — no POE unit fits.
  if (['drinking', 'point', 'appliance'].includes(a.coverage))
    return { slug, score: 0, excluded: true, reason: 'pou', reasons: [] }
  if (a.problem === 'chlorine')
    return { slug, score: 0, excluded: true, reason: 'chlorine', reasons: [] }

  let score = 10 // base: valid main-line solution
  const reasons = []

  // ----- Coverage / installation (25) -----
  if (a.coverage === 'whole') { score += 25; reasons.push('whole') }
  else if (a.coverage === 'unsure') { score += 13 }         // partial, lowers confidence

  // ----- Main water problem (30) -----
  if (a.problem === 'scale') { score += 30; reasons.push('scale') }
  else if (a.problem === 'sediment') { score += 30; reasons.push('sediment') }
  else if (a.problem === 'combo') { score += 30; reasons.push('combo') }
  else if (a.problem === 'heavy') {
    // heavy sediment strongly favors the two-stage unit
    score += p.twoStage ? 30 : 20
    reasons.push(p.twoStage ? 'heavy' : 'sediment')
  } else if (a.problem === 'unsure') { score += 15 }        // partial, lowers confidence

  // ----- Desired outcome (15) -----
  switch (a.outcome) {
    case 'pipes':  score += 15; reasons.push('pipes'); break
    case 'clear':  score += 15; reasons.push('clear'); break
    case 'boiler': score += 15; reasons.push('boiler'); break
    case 'combo':  score += 13; break
    case 'warranty':
      score += p.warrantyYears >= 3 ? 15 : p.warrantyYears === 2 ? 11 : 7
      if (p.warrantyYears >= 2) reasons.push('warranty')
      break
    case 'israel':
      score += p.madeInIsrael ? 15 : 4
      if (p.madeInIsrael) reasons.push('israel')
      break
    default: break
  }

  // ----- Property / usage (10) -----
  if (a.property === 'apartment') { score += p.compact ? 10 : 6; if (p.compact) reasons.push('apartment') }
  else if (a.property === 'house' || a.property === 'business') { score += 8 }
  else if (a.property === 'other') { score += 6 }

  // ----- Maintenance / convenience (10) -----
  if (a.maintenance === 'flush') { score += p.flushValve ? 10 : 5; if (p.flushValve) reasons.push('flush') }
  else if (a.maintenance === 'washable') { score += p.washable ? 10 : 5; if (p.washable) reasons.push('washable') }
  else if (a.maintenance === 'any') { score += 8 }

  return { slug, score: Math.max(0, Math.min(100, Math.round(score))), excluded: false, reasons }
}

// ---- Public: evaluate all products for a set of answers ---------------------
// answers = { coverage, problem, property, outcome, maintenance }
export function recommend(answers) {
  const slugs = Object.keys(PROFILES)
  const all = slugs.map(s => scoreProduct(s, answers))
  const eligible = all.filter(r => !r.excluded).sort((x, y) => y.score - x.score)

  // Everything excluded → the catalog can't serve this need (POU / chlorine).
  if (eligible.length === 0) {
    const reason = ['drinking', 'point', 'appliance'].includes(answers.coverage) ? 'pou'
      : answers.problem === 'chlorine' ? 'chlorine' : 'none'
    return { status: 'unsure', confidence: 'none', unsureReason: reason, results: [] }
  }

  const top = eligible[0]
  const second = eligible[1]
  const margin = second ? top.score - second.score : top.score

  const answered = ['coverage', 'problem', 'property', 'outcome', 'maintenance']
    .filter(k => answers[k] && answers[k] !== 'unsure').length
  const tooVague = answered < 2 || (answers.coverage === 'unsure' && answers.problem === 'unsure')

  // ----- UNSURE mode (Part 23): only for genuinely weak/ambiguous cases -----
  // A close race between two STRONG matches is NOT unsure — it becomes a
  // primary + alternative (Part 21). Unsure is for: vague answers, a weak top
  // score, or a mediocre-and-tied result with no clear winner.
  if (tooVague || top.score < 55 || (top.score < 75 && margin < 5)) {
    return {
      status: 'unsure', confidence: 'low', unsureReason: 'ambiguous',
      results: eligible.slice(0, 2),  // shown only as "options to check", never "your match"
    }
  }

  // ----- Confidence (Part 24) — labeling only, does not force unsure -----
  let confidence = 'medium'
  if (top.score >= 85 && margin >= 8) confidence = 'high'
  else if (margin < 5) confidence = 'low'

  // ----- Clear recommendation (+ optional close alternative, Part 21) -----
  const alternative = second && margin < 12 ? second : null
  return { status: 'ok', confidence, primary: top, alternative, results: eligible }
}
