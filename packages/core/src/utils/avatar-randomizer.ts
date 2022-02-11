import { DefaultAvatarColors } from '../theme/theme-base';

export const getAvatarColor = (): string => {
  // get random index value
  const randomIndex = Math.floor(Math.random() * DefaultAvatarColors.length);
  // get random item
  const item = DefaultAvatarColors[randomIndex];
  return item;
};
