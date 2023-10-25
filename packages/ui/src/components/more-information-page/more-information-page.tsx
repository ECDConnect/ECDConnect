import { useMemo } from 'react';
import Typography from '../typography/typography';
import Divider from '../divider/divider';
import BannerWrapper from '../banner-wrapper/banner-wrapper';
import Button from '../button/button';
import LanguageSelector from '../language-selector/language-selector';
import { useWindowSize } from '@reach/window-size';

// This is a copy paste from the text.utils, since this project doesn't have access
const replaceBraces = (sentenceWithBraces: string, value: string) => {
  return sentenceWithBraces.replace(/\{(\w+)\}/g, () => {
    return value;
  });
};

export const MoreInformationPage = ({
  name,
  subTitle,
  onClose,
  title,
  moreInformation,
  languages,
  setSelectedLanguage,
}: {
  subTitle?: string;
  name?: string;
  onClose: () => void;
  setSelectedLanguage: (locale: string) => void;
  title?: string;
  moreInformation: any; // TODO - doesn't ref the graphQL library which is what we are passing in here :/ Could make a DTO
  languages: { value: string; label: string }[];
}) => {
  const { height } = useWindowSize();

  const SELECTOR_HEIGHT = 64;

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

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={title}
      renderOverflow
      onClose={onClose}
    >
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector
          selectLanguage={setSelectedLanguage}
          languages={languages}
        />
      </div>
      <div
        className="flex flex-col p-4"
        style={{ height: height - SELECTOR_HEIGHT }}
      >
        {renderContent}
        <Button
          className="mt-auto mb-4"
          type="filled"
          color="primary"
          textColor="white"
          text="Close"
          icon="XIcon"
          onClick={onClose}
        />
      </div>
    </BannerWrapper>
  );
};
