// Bilingual content. `he` = Hebrew (RTL), `en` = English (LTR).
// Text edited by the client (via /admin, Decap CMS) lives in content/*.json and is deep-merged over the code defaults.
import { defaults } from './i18n.defaults.js'
import heText from '../content/he.json'
import enText from '../content/en.json'

const isObj = v => v && typeof v === 'object' && !Array.isArray(v)
function merge(base, over) {
  if (!isObj(base) || !isObj(over)) return over === undefined ? base : over
  const out = { ...base }
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k])
  return out
}

export const content = { he: merge(defaults.he, heText), en: merge(defaults.en, enText) }

export const brands = ['OMNIPURE', 'PENTAIR', 'AQUA-PURE', 'GE', 'KDF', 'SILIPHOS', 'NSF']
