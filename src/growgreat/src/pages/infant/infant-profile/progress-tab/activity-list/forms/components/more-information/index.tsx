import {
  BannerWrapper,
  Button,
  Divider,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getMoreInformationSelector } from '@/store/visit/visit.selectors';
import { VisitActions } from '@/store/visit/visit.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { replaceBraces } from '@ecdlink/core';
import { LanguageCode } from '@/i18n/types';

export const MoreInformation = ({
  section,
  client,
  subTitle,
  onClose,
  title,
}: {
  subTitle?: string;
  section: string;
  client?: string;
  onClose: () => void;
  title?: string;
}) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [moreInformationList, setMoreInformationList] = useState(
    useSelector(getMoreInformationSelector)
  );

  const { isOnline } = useOnlineStatus();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MORE_INFORMATION
  );

  const moreInformationItem = moreInformationList?.find(
    (item) => item?.section === section
  );
  const availableLanguages: LanguageCode[] =
    moreInformationItem?.availableLanguages
      ? moreInformationItem.availableLanguages?.map((item) => {
          return item?.locale as LanguageCode;
        })
      : [language.locale as LanguageCode];

  const renderContent = useMemo(() => {
    const moreInformation = moreInformationList?.find(
      (item) => item.section === section
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
                  text={replaceBraces(
                    moreInformation.infoBoxTitle,
                    client || ''
                  )}
                  className="mb-3"
                />
                <Typography
                  type="markdown"
                  text={replaceBraces(
                    moreInformation?.infoBoxDescription || '',
                    client || ''
                  )}
                />
              </div>
            </div>
          )}
          {/* ------- A ------- */}
          {!!moreInformation.headerA && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerA, client || '')}
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
              text={replaceBraces(moreInformation.descriptionA, client || '')}
            />
          )}
          {!!moreInformation?.showDividerA && (
            <Divider dividerType="dashed" className="my-2" />
          )}
          {/* ------- B ------- */}
          {!!moreInformation.headerB && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerB, client || '')}
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
                  text={replaceBraces(
                    moreInformation.descriptionB,
                    client || ''
                  )}
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
              text={replaceBraces(moreInformation.headerC, client || '')}
              className="mb-4"
            />
          )}
          {!!moreInformation?.descriptionC && (
            <Typography
              type="markdown"
              color="infoDark"
              text={replaceBraces(moreInformation.descriptionC, client || '')}
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
              text={replaceBraces(moreInformation.headerD, client || '')}
              className="mb-4"
            />
          )}
          {!!moreInformation?.showDividerC && (
            <Divider dividerType="dashed" className="my-2" />
          )}
          {/* ------- C ------- */}
          {!!moreInformation.headerD && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerD, client || '')}
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
                  text={replaceBraces(
                    moreInformation.descriptionD,
                    client || ''
                  )}
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
  }, [client, isLoading, moreInformationList, section]);

  const getContent = useCallback(async () => {
    if (!isOnline) return;
    const newMoreInformation = await appDispatch(
      visitThunkActions.getMoreInformation({
        section,
        locale: language.locale,
      })
    ).unwrap();
    if (newMoreInformation) {
      setMoreInformationList([newMoreInformation]);
    }
  }, [appDispatch, isOnline, language.locale, section]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  return (
    <BannerWrapper
      size="small"
      onBack={onClose}
      title={title ? title : section}
      renderOverflow
      onClose={onClose}
    >
      <Header
        backgroundColor="infoMain"
        icon="InformationCircleIcon"
        title="More information"
        subTitle={subTitle}
      />
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector
          showOfflineAlert
          selectLanguage={setLanguage}
          availableLanguages={availableLanguages}
        />
      </div>
      <div className="flex h-full flex-col p-4">
        {renderContent}
        <Button
          className="mt-auto"
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
