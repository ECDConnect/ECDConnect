import Compressor from 'compressorjs';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// DEFAULT 80 % COMPRESSION, 60% CAN ALSO BE USED, BUT NOT RECOMMENDED
export const getCompressedImage = async (
  image: File | Blob,
  compressionAmount = 0.8
): Promise<File | Blob> => {
  return new Promise((resolve) => {
    new Compressor(image, {
      minHeight: 0,
      minWidth: 0,
      maxHeight: 400,
      maxWidth: Infinity,
      mimeType: 'auto',
      checkOrientation: true,
      quality: compressionAmount,
      convertSize: 500000,
      success: (compressedResult: any) => {
        resolve(compressedResult);
      },
    });
  });
};

export const captureAndDownloadComponent = async (
  element: HTMLElement,
  fileName?: string
) => {
  try {
    const canvas = await html2canvas(element);
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `${fileName ?? 'image'}.png`);
      }
    });
  } catch (error) {
    console.error('Failed to capture component:', error);
  }
};
