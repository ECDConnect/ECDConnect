import { ActionModal, Button, LoadingSpinner, Typography } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import LanguageSelector, {
  LanguageSelectorProps,
} from '@/components/language-selector/language-selector';
import { useWindowSize } from '@reach/window-size';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  CommunityActions,
  getMoreInformation,
} from '@/store/community/community.actions';
import { VisitActions } from '@/store/visit/visit.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { visitThunkActions } from '@/store/visit';
import { useSelector } from 'react-redux';
import { getMoreInformationSelector } from '@/store/visit/visit.selectors';
import { replaceBraces } from '@ecdlink/core';
import { LanguageCode } from '@/i18n/types';

const HEADER_HEIGHT = 120;

export interface WalkthroughInfoPageProps {
  sectionName: string;
  onHelp: () => void;
  onClose: () => void;
  disableContentFromPortal?: boolean;
  extraElement?: ReactElement;
  availableLanguages?: LanguageSelectorProps['availableLanguages'];
}

export const WalkthroughInfoPage = ({
  sectionName,
  onHelp,
  onClose,
  extraElement,
  disableContentFromPortal,
  availableLanguages,
}: WalkthroughInfoPageProps) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });

  const moreInformation = useSelector(getMoreInformationSelector);
  const [moreInformationList, setMoreInformationList] =
    useState(moreInformation);

  const { isOnline } = useOnlineStatus();

  const { height } = useWindowSize();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MORE_INFORMATION
  );

  const { isLoading: isLoadingCommunity } = useThunkFetchCall(
    'visits',
    CommunityActions.GET_MORE_INFORMATION
  );

  const moreInformationItem = moreInformationList?.find(
    (item) => item?.section === sectionName
  );

  const moreInformationLanguages: LanguageCode[] =
    moreInformationItem?.availableLanguages
      ? moreInformationItem.availableLanguages?.map((item) => {
          return item?.locale as LanguageCode;
        })
      : [language.locale as LanguageCode];

  const renderContent = useMemo(() => {
    const moreInformation = moreInformationList?.find(
      (item) => item?.section === sectionName
    );

    if (isLoading || isLoadingCommunity) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
        />
      );
    }

    return (
      <>
        <ActionModal
          className="bg-uiBg rounded-2xl"
          title={
            replaceBraces(moreInformation?.infoBoxTitle || '', sectionName) ||
            `Need my help using the ${sectionName} section?`
          }
          customIcon={<PollyNeutral className="mb-3 h-24 w-24" />}
          actionButtons={[
            {
              textClassName: 'text-white',
              colour: 'primary',
              text: moreInformation?.infoBoxDescription || 'Start walkthrough',
              textType: 'markdown',
              textColour: 'white',
              type: 'filled',
              leadingIcon: 'ArrowCircleRightIcon',
              onClick: () => {
                onHelp();
              },
            },
          ]}
        />
        <Typography
          type="h4"
          text={moreInformation?.headerA || ''}
          className="mt-8"
        />
        <Typography
          type="markdown"
          text={moreInformation?.descriptionA || ''}
          className="mt-6"
        />
        <Typography
          type="h4"
          text={moreInformation?.headerB || ''}
          className="mt-8"
        />
        <Typography
          type="markdown"
          text={moreInformation?.descriptionB || ''}
          className="mt-6"
        />
        <Typography
          type="h4"
          text={moreInformation?.headerC || ''}
          className="mt-8"
        />
        <Typography
          type="markdown"
          text={moreInformation?.descriptionC || ''}
          className="mt-6"
        />
        {extraElement}
        <span className="mb-5" />
        <Button
          className="mt-auto mb-4"
          type="filled"
          color="primary"
          textColor="white"
          icon="XIcon"
          text="Close"
          onClick={onClose}
        />
      </>
    );
  }, [
    extraElement,
    isLoading,
    isLoadingCommunity,
    moreInformationList,
    onClose,
    onHelp,
    sectionName,
  ]);

  const getContent = useCallback(async () => {
    if (!isOnline || disableContentFromPortal) return;

    if (sectionName.includes('Community')) {
      setMoreInformationList(
        await appDispatch(
          getMoreInformation({
            locale: language.locale,
            section: sectionName,
            tab: 'team',
          })
        ).unwrap()
      );
    } else {
      const newMoreInformation = await appDispatch(
        visitThunkActions.getMoreInformation({
          section: sectionName,
          locale: language.locale,
        })
      ).unwrap();
      if (newMoreInformation) {
        setMoreInformationList([newMoreInformation]);
      }
    }
  }, [
    isOnline,
    disableContentFromPortal,
    sectionName,
    appDispatch,
    language.locale,
  ]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  if (isLoading) {
    return (
      <LoadingSpinner
        size="medium"
        className="mt-4"
        spinnerColor={'primary'}
        backgroundColor={'uiLight'}
      />
    );
  }

  return (
    <>
      <div className="bg-uiBg px-4 pb-2 pt-1">
        <LanguageSelector
          availableLanguages={moreInformationLanguages || availableLanguages}
          showOfflineAlert={!disableContentFromPortal}
          selectLanguage={setLanguage}
        />
      </div>
      <div
        className="flex flex-col p-4"
        style={{ height: height - HEADER_HEIGHT }}
      >
        {renderContent}
      </div>
    </>
  );
};
