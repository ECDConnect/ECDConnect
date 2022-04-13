import { CameraResultType, Camera, CameraSource } from '@capacitor/camera';

const getImageSourceFromCamera = async (): Promise<string | undefined> => {
  try {
    const imageSrc = await Camera.getPhoto({
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    return imageSrc.dataUrl;
  } catch (error) {
    return undefined;
  }
};

const getImageSourceFromFileSystem = async (): Promise<string | undefined> => {
  try {
    const imageSrc = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    });

    return imageSrc.dataUrl;
  } catch (error) {
    return undefined;
  }
};

export { getImageSourceFromCamera, getImageSourceFromFileSystem };
