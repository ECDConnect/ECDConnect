import { LocalStorageKeys } from '@ecdlink/core';
import { setStorageItem } from '@utils/common/local-storage.utils';

export const convertImageToBase64 = (imgUrl: any, callback: any) => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.height = image.naturalHeight;
    canvas.width = image.naturalWidth;
    ctx?.drawImage(image, 0, 0);
    const dataUrl = canvas.toDataURL();
    setStorageItem(dataUrl, LocalStorageKeys.offlineStatments);
  };
  image.src = imgUrl;
};
