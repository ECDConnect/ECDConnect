import { PasswordStrength } from './models/PasswordStrength';

export const errorTypeColour = 'errorMain';
export const weakTypeColour = 'alertMain';
export const goodTypeColour = 'successMain';
export const veryGoodTypeColour = 'successMain';
export const defaultTypeColour = 'uiLight';
export const bar = 'rounded mx-0.5 pl-4 border-t-4 pb-0 border-l-0 flex-1 ';
export const message = 'my-1 text-sm ';

export const getStrengthBarStyle = (type: PasswordStrength, index: number) => {
  let borderColour = bar + ' border-';
  switch (type) {
    case PasswordStrength.none:
      borderColour = borderColour + defaultTypeColour;
      break;
    case PasswordStrength.error:
      borderColour =
        borderColour + (index < 1 ? errorTypeColour : defaultTypeColour);
      break;
    case PasswordStrength.weak:
      borderColour =
        borderColour + (index < 2 ? weakTypeColour : defaultTypeColour);
      break;
    case PasswordStrength.good:
      borderColour =
        borderColour + (index < 3 ? goodTypeColour : defaultTypeColour);
      break;
    case PasswordStrength.veryGood:
      borderColour =
        borderColour + (index <= 4 ? veryGoodTypeColour : defaultTypeColour);
      break;
    default:
      borderColour = borderColour + defaultTypeColour;
      break;
  }

  return borderColour;
};

export const getStrengthBarMessageStyle = (type: PasswordStrength) => {
  switch (type) {
    case PasswordStrength.error:
      return 'text-' + errorTypeColour;
    case PasswordStrength.weak:
      return 'text-' + weakTypeColour;
    case PasswordStrength.good:
      return 'text-' + goodTypeColour;
    case PasswordStrength.veryGood:
      return 'text-' + veryGoodTypeColour;
    default:
      return 'text-' + defaultTypeColour;
  }
};
