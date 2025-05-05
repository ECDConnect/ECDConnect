export const imageResize = async (
  image: string,
  width: number | null,
  height: number | null,
  imageType: string | null
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      var resizeWidth = width ? width : (img.width / img.height) * height!;
      var resizeHeight = height ? height : (img.height / img.width) * width!;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Unable to get canvas context'));
        return;
      }
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      ctx.drawImage(img, 0, 0, resizeWidth, resizeHeight);
      const resizedImage = canvas.toDataURL(imageType ?? 'image/jpeg', 1);
      resolve(resizedImage);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};
