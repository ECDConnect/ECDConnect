import { getBase64TypeFromBaseString, getCompressedImage } from '@ecdlink/core';
import {
  DesktopComputerIcon,
  DocumentTextIcon,
  PhotographIcon,
  UploadIcon,
  VideoCameraIcon,
} from '@heroicons/react/solid';
import { useEffect, useLayoutEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { classNames } from '../../pages/users/components/users';
import {
  Alert,
  Button,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { videoExtensions } from '../../utils/constants';
import themesIcons from './components/themeIcons/themeIcons';
import { SearchCircleIcon } from '@heroicons/react/outline';
import { FieldType } from '../../pages/content-management/content-management-models';

export interface FileModel {
  fileName: string;
  file: string;
}

export interface FormFileInputProps {
  label: string;
  subLabel?: string;
  hideAcceptedFormats?: boolean;
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
  isIconInput?: boolean;
  onChange?: (item: any) => void;
  isThemeFormFile?: boolean;
  isVideoInput?: boolean;
  isWizardComponent?: boolean;
  onFileChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isFileInput?: boolean;
  hideFileName?: boolean;
}

const containerStyle = 'border-uiLight';
const fileContainerStyle = 'border-successMain';
const errorContainerStyle = 'border-errorMain';

const iconBaseStyle = 'mx-auto h-12 w-12';
const iconStyle = 'text-tertiary';
const fileIconStyle = 'text-successMain';
const themeIconStyle = 'mx-auto h-12 w-12 text-pink-700';
const errorIconStyle = 'text-errorMain';

const FormFileInput: React.FC<FormFileInputProps> = ({
  label,
  subLabel,
  hideAcceptedFormats,
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
  isIconInput,
  onChange,
  isThemeFormFile,
  isVideoInput,
  isWizardComponent,
  onFileChange,
  isFileInput,
  hideFileName,
}) => {
  const [fileName, setFileName] = useState<string | undefined>();
  const [file, setFile] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [uploadTypes, setUploadedTypes] = useState('');
  const [themeIconValue, setThemeIconValue] = useState<any>('');
  const [iconSelected, setIconSelected] = useState(false);
  const [iconIndex, setIconIndex] = useState<number>();
  const accepetedFormatsWithoutLastItem = acceptedFormats?.slice(0, -1);
  const accepetedFormatsFormatted = accepetedFormatsWithoutLastItem?.map(
    (item) => {
      return item + ' ';
    }
  );
  const lastAcceptedFormat = acceptedFormats?.[acceptedFormats?.length - 1];
  const [emojisSection, setEmojisSection] = useState(false);

  const isPdfExtension = acceptedFormats?.some((format) =>
    format.toLowerCase().includes('pdf')
  );
  const containerBaseStyle = `${
    isWizardComponent ? 'w-8/12' : 'w-4/12'
  } relative flex flex-col justify-center items-center block border-2 border-dashed rounded-lg text-center focus:outline-none focus:ring-2 hover:border-uiLight`;

  useEffect(() => {
    if (acceptedFormats?.length > 0 && uploadTypes === '') {
      let extenstions = '';
      acceptedFormats?.forEach(function (extension) {
        extenstions += '.' + extension + ', ';
      });
      setUploadedTypes(extenstions);
    }

    if (contentUrl && contentUrl !== '') {
      setFileName(contentUrl);
    }

    if (!contentUrl) {
      setFileName('');
    }
  }, [acceptedFormats, contentUrl, uploadTypes]);

  const handleChange = async (event: any) => {
    if (isThemeFormFile) {
      const fileName = event?.target.src;
      const response = await fetch(event?.target?.src);
      const blob = await response.blob();
      const iconFile = new File([blob], fileName, {
        type: blob.type,
      });

      setLoading(true);
      handleFile(iconFile);

      setFileName(iconFile?.name);

      return;
    }

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
    const fileExtension = file?.name ? file?.name?.split('.').pop() : undefined;
    const isVideoExtension = videoExtensions.includes(fileExtension);

    setIsVideo(isVideoExtension);

    const compressedFile =
      isImage &&
      !isPdfExtension &&
      !isVideoExtension &&
      !byPassCompression &&
      acceptedFormats?.filter((x) => x === fileExtension).length > 0
        ? await getCompressedImage(file)
        : file;

    if (fileExtension) {
      if (acceptedFormats?.length > 0) {
        if (
          acceptedFormats?.filter((x) => x === fileExtension).length > 0 &&
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
            onFileChange && onFileChange(file);
            setFile(reader.result?.toString() ?? '');
            setLoading(false);
          };
        } else {
          if (
            acceptedFormats?.filter((x) => x === fileExtension).length === 0
          ) {
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
          setError('Invalid File size');
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
          onFileChange && onFileChange(file);
          onChange(splitString);
          setFile(reader.result?.toString() ?? '');
          setLoading(false);
        };
      }
    } else {
      setError('Invalid File type');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      setValue(nameProp, '');
    }
  }, [error, nameProp, setValue]);

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
      setIsVideo(videoExtensions?.includes(type));
    }
  }, [contentUrl]);

  return (
    <>
      <label
        htmlFor={nameProp}
        className="font-lg block pb-1 text-sm font-bold text-gray-900"
      >
        {label}
        {acceptedFormats && !isThemeFormFile && !hideAcceptedFormats && (
          <span className="font-bold"> ({acceptedFormats?.join(', ')})</span>
        )}
      </label>
      {subLabel && (
        <label
          htmlFor={nameProp}
          className={
            'font-body text-textMid block self-stretch text-sm leading-snug'
          }
        >
          {subLabel}
        </label>
      )}
      {nameProp === FieldType.Image && acceptedFormats?.length > 0 && (
        <p className="text-textMid mb-2 text-sm">
          Size limit: {(allowedFileSize / (1024 * 1024))?.toFixed(0)} MB. To
          improve the image position & size, edit the image to fit 360 (width)
          by 168 (height) pixels before uploading.
        </p>
      )}

      {isPdfExtension && acceptedFormats?.length === 1 && (
        <p className="text-textMid mb-2 text-sm">
          Size limit:
          <span className="text-errorMain font-semibold">
            {(allowedFileSize / (1024 * 1024))?.toFixed(0)}
          </span>{' '}
          MB. Convert the file(s) to a single pdf before uploading.
        </p>
      )}

      {isVideoInput && acceptedFormats?.length === 2 && (
        <p className="text-textMid mb-2 text-sm">
          Size limit:
          <span className="text-errorMain font-semibold">
            {(allowedFileSize / (1024 * 1024))?.toFixed(0)}
          </span>{' '}
          MB.
        </p>
      )}
      <label
        className={
          contentUrl && !fileName
            ? ''
            : classNames(getContainerStyle(), containerBaseStyle)
        }
        onClick={() => {
          isThemeFormFile ? setEmojisSection(true) : handleClick();
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
            className={`${
              contentUrl ? '' : 'bg-adminPortalBg'
            } flex h-40 w-full flex-1 flex-col items-center justify-center bg-contain bg-center bg-no-repeat p-5`}
            style={
              file
                ? {
                    height: 200,
                    backgroundImage: `url(${file})`,
                  }
                : contentUrl
                ? {
                    height: 200,
                    backgroundImage: `url(${contentUrl})`,
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
                {!isThemeFormFile ? (
                  <>
                    {isVideoInput ? (
                      <VideoCameraIcon
                        className={classNames(
                          getIconStyle(),
                          iconBaseStyle,
                          ''
                        )}
                      />
                    ) : isFileInput ? (
                      <DocumentTextIcon
                        className={classNames(
                          getIconStyle(),
                          iconBaseStyle,
                          ''
                        )}
                      />
                    ) : (
                      <PhotographIcon
                        className={classNames(
                          getIconStyle(),
                          iconBaseStyle,
                          ''
                        )}
                      />
                    )}
                    {!disabled && (
                      <div className="bg-secondary hover:bg-uiMid focus:outline-none my-4 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2">
                        <DesktopComputerIcon className="mr-4 h-5 w-5" />
                        {file || contentUrl ? (
                          <Typography
                            type={'h4'}
                            color={'white'}
                            text={
                              isVideoInput
                                ? 'Change video'
                                : isFileInput
                                ? 'Change file'
                                : 'Change image'
                            }
                          />
                        ) : (
                          <Typography
                            type={'h4'}
                            color={'white'}
                            text={'Browse my computer'}
                          />
                        )}
                      </div>
                    )}
                    {!disabled && (
                      <Typography
                        type={'h4'}
                        color={file || contentUrl ? 'white' : 'textMid'}
                        text={'or drag file here'}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <PhotographIcon className={themeIconStyle} />
                    <div className="bg-secondary hover:bg-uiMid focus:outline-none my-4 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2">
                      <SearchCircleIcon className="mr-4 h-5 w-5">
                        {' '}
                      </SearchCircleIcon>
                      Search for a theme icon
                    </div>
                  </>
                )}
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
        fileName && !hideFileName && <p className="pb-4">{fileName}</p>
      )}

      {contentUrl && !fileName && !isSubcategoryInput && (
        <Alert
          className="mt-5 mb-3"
          message="Wrong file type. Please try again."
          type="error"
        />
      )}

      {!disabled && (
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
      )}
      <div className="flex items-center justify-center">
        <Dialog
          visible={emojisSection}
          position={DialogPosition.Top}
          className="h-9/12 absolute left-auto right-auto w-6/12"
        >
          <Typography
            type={'h2'}
            weight="bold"
            color={'textMid'}
            className="ml-6 mt-6"
            text={'Search for an icon'}
          />

          <div className="w-dvw">
            <div className="flex h-80 flex-wrap justify-center overflow-y-auto">
              <div className="mt-8 grid w-9/12 grid-cols-6 justify-center gap-x-3 gap-y-3">
                {!!themesIcons?.length &&
                  themesIcons.map((item, index) => {
                    return (
                      <div
                        onClick={(e) => setIconIndex(index)}
                        key={`${item}-${index}`}
                        className={`flex items-center justify-center ${
                          iconSelected && index === iconIndex
                            ? 'rounded-full border-2 border-black'
                            : ''
                        }`}
                      >
                        <img
                          src={item}
                          alt="emojis"
                          id={String(index)}
                          onClick={(e) => {
                            setThemeIconValue(e);
                            setIconSelected(true);
                          }}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="mt-14 flex w-full flex-col justify-center">
              <div className="flex w-full justify-center ">
                <Button
                  type={'filled'}
                  text={'Select icon'}
                  color={'secondary'}
                  textColor={'white'}
                  className={'mb-2 w-11/12 rounded-2xl'}
                  iconPosition={'start'}
                  onClick={() => {
                    handleChange(themeIconValue);
                    setEmojisSection(false);
                    setIconSelected(false);
                  }}
                />
              </div>
              <div className="flex w-full justify-center ">
                <Button
                  type={'outlined'}
                  text={'Close'}
                  color={'secondary'}
                  textColor={'secondary'}
                  className={'mb-8 w-11/12 rounded-2xl'}
                  iconPosition={'start'}
                  onClick={() => setEmojisSection(false)}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  );
};

export default FormFileInput;
