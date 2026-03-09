export function pluralize(word: string) {
  const vowels = 'aeiou';

  if (word.length >= 2 && vowels.includes(word[word.length - 2])) {
    return word + 's';
  }

  if (
    word.endsWith('s') ||
    word.endsWith('sh') ||
    word.endsWith('ch') ||
    word.endsWith('x') ||
    word.endsWith('z')
  ) {
    return word + 'es';
  }

  if (word.endsWith('y')) {
    return word.slice(0, -1) + 'ies';
  }

  return word + 's';
}
