/**
 * Shared Tailwind safelist for the lxp and admin-portal apps.
 *
 * Components across packages/ui and both apps build class names at runtime, e.g.
 *
 *   `bg-${colour}`                    packages/ui/src/components/badge/badge.tsx
 *   `leading-${lineHeight}`           packages/ui/src/components/typography/typography.tsx
 *   `rounded-${borderRadius}`         packages/ui/src/components/card/card.styles.ts
 *
 * Tailwind's content scanner only ever sees the literal `bg-${` fragment, so it
 * cannot generate those utilities. Every value each expression can take has to
 * be safelisted instead.
 *
 * The lists below mirror the TypeScript unions that feed each expression — the
 * source of truth is named above each one. Keep them in sync when those unions
 * change, otherwise the class silently goes missing from the built stylesheet.
 *
 * Prefer narrowing these over widening them: a broad pattern such as /^bg-/
 * enumerates the entire colour palette at every opacity and bloats the output.
 *
 * Colour utilities are the expensive ones, so those stay enumerated. The
 * layout/sizing families below are kept broad on purpose — see LAYOUT_FAMILIES.
 */

// Utilities that take a theme colour. Longest prefixes first so that
// `border-t-primary` isn't partially consumed by the `border` alternative.
const COLOUR_UTILITIES = [
  'border-t',
  'border-r',
  'border-b',
  'border-l',
  'border',
  'bg',
  'text',
];

// Colours that are always available regardless of the app's theme.
const BASE_COLOURS = ['white', 'black', 'transparent', 'current'];

// packages/ui/src/components/typography/models/TypographyTypes.ts — TypographyLineHeight
const LINE_HEIGHTS = [
  'none',
  'tight',
  'snug',
  'normal',
  'relaxed',
  'loose',
  '3',
  '4',
  '5',
  '6',
  '1.56',
];

// packages/ui/src/components/typography/models/TypographyTypes.ts — TypographyFontSizes,
// plus the named scale used by free-string props such as CheckboxGroup's `titleSize`.
const FONT_SIZES = [
  '12',
  '14',
  '16',
  '18',
  '24',
  '48',
  '72',
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
];

// TypographyAlign, plus ActionModal's `alignment` and Tab's start/center split.
// Shared by `text-${align}` and `items-${alignment}`.
const ALIGNMENTS = ['left', 'center', 'right', 'start', 'end'];

// CheckboxGroup's `titleWeight` is a free string; callers pass 'normal' and 'bold'.
const FONT_WEIGHTS = [
  'thin',
  'extralight',
  'light',
  'normal',
  'medium',
  'semibold',
  'bold',
  'extrabold',
  'black',
];

// packages/ui/src/components/card/models/CardTypes.ts — CardBorderRaduis, plus the
// custom borderRadius keys defined in the lxp theme.
const BORDER_RADII = [
  'none',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  'full',
  '10',
  '15',
];

// packages/ui/src/components/card/models/CardTypes.ts — CardShadowSize
const SHADOWS = ['none', 'sm', 'md', 'lg', 'xl', '2xl'];

// packages/ui/src/components/divider/models/Divider.ts — DividerType, used as
// `border-${dividerType}` in programme-base-list-item.styles.ts.
const BORDER_STYLES = ['solid', 'dashed', 'dotted', 'double', 'none'];

// packages/ui/src/components/round-icon/round-icon.types.ts — SizeType,
// user-avatar.styles.ts getIconSize(), and IconWrapper's numeric `iconSize`.
const ICON_SIZES = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '14',
  '16',
  '20',
  '24',
  '28',
  '32',
  '36',
  '40',
  '48',
];

// search-dropdown.styles.ts `top-${overlayTopOffset || '177'}` — callers pass '120'.
const TOP_OFFSETS = ['120', '177'];

// typography.tsx `mt-${ix !== 0 ? '3' : '0'}`
const MARGIN_TOPS = ['0', '3'];

/**
 * Layout and sizing families, kept deliberately broad.
 *
 * The v2 config blanket-safelisted these (/^w-/, /^min-/, /^max-/, /^px-/,
 * /^mx-/, /^gap-/, /^inset-/, /^right-/, /^top-/, /^z-/ ...), so they are kept
 * broad here to preserve that coverage.
 *
 * This is precautionary, not a fix for any known bug: no sizing utility is
 * composed at runtime today (every `prefix-${value}` site is enumerated above),
 * so the content scanner should find them all. It guards against a future
 * `max-w-${size}` being added without anyone remembering this file.
 *
 * Unlike colours, these are affordable: ~800 selectors and ~32KB minified
 * (lxp 86KB -> 118KB), against a 1.9MB v2 baseline. Drop it if the size ever
 * matters more than the insurance.
 */
const LAYOUT_FAMILIES = [
  'w',
  'h',
  'min-w',
  'max-w',
  'px',
  'pl',
  'pr',
  'mx',
  'mb',
  'gap',
  'inset',
  'right',
  'top',
  'z',
];

const escape = (value) => String(value).replace(/[.\\+*?[^\]$(){}=!<>|:]/g, '\\$&');

const oneOf = (values) => values.map(escape).join('|');

const pattern = (prefixes, values) => ({
  pattern: new RegExp(`^(?:${oneOf(prefixes)})-(?:${oneOf(values)})$`),
});

/**
 * Flatten a Tailwind colour object into the suffixes that actually form class
 * names: `{ primary: '…', blue: { accent3: '…' } }` -> ['primary', 'blue-accent3'].
 * A nested group has no class of its own, so emitting the bare group name
 * (`bg-blue`) would safelist a utility Tailwind can never generate.
 */
const flattenColours = (colours, prefix = '') =>
  Object.entries(colours).flatMap(([name, value]) => {
    const key = prefix ? `${prefix}-${name}` : name;
    if (value && typeof value === 'object') return flattenColours(value, key);
    return name === 'DEFAULT' ? [prefix].filter(Boolean) : [key];
  });

/**
 * Build the safelist for an app.
 *
 * @param {object} colours The app's `theme.extend.colors` object.
 * @returns {Array<{pattern: RegExp}>} Tailwind v3 safelist entries.
 */
module.exports = function buildSafelist(colours) {
  const colourNames = Array.isArray(colours)
    ? colours
    : flattenColours(colours);
  const allColours = [...new Set([...colourNames, ...BASE_COLOURS])];

  return [
    pattern(COLOUR_UTILITIES, allColours),
    pattern(['border'], BORDER_STYLES),
    pattern(['text'], [...ALIGNMENTS, ...FONT_SIZES]),
    pattern(['items'], ALIGNMENTS),
    pattern(['leading'], LINE_HEIGHTS),
    pattern(['font'], FONT_WEIGHTS),
    pattern(['rounded'], BORDER_RADII),
    pattern(['shadow'], SHADOWS),
    pattern(['w', 'h'], ICON_SIZES),
    pattern(['top'], TOP_OFFSETS),
    pattern(['mt'], MARGIN_TOPS),
    // Blanket coverage — cheap, and guards against runtime-composed sizing.
    ...LAYOUT_FAMILIES.map((family) => ({
      pattern: new RegExp(`^${escape(family)}-`),
    })),
  ];
};
