import { CameraResultType, Camera, CameraSource } from '@capacitor/camera';
import { imageResize } from './image-resize-handler.util';

const getImageSourceFromCamera = async (
  acceptableMimeFormats?: string[],
  resolutionLimit: number = 100
): Promise<string | undefined> => {
  try {
    const imageSrc = await Camera.getPhoto({
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    if (
      !!acceptableMimeFormats &&
      acceptableMimeFormats.length > 0 &&
      !!imageSrc &&
      !!imageSrc.dataUrl
    ) {
      const imageFormat = acceptableMimeFormats.find((f) =>
        imageSrc.dataUrl?.startsWith(`data:${f}`)
      );
      if (!imageFormat) return undefined;
    }
    var resizedImage = await imageResize(
      imageSrc.dataUrl!,
      resolutionLimit,
      null,
      null
    );
    return resizedImage!;
  } catch (error) {
    return undefined;
  }
};

const getImageSourceFromFileSystem = async (
  acceptableMimeFormats?: string[],
  resolutionLimit: number = 100
): Promise<string | undefined> => {
  try {
    const imageSrc = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });
    if (
      !!acceptableMimeFormats &&
      acceptableMimeFormats.length > 0 &&
      !!imageSrc &&
      !!imageSrc.dataUrl
    ) {
      const imageFormat = acceptableMimeFormats.find((f) =>
        imageSrc.dataUrl?.startsWith(`data:${f}`)
      );
      if (!imageFormat) return undefined;
    }
    var resizedImage = await imageResize(
      imageSrc.dataUrl!,
      resolutionLimit,
      null,
      null
    );
    return resizedImage!;
  } catch (error) {
    return undefined;
  }
};

export { getImageSourceFromCamera, getImageSourceFromFileSystem, imageResize };
