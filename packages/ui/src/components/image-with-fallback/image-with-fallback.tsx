import { useEffect, useState } from 'react';

export const ImageWithFallback: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement>
> = (props) => {
  const FALLBACK_IMAGE =
    'data:image/png;base64,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';
  const [imageSrc, setImageSrc] = useState<string>();

  /**
   * Test if the url is accessible to the user
   *
   * @param {*} URL
   */
  const testImageUrl = (URL) => {
    const tester = new Image();
    tester.onload = () => setImageSrc(URL);
    tester.onerror = () => setImageSrc(FALLBACK_IMAGE);
    tester.src = URL;
  };

  useEffect(() => {
    testImageUrl(props.src);
  }, []);

  return imageSrc ? (
    <img
      {...props}
      src={imageSrc}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
    />
  ) : null;
};

export default ImageWithFallback;
