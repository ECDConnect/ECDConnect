import { getCompressedImage } from '@ecdlink/core';
import { UploadIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { classNames } from '../../pages/users/components/users';

export interface FileModel {
  fileName: string;
  file: string;
}

export interface FormFileInputProps {
  label: string;
  nameProp: string;
  contentUrl?: string;
  acceptedFormats: string[];
  disabled?: boolean;
  returnFullUrl?: boolean;
  isImage?: boolean;
  byPassCompression?: boolean;
  setValue: UseFormSetValue<any>;
}

const containerBaseStyle =
  'relative flex flex-col justify-center items-center block w-full border-2 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 hover:border-uiLight';

const containerStyle = 'border-uiLight';
const fileContainerStyle = 'border-successMain';
const errorContainerStyle = 'border-errorMain';

const iconBaseStyle = 'mx-auto h-12 w-12';
const iconStyle = 'text-gray-400';
const fileIconStyle = 'text-successMain';
const errorIconStyle = 'text-errorMain';

const FormFileInput: React.FC<FormFileInputProps> = ({
  label,
  nameProp,
  acceptedFormats,
  contentUrl,
  disabled = false,
  returnFullUrl = false,
  isImage = true,
  byPassCompression = false,
  setValue,
}) => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [file, setFile] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: any) => {
    if (event && event.target && event.target.files) {
      const firstFile = event.target.files[0];
      handleFile(firstFile);
      setFileName(firstFile?.name);
    } else {
      setFileName(undefined);
    }
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (event && event.dataTransfer && event.dataTransfer.files) {
      const firstFile = event.dataTransfer.files[0];
      handleFile(firstFile);
      setFileName(firstFile?.name);
    } else {
      setFileName(undefined);
    }
  };

  const handleFile = async (file: any) => {
    const compressedFile =
      isImage && !byPassCompression ? await getCompressedImage(file) : file;

    const fileExtension = file?.name ? file?.name?.split('.').pop() : undefined;
    if (fileExtension) {
      if (acceptedFormats.length > 0) {
        if (acceptedFormats.filter((x) => x === fileExtension).length > 0) {
          setError('');

          const reader = new FileReader();
          reader.readAsDataURL(compressedFile);
          reader.onload = (onload: any) => {
            const splitString = returnFullUrl
              ? reader.result?.toString()
              : reader.result?.toString().split('base64,')[1];
            setValue(
              nameProp,
              returnFullUrl
                ? splitString
                : {
                    file: splitString,
                    fileName: file?.name,
                  }
            );
            setFile(reader.result?.toString() ?? '');
          };
        } else {
          setError('Invalid File type');
        }
      } else {
        setError('');

        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = (onload: any) => {
          const splitString = returnFullUrl
            ? reader.result?.toString()
            : reader.result?.toString().split('base64,')[1];
          setValue(
            nameProp,
            returnFullUrl
              ? splitString
              : {
                  file: splitString,
                  fileName: file?.name,
                }
          );
          setFile(reader.result?.toString() ?? '');
        };
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

  const getContainerStyle = () => {
    if (error) {
      return errorContainerStyle;
    }
    return fileName ? fileContainerStyle : containerStyle;
  };

  const getIconStyle = () => {
    if (error) {
      return errorIconStyle;
    }
    return fileName ? fileIconStyle : iconStyle;
  };

  const handleClick = () => {
    document?.getElementById(nameProp)?.click();
  };

  return (
    <>
      <label
        htmlFor={nameProp}
        className="block text-sm font-medium text-gray-700 pb-1"
      >
        {label}
        {acceptedFormats && (
          <span className="font-bold">: {acceptedFormats?.join(', ')}</span>
        )}
      </label>
      <label
        className={
          contentUrl && !fileName
            ? ''
            : classNames(getContainerStyle(), containerBaseStyle)
        }
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
        {contentUrl && !fileName ? (
          <div className="relative bg-uiBg">
            <div className="absolute inset-0 z-10 bg-white text-center flex flex-col items-center justify-center opacity-0 hover:opacity-40 bg-opacity-40 duration-300">
              <UploadIcon className={classNames(iconBaseStyle, 'text-black')} />
            </div>
            <div className="relative">
              <div className="h-32 flex flex-wrap content-center">
                <img
                  src={contentUrl}
                  className="mx-auto max-h-24 min-h-full rounded-md"
                  alt=""
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-full bg-center bg-contain bg-no-repeat p-5 flex flex-col flex-1 justify-center items-center"
            style={
              file
                ? {
                    backgroundImage: `url(${file})`,
                  }
                : {}
            }
          >
            {/* file */}
            <UploadIcon className={classNames(getIconStyle(), iconBaseStyle)} />
            {/* <span className={labelStyle}>{getLabel()}</span> */}
          </div>
        )}
      </label>

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
    </>
  );
};

export default FormFileInput;
