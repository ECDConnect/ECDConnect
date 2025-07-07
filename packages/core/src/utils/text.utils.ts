export const camelCaseToSentanceCase = (text: string): string => {
  if (!text) {
    return '';
  }

  const result = text?.replace(/([A-Z])/g, ' $1');
  let finalResult = result?.charAt(0)?.toUpperCase() + result?.slice(1);

  if (finalResult?.charAt(0) === ' ') {
    finalResult = finalResult?.substring(1);
  }

  return finalResult;
};

export const capitalizeWords = (text: string): string => {
  return text.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};

export const capitalizeFirstLetter = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const getBase64FromBaseString = (dataFile: string): string => {
  return dataFile ? dataFile.split('base64,')[1] : '';
};

export const getBase64TypeFromBaseString = (file: string) =>
  file ? file?.split(';')[0]?.split('/')[1] : '';

export const camelize = (text: string) => {
  return text
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const ellipsisDescription = (text: string, limit: number): string => {
  text = text ?? '';
  const returnText = text.length > limit ? text.slice(0, limit) + '...' : text;
  return returnText;
};

export const replaceBraces = (sentenceWithBraces: string, value: string) => {
  return sentenceWithBraces.replace(/\{(\w+)\}/g, () => {
    return value;
  });
};

export const toCamelCase = (str: string) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/[:\s]+/g, '')
    .replace(/[,\s]+/g, '')
    .replace(/[&\s]+/g, 'And');
};

export const getStringFromClassNameOrId = (data: string | HTMLElement) =>
  data.toString().split(/#|\./)[1];

export const parseBool = (str: string) => {
  return /^(true|1)$/i.test(str);
};

export function formatStringWithFirstLetterCapitalized(input: string): string {
  const words = input.split('-');

  if (words.length > 0 && words[0].length > 0) {
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  }

  const formattedString = words.join(' ');

  return formattedString;
}

export function formatTextToSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

export function addPhoneNumberMask(phoneNumber: string): string {
  const part1 = phoneNumber?.slice(0, 3);
  const part2 = phoneNumber?.slice(3, 6);
  const part3 = phoneNumber?.slice(6);

  return `${part1} ${part2} ${part3}`;
}

export function generateUniqueCode(length: number) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueCode = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueCode += characters[randomIndex];
  }
  return uniqueCode;
}
