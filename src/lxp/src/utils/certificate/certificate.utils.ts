export const urlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const formatCertificateDate = (dateValue?: string) => {
  const baseDate = new Date(dateValue || new Date());

  return {
    long: baseDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
    short: baseDate
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      .replace(/\//g, '-'),
  };
};

export const sanitizeCertificateFileName = (value: string) =>
  value.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_|_$/g, '');

export const generateCertificateId = (type: 'HSC' | 'T', existingId?: string) =>
  existingId ||
  `ECDC-${type}-${new Date().getFullYear()}-${
    Math.floor(Math.random() * 90000) + 10000
  }`;

export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [0, 0, 0];
};

export const lightenRgb = (
  rgb: [number, number, number],
  factor = 0.65
): [number, number, number] =>
  rgb.map((channel) => Math.round(channel + (255 - channel) * factor)) as [
    number,
    number,
    number
  ];
