import {
  DefaultAvatarColors,
  DefaultAvatarColorsGG,
} from '../theme/theme-base';

export const getAvatarColor = (
  project: 'lxp' | 'growgreat' = 'lxp'
): string => {
  const defaultColors =
    project === 'growgreat' ? DefaultAvatarColorsGG : DefaultAvatarColors;
  // get random index value
  const randomIndex = Math.floor(Math.random() * defaultColors.length);
  // get random item
  const item = defaultColors[randomIndex];
  return item;
};
