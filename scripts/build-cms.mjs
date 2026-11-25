// One-off generator: extracts the client-editable text from src/i18n.js into content/*.json
// and writes the matching Decap CMS field definitions to public/admin/config.yml.
// Run: node scripts/build-cms.mjs   (only needed if the structure of i18n.defaults.js changes; add --reset to also rebuild content/*.json)
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { defaults as content } from '../src/i18n.defaults.js'

// technical keys, plus text that exists in i18n.defaults.js but is not rendered anywhere on the site (verified against src/*.jsx)
const SKIP_TOP = new Set(['dir', 'label', 'zoomLabel', 'services', 'tiers', 'featuredHead', 'products', 'addToCart', 'inclVat', 'finder'])
const SKIP_PATH = new Set(['ruler.dir', 'ruler.aria'])
const L = { // Hebrew labels for the admin screen
  waLabel: 'תיאור כפתור וואטסאפ (לנגישות)', waMessage: 'הודעת הפתיחה בוואטסאפ', zoomLabel: 'תיאור הגדלת תמונה', close: 'טקסט "סגירה"',
  brand: 'שם העסק', name: 'שם', tagline: 'סיסמה', services: 'שורת השירותים', announcements: 'פסי ההכרזות העליונים',
  nav: 'תפריט ניווט', about: 'מי אנחנו', under: 'מערכות תת-כיוריות', whole: 'מערכות לכל הבית', catalog: 'קטלוג פילטרים', parts: 'חלקים וברזים', sale: 'מבצעים', finder: 'איזו מערכת מתאימה לי',
  header: 'כותרת עליונה', phone: 'טלפון', cart: 'עגלה', search: 'חיפוש מוצרים',
  hero: 'אזור הפתיחה (Hero)', eyebrow: 'כותרת קטנה', title: 'כותרת', subtitle: 'תת-כותרת', ctaPrimary: 'כפתור ראשי', ctaSecondary: 'כפתור משני', highlights: 'נקודות בולטות', badge: 'תווית', imageAlt: 'תיאור התמונה (לנגישות)',
  stat1: 'נתון 1', stat1l: 'כיתוב נתון 1', stat2: 'נתון 2', stat2l: 'כיתוב נתון 2', stat3: 'נתון 3', stat3l: 'כיתוב נתון 3',
  ruler: 'המשולש "50 מיקרון"', text: 'טקסט', mesh: 'תווית הרשת', hair: 'תווית השערה',
  video: 'אזור הסרטון', sub: 'תת-כותרת', play: 'כפתור הפעלה', duration: 'משך', captions: 'כתוביות', note: 'הערה',
  tiersHead: 'כותרת המערכות המומלצות', tiers: 'המערכות המומלצות', model: 'דגם', desc: 'תיאור', price: 'מחיר', cta: 'טקסט הכפתור',
  mainFilter: 'המוצר המוביל (מסנן ראשי משולב)', specs: 'מפרט', gift: 'מתנה', benefits: 'יתרונות', label: 'כיתוב',
  mainFilters: 'המוצרים באתר (כרטיסי הדגמים: שם, תיאור, תגיות, אחריות)', orderCta: 'כפתור הזמנה', detailsCta: 'כפתור פרטים', benefitsHead: 'כותרת היתרונות', icon: 'אייקון (לא לשנות)', install: 'התקנה', giftLabel: 'תווית מתנה', warrantyLabel: 'תווית אחריות', certsLabel: 'תווית תקנים', madeInIsrael: 'תוצרת ישראל', disclaimer: 'הערת תמונה', madragUrl: 'קישור למדרג', madragLabel: 'כיתוב קישור מדרג', zoomHint: 'רמז הגדלה', swipeHint: 'רמז החלקה', carouselLabel: 'תיאור הקרוסלה', prevLabel: 'הקודם', nextLabel: 'הבא',
  items: 'רשימת הדגמים (כל כרטיס הוא מוצר)', img: 'נתיב תמונה (לא לשנות)', warranty: 'אחריות', chips: 'תגיות', bannerDesc: 'תיאור הבאנר', certs: 'תקנים ואישורים', origin: 'ארץ ייצור',
  reviews: 'ביקורות לקוחות', more: 'כפתור "עוד"', less: 'כפתור "פחות"', scoreLabel: 'כיתוב ציון', outOf: 'מתוך',
  featuresHead: 'כותרת "למה לבחור בנו"', features: 'יתרונות העסק', catHead: 'כותרת הקטגוריות', categories: 'הקטגוריות', link: 'טקסט הקישור',
  featuredHead: 'כותרת המוצרים הנבחרים', products: 'המוצרים הנבחרים', tag: 'תגית', old: 'מחיר קודם (למבצע)', rating: 'דירוג (1-5)',
  addToCart: 'כפתור "הוספה לעגלה"', inclVat: 'טקסט "כולל מע״מ"',
  finder_: '', about_: '', body: 'גוף הטקסט', brandsHead: 'כותרת היצרנים', brandsList: 'רשימת היצרנים',
  footer: 'כותרת תחתונה (Footer)', colShop: 'כותרת עמודת שירותים', colInfo: 'כותרת עמודת מידע', colContact: 'כותרת עמודת יצירת קשר', shopLinks: 'קישורי שירותים', infoLinks: 'קישורי מידע', address: 'כתובת / אזור שירות', hours: 'שעות פעילות', rights: 'זכויות יוצרים', newsletter: 'הזמנה לרשימת תפוצה', subscribe: 'כפתור הרשמה', emailPh: 'תיאור שדה אימייל', subscribed: 'הודעת תודה על הרשמה',
}
const TOP = { finder: 'שאלון "איזו מערכת מתאימה לי"', about: 'מי אנחנו' }
const lab = (k, top) => (top && TOP[k]) || L[k] || k

const isPlain = v => v && typeof v === 'object' && !Array.isArray(v)
function clean(v, path = '') {
  if (typeof v === 'function') return undefined
  if (Array.isArray(v)) return v.map(x => clean(x, path))
  if (isPlain(v)) {
    const o = {}
    for (const [k, x] of Object.entries(v)) {
      const p = path ? path + '.' + k : k
      if ((!path && SKIP_TOP.has(k)) || SKIP_PATH.has(p)) continue
      const c = clean(x, p); if (c !== undefined) o[k] = c
    }
    return o
  }
  return v
}
const q = s => JSON.stringify(s)
// Block-style YAML so nested fields stay valid
function field(k, v, ind, top) {
  const p = ' '.repeat(ind), h = `${p}- label: ${q(lab(k, top))}\n${p}  name: ${q(k)}\n`
  if (k === 'img' || k === 'icon') return `${h}${p}  widget: hidden`
  if (typeof v === 'boolean') return `${h}${p}  widget: boolean\n${p}  required: false`
  if (typeof v === 'number') return `${h}${p}  widget: number\n${p}  value_type: int\n${p}  required: false`
  if (typeof v === 'string') return `${h}${p}  widget: ${v.length > 70 || v.includes('\n') ? 'text' : 'string'}\n${p}  required: false`
  if (Array.isArray(v)) {
    const s = v[0]
    if (isPlain(s)) {
      const sum = ['name', 'title'].find(x => typeof s[x] === 'string') || Object.keys(s).find(x => typeof s[x] === 'string' && x !== 'icon' && x !== 'img') || Object.keys(s)[0]
      return `${h}${p}  widget: list\n${p}  required: false\n${p}  summary: "{{fields.${sum}}}"\n${p}  fields:\n${Object.entries(s).map(([a, b]) => field(a, b, ind + 4)).join('\n')}`
    }
    return `${h}${p}  widget: list\n${p}  required: false\n${p}  field: { label: "פריט", name: item, widget: string }`
  }
  return `${h}${p}  widget: object\n${p}  collapsed: true\n${p}  fields:\n${Object.entries(v).map(([a, b]) => field(a, b, ind + 4)).join('\n')}`
}

mkdirSync('content', { recursive: true })
const out = {}
for (const lang of ['he', 'en']) {
  out[lang] = clean(content[lang])
  // never overwrite text the client already edited (use --reset to rebuild the JSON from i18n.defaults.js)
  if (!existsSync(`content/${lang}.json`) || process.argv.includes('--reset')) writeFileSync(`content/${lang}.json`, JSON.stringify(out[lang], null, 2) + '\n')
}
// product cards first, so the client finds them immediately
const order = ['mainFilters']
const fields = Object.entries(out.he).sort(([a], [b]) => (order.includes(b) - order.includes(a))).map(([k, v]) => field(k, v, 8, true)).join('\n')
const file = (lang, name) => `      - label: ${q(name)}\n        name: ${lang}\n        file: content/${lang}.json\n        fields:\n${fields}`
const yml = `# Decap CMS. Generated by scripts/build-cms.mjs (edit the generator, not this file, if the structure changes).
backend:
  name: github
  repo: Tomer-HL/aquafilter
  branch: main
  base_url: https://aquafilter-gold.vercel.app   # change to the real domain if one is connected
  auth_endpoint: api/auth
locale: he
site_url: https://aquafilter-gold.vercel.app
display_url: https://aquafilter-gold.vercel.app
publish_mode: simple
media_folder: public/uploads   # required by Decap; the editable fields contain text only
public_folder: /uploads
commit_messages:
  create: 'content: {{slug}}'
  update: 'content: עדכון {{collection}}'
  delete: 'content: מחיקת {{slug}}'
collections:
  - label: "תוכן האתר"
    name: site
    files:
${file('he', 'עברית')}
${file('en', 'English')}
`
mkdirSync('public/admin', { recursive: true })
writeFileSync('public/admin/config.yml', yml)
console.log('ok', yml.length)
