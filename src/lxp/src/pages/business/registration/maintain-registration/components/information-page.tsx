import {
  BannerWrapper,
  Button,
  LoadingSpinner,
  Typography,
  Alert,
} from '@ecdlink/ui';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { LanguageCode } from '@/i18n/types';
import { StaticDataActions } from '@/store/static-data/static-data.actions';
import { getMoreInformationSelector } from '@/store/static-data/static-data.selectors';
import { staticDataThunkActions } from '@/store/static-data';
import { useHistory } from 'react-router-dom';

export const InformationPage = ({
  section,
  subTitle,
  onClose,
  onSubmit,
  title,
}: {
  subTitle?: string;
  section: string;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
}) => {
  const [language, setLanguage] = useState<{ locale: string }>({
    locale: 'en-za',
  });

  const moreInformationList = useSelector(
    getMoreInformationSelector(section, language.locale)
  );

  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const { isLoading } = useThunkFetchCall(
    'staticData',
    StaticDataActions.GET_MORE_INFORMATION
  );

  const moreInformationItem = moreInformationList?.find(
    (item) => item?.type === section
  );
  const availableLanguages: LanguageCode[] =
    moreInformationItem?.availableLanguages
      ? moreInformationItem.availableLanguages?.map((item) => {
          return item?.locale as LanguageCode;
        })
      : [language.locale as LanguageCode];

  const renderContentText = (text: string) => {
    return (
      <div className="flex gap-2">
        <Typography
          type="markdown"
          align="left"
          weight="normal"
          text={text}
          className={'textDark'}
          color="infoDark"
          lineHeight="tight"
        />
      </div>
    );
  };

  const renderContent = () => {
    const moreInformation = moreInformationList?.find(
      (item) => item.type === section
    );

    if (isLoading) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
        />
      );
    }

    if (moreInformation) {
      return (
        <div className="mb-4">
          {!!moreInformation.visit && (
            <Typography
              type="h1"
              text={moreInformation.visit}
              className="mb-3"
            />
          )}

          {/* --- Info Box ---- */}
          {!!moreInformation.infoBoxTitle && (
            <Alert
              title={moreInformation.infoBoxTitle}
              message={moreInformation.infoBoxDescription || ''}
              type={'info'}
            />
          )}

          {/* ------- Subtitle ------- */}
          {!!moreInformation.section && (
            <Typography
              type="h3"
              text={moreInformation.section}
              className="mt-3"
              color={'textMid'}
            />
          )}

          {/* ------- A ------- */}
          {moreInformation.headerA ? (
            <Typography
              type="h2"
              text={moreInformation.headerA}
              className="mt-3"
            />
          ) : (
            <div className="mt-2"></div>
          )}
          {!!moreInformation?.descriptionA && (
            <>{renderContentText(moreInformation.descriptionA)}</>
          )}

          {!!moreInformation?.buttonlinkADescription && (
            <Button
              color="quatenary"
              textColor="white"
              type="filled"
              size="small"
              onClick={() => {
                moreInformation.buttonlinkA?.includes('practitioner/profile')
                  ? history.push(moreInformation.buttonlinkA)
                  : window.open(moreInformation.buttonlinkA || '', '_blank');
              }}
            >
              <Typography
                color="white"
                text={moreInformation?.buttonlinkADescription}
                type="small"
              />
            </Button>
          )}

          {/* ------- B ------- */}
          {moreInformation.headerB ? (
            <Typography
              type="h2"
              text={moreInformation.headerB}
              className="mt-3"
            />
          ) : (
            <div className="mt-2"></div>
          )}
          {!!moreInformation?.descriptionB && (
            <>{renderContentText(moreInformation.descriptionB)}</>
          )}
          {!!moreInformation?.buttonlinkBDescription && (
            <Button
              color="quatenary"
              textColor="white"
              type="filled"
              size="small"
              onClick={() => {
                moreInformation.buttonlinkB &&
                  window.open(moreInformation.buttonlinkB, '_blank');
              }}
            >
              <Typography
                color="white"
                text={moreInformation?.buttonlinkBDescription}
                type="small"
              />
            </Button>
          )}
          {/* ------- C ------- */}
          {moreInformation.headerC ? (
            <Typography
              type="h2"
              text={moreInformation.headerC}
              className="mt-3"
            />
          ) : (
            <div className="mt-2"></div>
          )}
          {!!moreInformation?.descriptionC && (
            <>{renderContentText(moreInformation.descriptionC)}</>
          )}
          {!!moreInformation?.buttonlinkCDescription && (
            <Button
              color="quatenary"
              textColor="white"
              type="filled"
              size="small"
              onClick={() => {
                moreInformation.buttonlinkC &&
                  window.open(moreInformation.buttonlinkC, '_blank');
              }}
            >
              <Typography
                color="white"
                text={moreInformation?.buttonlinkCDescription}
                type="small"
              />
            </Button>
          )}
          {/* --- Bottom Info Box ---- */}
          {!!moreInformation.infoBoxBTitle && (
            <div className="mt-4">
              <Alert
                title={moreInformation.infoBoxBTitle}
                messageColor={'textDark'}
                type={'info'}
                customMessage={
                  <div>
                    <Typography
                      type="markdown"
                      align="left"
                      weight="normal"
                      text={moreInformation.infoBoxBDescription || ''}
                      className={'textDark'}
                      color="infoDark"
                      lineHeight="tight"
                    />
                    <Button
                      onClick={() => {
                        moreInformation.infoBoxBLink &&
                          window.open(moreInformation.infoBoxBLink, '_blank');
                      }}
                      size="normal"
                      color="quatenary"
                      textColor="white"
                      type="filled"
                    >
                      <span className="text-quatenary mr-2 h-5 w-5">
                        <svg
                          width="21"
                          height="21"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.7179 3.28528C11.3299 1.89661 9.4366 1.19595 7.4486 1.35595C4.77593 1.57061 2.43326 3.42928 1.64926 5.99328C1.08926 7.82528 1.3246 9.73795 2.2366 11.3179L1.3726 14.1866C1.28993 14.4619 1.54126 14.7213 1.81926 14.6473L4.82193 13.8426C5.7946 14.3733 6.88926 14.6526 8.00393 14.6533H8.0066C10.8033 14.6533 13.3873 12.9426 14.2813 10.2926C15.1519 7.70861 14.5079 5.07728 12.7179 3.28528ZM11.2653 10.3693C11.1266 10.7579 10.4473 11.1326 10.1419 11.1599C9.8366 11.1879 9.5506 11.2979 8.14526 10.7439C6.45393 10.0773 5.38593 8.34328 5.30326 8.23261C5.21993 8.12128 4.62393 7.33061 4.62393 6.51194C4.62393 5.69328 5.05393 5.29061 5.2066 5.12461C5.35926 4.95794 5.53926 4.91661 5.6506 4.91661C5.76126 4.91661 5.8726 4.91661 5.96926 4.92061C6.08793 4.92528 6.21926 4.93128 6.34393 5.20794C6.49193 5.53728 6.81526 6.35995 6.8566 6.44328C6.89793 6.52661 6.92593 6.62395 6.8706 6.73461C6.81526 6.84528 6.78726 6.91461 6.7046 7.01195C6.62126 7.10928 6.52993 7.22861 6.45526 7.30328C6.37193 7.38595 6.28526 7.47661 6.38193 7.64261C6.47926 7.80928 6.8126 8.35395 7.30726 8.79461C7.94326 9.36128 8.4786 9.53661 8.64526 9.62061C8.81193 9.70395 8.9086 9.68995 9.00593 9.57861C9.10326 9.46795 9.42193 9.09328 9.5326 8.92661C9.64326 8.75995 9.7546 8.78795 9.90726 8.84328C10.0599 8.89861 10.8779 9.30128 11.0439 9.38461C11.2106 9.46795 11.3213 9.50928 11.3626 9.57861C11.4039 9.64728 11.4039 9.98061 11.2653 10.3693Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      <Typography
                        color={'white'}
                        type={'small'}
                        text={
                          moreInformation.infoBoxBLinkDescription ||
                          'Go to WhatsApp'
                        }
                        className={'font-semibold'}
                      />
                    </Button>
                  </div>
                }
              />
            </div>
          )}
        </div>
      );
    }

    return 'Unavailable translation';
  };

  const fetchContent = useCallback(async () => {
    if (!isOnline) return;
    const result = await appDispatch(
      staticDataThunkActions.getMoreInformation({
        section,
        locale: language.locale,
      })
    ).unwrap();
    if (!result?.length && language.locale !== 'en-za') {
      setLanguage({ locale: 'en-za' });
    }
  }, [appDispatch, isOnline, language.locale, section]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={title ? title : section}
      renderOverflow
      isLoading={isLoading}
      onClose={onClose}
    >
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector
          labelClassName="text-textDark mr-2"
          showOfflineAlert
          currentLocale={language.locale}
          selectLanguage={setLanguage}
          availableLanguages={availableLanguages}
        />
      </div>
      <div className="flex h-full flex-col p-4">
        {renderContent()}

        <Button
          className="mt-auto"
          type="filled"
          color="quatenary"
          textColor="white"
          text={
            section === 'Apply'
              ? 'I have my bronze certificate'
              : 'I have my silver certificate'
          }
          icon="CheckCircleIcon"
          onClick={onSubmit}
        />
      </div>
    </BannerWrapper>
  );
};
