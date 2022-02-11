import Compressor from 'compressorjs';

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
