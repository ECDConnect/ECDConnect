import { Colours, ComponentBaseProps } from '../../../models';
import { getImageSourceFromCamera, renderIcon } from '../../../utils';
import { useEffect, useState } from 'react';
import { Path, UseFormRegister, FieldValues } from 'react-hook-form';
import { classNames } from '../../../utils/style-class.utils';
import Typography from '../../typography/typography';
import * as styles from './image-input.styles';

export interface ImageInputProps<T extends FieldValues>
  extends ComponentBaseProps {
  nameProp: Path<T>;
  label: string;
  subLabel?: string;
  icon?: string;
  iconContainerColor?: Colours;
  iconColour?: Colours;
  acceptedFormats: string[];
  resolutionLimit?: number;
  disabled?: boolean;
  onValueChange?: (imageString: string) => void;
  register?: UseFormRegister<T>;
  currentImageString?: string;
  overrideOnClick?: () => void;
}

export const ImageInput = <T extends FieldValues>({
  label,
  subLabel,
  nameProp,
  acceptedFormats,
  disabled = false,
  register,
  icon = 'UploadIcon',
  iconContainerColor = 'secondary',
  iconColour,
  className,
  currentImageString,
  resolutionLimit,
  onValueChange,
  overrideOnClick,
}: ImageInputProps<T>) => {
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const test = register?.(nameProp);
  const [currentImage, setCurrentImage] = useState<string>('');
  const handleChange = (event: any) => {
    if (event && event.target && event.target.files) {
      const firstFile = event.target.files[0];
      handleFile(firstFile);
      setFileName(firstFile?.name);
    } else {
      setFileName('');
    }
  };

  useEffect(() => {
    if (currentImageString) {
      setCurrentImage(currentImageString);
    } else {
      setCurrentImage('');
    }
  }, [currentImageString]);

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (event && event.dataTransfer && event.dataTransfer.files) {
      const firstFile = event.dataTransfer.files[0];
      handleFile(firstFile);
      setFileName(firstFile?.name);
    } else {
      setFileName('');
    }
  };

  const handleFile = (file: any) => {
    const fileExtension = file?.name ? file?.name?.split('.').pop() : undefined;
    if (fileExtension) {
      if (acceptedFormats.length > 0) {
        if (acceptedFormats.filter((x) => x === fileExtension).length > 0) {
          setError('');
        } else {
          setError('Invalid File type');
        }
      } else {
        setError('');
      }
    } else {
      setError('Invalid File type');
    }
  };

  const handleDragOver = (event: any) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  const getButtonLabel = () => {
    if (error) {
      return error;
    }
    return currentImage ? 'Tap to change' : 'Tap to add';
  };

  const getContainerStyle = () => {
    if (error) {
      return styles.errorContainerStyle;
    }

    return fileName
      ? styles.fileContainerStyle
      : classNames(styles.containerStyle, `bg-white`);
  };

  const getIconStyle = () => {
    if (error) {
      return styles.errorIconStyle;
    }
    return fileName ? styles.fileIconStyle : iconColour ?? styles.iconStyle;
  };

  const handleClick = async () => {
    if (overrideOnClick) {
      overrideOnClick();
    } else {
      const res = await getImageSourceFromCamera(undefined, resolutionLimit)
        .then((imageString: string | undefined) => {
          setCurrentImage(imageString ?? '');
          if (onValueChange) {
            onValueChange(imageString ?? '');
          }
        })
        .catch((error: unknown) => console.error(error));
    }
  };

  return (
    <div className={className}>
      <div>
        <Typography
          className={styles.labelStyle}
          weight="bold"
          type={'body'}
          color={'textDark'}
          text={label}
        ></Typography>
      </div>
      <div>
        <Typography
          className={styles.labelStyle}
          type={'body'}
          color={'textMid'}
          text={subLabel}
        ></Typography>
      </div>
      <div
        className={classNames(getContainerStyle(), styles.containerBaseStyle)}
        onClick={() => {
          handleClick();
        }}
        onDrop={(e) => {
          handleDrop(e);
        }}
        onDragOver={(e) => {
          handleDragOver(e);
        }}
      >
        <div
          className={styles.imageContainer}
          style={{
            backgroundImage: `url(${currentImage})`,
          }}
        >
          <div
            className={classNames(
              styles.iconBaseStyle,
              `bg-${iconContainerColor}`
            )}
          >
            {renderIcon(
              icon,
              classNames(getIconStyle(), `bg-${iconContainerColor}`)
            )}
          </div>
          <Typography
            className={`${
              currentImage.length > 0
                ? styles.buttonlabelStyle + ` rounded bg-white`
                : styles.buttonlabelStyle
            }`}
            weight="bold"
            type={'help'}
            color={'textMid'}
            text={getButtonLabel()}
          ></Typography>
        </div>
      </div>
      <input
        accept={acceptedFormats.toString()}
        id={nameProp}
        disabled={disabled}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          handleChange(e);
        }}
      />
    </div>
  );
};

export default ImageInput;
