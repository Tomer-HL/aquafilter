# AquaFilter — Water Filtration Store

A bilingual (Hebrew RTL / English LTR) e-commerce homepage inspired by filtershop.co.il,
built with React + Vite.

## Run locally
```bash
npm install
npm run dev
```
Then open the URL Vite prints (usually http://localhost:5173).

## Build for production
```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build
```

## What's inside
- **Language toggle** (top-right globe): switches Hebrew↔English and flips the whole
  layout between RTL and LTR automatically.
- **Sections:** announcement bar, sticky header + mobile drawer, hero with product card,
  4 product tiers, "why us" features, category grid, featured products with prices,
  a "which system fits me?" CTA, about, manufacturer logos, footer with newsletter.
- **Design system:** water-blue palette, Rubik + Heebo type (both cover Hebrew & Latin),
  Lucide icons, accessible focus states, reduced-motion support, fully responsive.

## Editing content
All copy for both languages lives in `src/i18n.js`. Swap product names, prices,
categories, and contact details there — no component changes needed.
