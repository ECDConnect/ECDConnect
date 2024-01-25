import { getBase64TypeFromBaseString, getCompressedImage } from '@ecdlink/core';
import {
  DesktopComputerIcon,
  PhotographIcon,
  UploadIcon,
} from '@heroicons/react/solid';
import { useEffect, useLayoutEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { classNames } from '../../pages/users/components/users';
import { Alert, LoadingSpinner } from '@ecdlink/ui';
import { videoExtensions } from '../../utils/constants';

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
  isSubcategoryInput?: boolean;
  allowedFileSize?: number;
}

const containerBaseStyle =
  ' relative flex flex-col justify-center items-center block w-full border-2 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 hover:border-uiLight';

const containerStyle = 'border-uiLight';
const fileContainerStyle = 'border-successMain';
const errorContainerStyle = 'border-errorMain';

const iconBaseStyle = 'mx-auto h-12 w-12';
const iconStyle = 'text-tertiary';
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
  isSubcategoryInput,
  allowedFileSize,
}) => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [file, setFile] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [uploadTypes, setUploadedTypes] = useState('');
  const accepetedFormatsWithoutLastItem = acceptedFormats?.slice(0, -1);
  const accepetedFormatsFormatted = accepetedFormatsWithoutLastItem?.map(
    (item) => {
      return item + ' ';
    }
  );
  const lastAcceptedFormat = acceptedFormats[acceptedFormats?.length - 1];

  const isPdfExtension = acceptedFormats.some((format) =>
    format.toLowerCase().includes('pdf')
  );

  useEffect(() => {
    if (acceptedFormats.length > 0 && uploadTypes === '') {
      let extenstions = '';
      acceptedFormats.forEach(function (extension) {
        extenstions += '.' + extension + ', ';
      });
      setUploadedTypes(extenstions);
    }

    if (contentUrl && contentUrl !== '') {
      setFileName(contentUrl);
    }
  }, [acceptedFormats, contentUrl, uploadTypes]);

  const handleChange = (event: any) => {
    if (event && event.target && event.target.files) {
      const firstFile = event.target.files[0];
      if (!firstFile) return;

      setLoading(true);
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
      if (!firstFile) return;

      setLoading(true);

      handleFile(firstFile);
      setFileName(firstFile?.name);
    } else {
      setFileName(undefined);
    }
  };

  const handleFile = async (file: any) => {
    // setFile('');

    const fileExtension = file?.name ? file?.name?.split('.').pop() : undefined;
    const isVideoExtension = videoExtensions.includes(fileExtension);
    console.log({ fileExtension });
    setIsVideo(isVideoExtension);

    const compressedFile =
      isImage &&
      !isPdfExtension &&
      !isVideoExtension &&
      !byPassCompression &&
      acceptedFormats.filter((x) => x === fileExtension).length > 0
        ? await getCompressedImage(file)
        : file;

    if (fileExtension) {
      if (acceptedFormats.length > 0) {
        if (
          acceptedFormats.filter((x) => x === fileExtension).length > 0 &&
          compressedFile?.size < allowedFileSize
        ) {
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
            setLoading(false);
          };
        } else {
          if (acceptedFormats.filter((x) => x === fileExtension).length === 0) {
            setError('Invalid File type');
            setLoading(false);
            return;
          }
          if (compressedFile?.size > allowedFileSize) {
            const mbSize = Math.round(allowedFileSize / 1024 / 1024);
            setError(
              'The file is too big, upload a file no more than ' + mbSize + 'MB'
            );
            setLoading(false);
            return;
          }
          setError('Invalid File type');
          setLoading(false);
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
          setLoading(false);
        };
      }
    } else {
      setError('Invalid File type');
      setLoading(false);
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

  useLayoutEffect(() => {
    if (contentUrl) {
      const type = getBase64TypeFromBaseString(contentUrl);
      setIsVideo(videoExtensions.includes(type));
    }
  }, [contentUrl]);

  return (
    <>
      {isSubcategoryInput ? (
        <>
          <label htmlFor={nameProp} className="font-h4 block pb-1 font-bold">
            {label}
          </label>
          <label
            htmlFor={nameProp}
            className="font-md block pb-1 text-sm text-gray-900"
          >
            Size limit:{' '}
            <span className="text-errorMain font-semibold">1MB</span>. To
            improve the image position & size, edit the image to fit 32px by
            32px before uploading.
          </label>
        </>
      ) : (
        <label
          htmlFor={nameProp}
          className="font-lg block pb-1 text-sm text-gray-900"
        >
          {label}
          {acceptedFormats && (
            <span className="font-normal">: {acceptedFormats?.join(', ')}</span>
          )}
        </label>
      )}

      {isPdfExtension && acceptedFormats?.length === 1 && (
        <p className="text-textMid mb-2 text-sm">
          Size limit: <span className="text-errorMain font-semibold">5</span>{' '}
          MB. Convert the file(s) to a single pdf before uploading.
        </p>
      )}
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
          <div className="bg-adminPortalBg relative">
            <div className="bg-adminPortalBg absolute inset-0 z-10 flex flex-col items-center justify-center bg-opacity-40 text-center opacity-0 duration-300 hover:opacity-40">
              <UploadIcon className={classNames(iconBaseStyle, 'text-black')} />
            </div>
            <div className="relative">
              {isVideo ? (
                <div className="relative flex h-44 w-full items-center	justify-center overflow-hidden rounded-lg">
                  <video
                    src={contentUrl}
                    controls={false}
                    className="absolute"
                  />
                  <div className="h-justify-end flex h-44 w-full items-end bg-gray-100" />
                </div>
              ) : (
                <div className="flex h-32 flex-wrap content-center">
                  <img
                    src={contentUrl}
                    className="mx-auto max-h-24 min-h-full rounded-md"
                    alt=""
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div
            className="bg-adminPortalBg flex h-40 w-full flex-1 flex-col items-center justify-center bg-contain bg-center bg-no-repeat p-5"
            style={
              file
                ? {
                    height: 200,
                    backgroundImage: `url(${file})`,
                  }
                : {}
            }
          >
            {/* file */}
            {file && isVideo && (
              <div className="relative flex h-44 w-full items-center	justify-center overflow-hidden rounded-lg">
                <video src={file} controls={false} className="absolute" />
                <div className="h-justify-end flex h-44 w-full items-end bg-gray-100" />
              </div>
            )}
            {isLoading && !file ? (
              <LoadingSpinner
                size="big"
                spinnerColor="white"
                backgroundColor="uiMid"
              />
            ) : (
              <div>
                <PhotographIcon
                  className={classNames(getIconStyle(), iconBaseStyle, '')}
                />
                <div className="bg-secondary hover:bg-uiMid focus:outline-none my-4 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2">
                  <DesktopComputerIcon className="mr-4 h-5 w-5">
                    {' '}
                  </DesktopComputerIcon>
                  Browse my computer
                </div>
                <p className="text-md py-2 text-gray-700">or drag file here</p>
              </div>
            )}
            {/* <span className={labelStyle}>{getLabel()}</span> */}
          </div>
        )}
      </label>
      {error ? (
        <p className="text-errorMain pb-4">{`${
          error.toLowerCase().includes('too big')
            ? error
            : `${error}. You can only upload ${accepetedFormatsFormatted.join(
                ', '
              )} ${lastAcceptedFormat} files`
        }`}</p>
      ) : (
        fileName && <p className="pb-4">{fileName}</p>
      )}

      {contentUrl && !fileName && !isSubcategoryInput && (
        <Alert
          className="mt-5 mb-3"
          message="Wrong file type. Please try again."
          type="error"
        />
      )}

      <input
        accept={uploadTypes}
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
