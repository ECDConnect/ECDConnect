type ClassNameTypes = string | undefined;

export const classNames = (...classNames: ClassNameTypes[]): string => {
  if (!classNames || classNames.length === 0) return '';
  return classNames.join(' ');
};
