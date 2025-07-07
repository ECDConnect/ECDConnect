import { useMemo } from 'react';
import Typography from '../typography/typography';
import Divider from '../divider/divider';
import BannerWrapper from '../banner-wrapper/banner-wrapper';
import Button from '../button/button';
import LanguageSelector from '../language-selector/language-selector';
import { useWindowSize } from '@reach/window-size';
import LoadingSpinner from '../loading-spinner/loading-spinner';

// This is a copy paste from the text.utils, since this project doesn't have access
const replaceBraces = (sentenceWithBraces: string, value: string) => {
  return sentenceWithBraces.replace(/\{(\w+)\}/g, () => {
    return value;
  });
};

export interface MoreInformationPageProps {
  isLoading?: boolean;
  isClosable?: boolean;
  subTitle?: string;
  name?: string;
  closeText?: string;
  closeIcon?: string;
  onClose: () => void;
  setSelectedLanguage: (locale: string) => void;
  selectedLanguage?: string;
  title?: string;
  moreInformation: any; // TODO - doesn't ref the graphQL library which is what we are passing in here :/ Could make a DTO
  languages: { value: string; label: string }[];
  children?: React.ReactNode;
  childrenPosition?: 'top' | 'bottom';
  languageSelectorPosition?: 'top' | 'bottom';
  footer?: React.ReactNode;
}

export const MoreInformationPage = ({
  name,
  subTitle,
  onClose,
  title,
  moreInformation,
  languages,
  setSelectedLanguage,
  selectedLanguage,
  isLoading,
  children,
  childrenPosition = 'top',
  languageSelectorPosition = 'top',
  isClosable = true,
  closeText = 'Close',
  closeIcon = 'XIcon',
  footer,
}: MoreInformationPageProps) => {
  const { height } = useWindowSize();

  const SELECTOR_HEIGHT = 110;

  const renderContent = useMemo(() => {
    if (moreInformation) {
      return (
        <div className="mb-4">
          {/* --- Info Box ---- */}
          {!!moreInformation.infoBoxTitle && (
            <div className="bg-uiBg rounded-10 mb-4 flex gap-3 p-4">
              {!!moreInformation?.infoBoxIcon && (
                <img
                  alt="icon"
                  src={moreInformation.infoBoxIcon}
                  className="h-16 w-16"
                />
              )}
              <div>
                <Typography
                  type="h4"
                  text={replaceBraces(moreInformation.infoBoxTitle, name || '')}
                  className="mb-3"
                />
                <Typography
                  type="markdown"
                  text={replaceBraces(
                    moreInformation?.infoBoxDescription || '',
                    name || ''
                  )}
                />
              </div>
            </div>
          )}
          {/* ------- A ------- */}
          {!!moreInformation.headerA && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerA, name || '')}
              className="mb-4"
            />
          )}
          {!!moreInformation?.descriptionA && (
            <Typography
              type="markdown"
              style={{
                color: moreInformation?.descriptionAColor || '#231F20',
                fontWeight: !!moreInformation.descriptionAColor ? '500' : '400',
              }}
              color="infoDark"
              text={replaceBraces(moreInformation.descriptionA, name || '')}
            />
          )}
          {!!moreInformation?.showDividerA && (
            <Divider dividerType="dashed" className="my-2" />
          )}
          {/* ------- B ------- */}
          {!!moreInformation.headerB && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerB, name || '')}
              className="mb-4"
            />
          )}
          {!!moreInformation.descriptionB && (
            <div className="my-4 flex gap-2">
              {!!moreInformation?.descriptionBIcon && (
                <img
                  alt="icon"
                  src={moreInformation.descriptionBIcon}
                  className="h-9 w-9"
                />
              )}
              {!!moreInformation?.descriptionB && (
                <Typography
                  type="markdown"
                  color="infoDark"
                  text={replaceBraces(moreInformation.descriptionB, name || '')}
                  style={{
                    color: moreInformation?.descriptionBColor || '#231F20',
                    fontWeight: !!moreInformation.descriptionBColor
                      ? '500'
                      : '400',
                  }}
                />
              )}
            </div>
          )}
          {!!moreInformation?.showDividerB && (
            <Divider dividerType="dashed" className="my-2" />
          )}
          {/* ------- C ------- */}
          {!!moreInformation.headerC && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerC, name || '')}
              className="mb-4"
            />
          )}
          {!!moreInformation?.descriptionC && (
            <Typography
              type="markdown"
              color="infoDark"
              text={replaceBraces(moreInformation.descriptionC, name || '')}
              style={{
                color: moreInformation?.descriptionCColor || '#231F20',
                fontWeight: !!moreInformation.descriptionCColor ? '500' : '400',
              }}
            />
          )}
          {!!moreInformation?.showDividerC && (
            <Divider dividerType="dashed" className="my-2" />
          )}
          {/* ------- C ------- */}
          {!!moreInformation.headerD && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerD, name || '')}
              className="mb-4"
            />
          )}
          {/* ------- D ------- */}
          {!!moreInformation.descriptionD && (
            <div className="my-4 flex gap-2">
              {!!moreInformation?.descriptionDIcon && (
                <img
                  alt="icon"
                  src={moreInformation.descriptionDIcon}
                  className="h-9 w-9"
                />
              )}
              {!!moreInformation?.descriptionD && (
                <Typography
                  type="markdown"
                  color="infoDark"
                  text={replaceBraces(moreInformation.descriptionD, name || '')}
                  style={{
                    color: moreInformation?.descriptionDColor || '#231F20',
                    fontWeight: !!moreInformation.descriptionDColor
                      ? '500'
                      : '400',
                  }}
                />
              )}
            </div>
          )}
        </div>
      );
    }

    return 'Unavailable translation';
  }, [name, moreInformation]);

  const renderLanguageSelector = useMemo(
    () => (
      <LanguageSelector
        selectLanguage={setSelectedLanguage}
        languages={languages}
        currentLocale={selectedLanguage}
      />
    ),
    [languages, setSelectedLanguage, selectedLanguage]
  );

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={title}
      renderOverflow
      {...(isClosable && { onClose })}
    >
      {languageSelectorPosition === 'top' && (
        <div className="bg-uiBg border-primary border-t px-4">
          {renderLanguageSelector}
        </div>
      )}
      {isLoading ? (
        <LoadingSpinner
          size="medium"
          className="mt-4"
          spinnerColor="primary"
          backgroundColor="uiLight"
        />
      ) : (
        <div
          className="flex flex-col p-4"
          style={{
            height:
              languageSelectorPosition === 'top'
                ? height - SELECTOR_HEIGHT
                : height,
          }}
        >
          {childrenPosition === 'top' && children}
          {languageSelectorPosition === 'bottom' && (
            <div className="border-primary mb-4 border border-l-0 border-r-0 border-dashed pb-1">
              {renderLanguageSelector}
            </div>
          )}
          {renderContent}
          {childrenPosition === 'bottom' && children}
          {moreInformation && footer}
          <Button
            className="mt-auto mb-4"
            type="filled"
            color="quatenary"
            textColor="white"
            text={closeText}
            icon={closeIcon}
            onClick={onClose}
          />
        </div>
      )}
    </BannerWrapper>
  );
};
