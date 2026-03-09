type ClassNameTypes = string | undefined;

export const classNames = (...classNames: ClassNameTypes[]): string => {
  if (!classNames || classNames.length === 0) return '';
  return classNames.join(' ');
};

export const ellipsisDescription = (text: string, limit: number): string => {
  text = text ?? '';
  const returnText = text.length > limit ? text.slice(0, limit) + '...' : text;
  return returnText;
};
