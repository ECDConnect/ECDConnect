import { CardBorderRaduis, CardShadowSize } from './models/CardTypes';

export const getCardStyles = (
  borderRadius: CardBorderRaduis,
  shadowSize: CardShadowSize
) => `rounded-${borderRadius} shadow-${shadowSize} bg-white`;
