export const camelCaseToSentanceCase = (text: string): string => {
  const result = text.replace(/([A-Z])/g, ' $1');
  let finalResult = result.charAt(0).toUpperCase() + result.slice(1);

  if (finalResult.charAt(0) === ' ') {
    finalResult = finalResult.substring(1);
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
