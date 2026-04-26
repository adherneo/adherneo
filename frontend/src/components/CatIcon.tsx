import type { Category } from '../types'

const ICONS: Record<string, string> = {
  rodilleras: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3L12 13"/><circle cx="13.5" cy="16" r="4"/><path d="M15 20L17 30"/><line x1="7" y1="13" x2="20" y2="13"/><line x1="8.5" y1="20" x2="21.5" y2="20"/></svg>`,
  tobilleras: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 3L12 17Q11 22 8 25H24Q21 22 19 17L18 3Z"/><line x1="8" y1="21" x2="24" y2="21"/></svg>`,
  munequeras: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="18" width="18" height="8" rx="3"/><line x1="11" y1="18" x2="10" y2="10"/><line x1="15" y1="18" x2="14.5" y2="8"/><line x1="18" y1="18" x2="18" y2="9"/><line x1="21" y1="18" x2="22" y2="11"/></svg>`,
  coderas:    `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4L16 14L24 22"/><circle cx="16" cy="15" r="4"/><line x1="9" y1="12" x2="22" y2="12"/><line x1="12" y1="19" x2="25" y2="19"/></svg>`,
  fajas:      `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="26" height="12" rx="6"/><line x1="3" y1="16" x2="29" y2="16"/><line x1="22" y1="10" x2="24" y2="22"/></svg>`,
  inmovilizadores: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="11" y="2" width="10" height="28" rx="3"/><line x1="11" y1="9" x2="21" y2="9"/><line x1="11" y1="15" x2="21" y2="15"/><line x1="11" y1="21" x2="21" y2="21"/></svg>`,
  correctores: `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5C9 5 5 9 5 14L5 25H9L9 14C9 11 12 9 16 9C20 9 23 11 23 14L23 25H27L27 14C27 9 23 5 16 5Z"/><line x1="5" y1="20" x2="27" y2="20"/></svg>`,
  otros:      `<svg viewBox="0 0 32 32" fill="currentColor"><rect x="13" y="4" width="6" height="24" rx="2"/><rect x="4" y="13" width="24" height="6" rx="2"/></svg>`,
}

interface CatIconProps {
  cat: Category | string
  size?: number
  className?: string
}

export default function CatIcon({ cat, size = 28, className = '' }: CatIconProps) {
  const svg = ICONS[cat] || ICONS.otros
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export { ICONS as CAT_ICON_STRINGS }
