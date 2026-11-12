import { CardBorderRaduis, CardShadowSize } from './models/CardTypes';

/**
 * Matches a base background utility (`bg-uiBg`), but not a variant-scoped one
 * (`hover:bg-uiBg`), which does not set the resting background.
 */
const HAS_BACKGROUND = /(^|\s)bg-/;

export const cardSuppliesBackground = (className?: string) =>
  !HAS_BACKGROUND.test(className ?? '');

/**
 * `bg-white` is omitted when the caller supplies its own background.
 *
 * Under Tailwind v2 the caller always won this pair: colours were emitted in
 * theme-key order, so every colour from theme.extend.colors came after the
 * default `white`. v3 emits colours alphabetically, which puts `bg-white` after
 * almost every custom colour and made all 68 overriding call sites render white.
 * Emitting only one background keeps the outcome independent of ordering.
 */
export const getCardStyles = (
  borderRadius: CardBorderRaduis,
  shadowSize: CardShadowSize,
  withDefaultBackground = true
) =>
  `rounded-${borderRadius} shadow-${shadowSize}${
    withDefaultBackground ? ' bg-white' : ''
  }`;
