import 'cropperjs/dist/cropper.min.css';
import Cropper from 'cropperjs';
import { useEffect, useState, useRef } from 'react';
import * as styles from './image-cropper.styles';
export interface ImageCropperProps {
  imageSrc: string;
  onImageCropped: (croppedImgSrc: string) => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  imageSrc,
  onImageCropped,
}) => {
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const cropper = new Cropper(imageRef.current, {
        zoomable: true,
        scalable: true,
        zoomOnTouch: true,
        zoomOnWheel: true,
        cropBoxResizable: false,
        responsive: true,
        aspectRatio: 1,
        initialAspectRatio: 1,
        viewMode: 2,
        crop: () => {
          const canvas = cropper.getCroppedCanvas();
          setPreviewSrc(canvas.toDataURL('image/png'));
        },
      });
    }
  }, [imageSrc]);
  return (
    <div className={styles.wrapper}>
      <img ref={imageRef} src={imageSrc} />
      <div className={styles.previewWrapper}>
        <img src={previewSrc} className={styles.previewImg} />
      </div>
    </div>
  );
};

export default ImageCropper;
