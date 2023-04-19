import { ActionModal, Button, LoadingSpinner } from '@ecdlink/ui';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useWindowSize } from '@reach/window-size';
import { useAppDispatch } from '@/store';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { visitThunkActions } from '@/store/visit';
import { useSelector } from 'react-redux';
import { getMoreInformationSelector } from '@/store/visit/visit.selectors';
import { replaceBraces } from '@ecdlink/core';

const HEADER_HEIGHT = 140;

export interface WalkthroughInfoPageProps {
  sectionName: string;
  onHelp: () => void;
  onClose: () => void;
}

export const WalkthroughInfoPage = ({
  sectionName,
  onHelp,
  onClose,
}: WalkthroughInfoPageProps) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });

  const { isOnline } = useOnlineStatus();

  const { height } = useWindowSize();

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MORE_INFORMATION
  );

  const moreInformationList = useSelector(getMoreInformationSelector);

  const renderContent = useMemo(() => {
    const moreInformation = moreInformationList?.find(
      (item) => item.section === sectionName
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
        <Button
          className="mt-auto"
          type="filled"
          color="primary"
          textColor="white"
          icon="XIcon"
          text="Close"
          onClick={onClose}
        />
      </>
    );
  }, [isLoading, moreInformationList, onClose, onHelp, sectionName]);

  const getContent = useCallback(async () => {
    if (!isOnline) return;

    appDispatch(
      visitThunkActions.getMoreInformation({
        section: sectionName,
        locale: language.locale,
      })
    );
  }, [appDispatch, isOnline, language.locale, sectionName]);

  useEffect(() => {
    getContent();
  }, [getContent]);

  if (isLoading) {
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
      <div className="bg-uiBg px-4 pb-2 pt-1">
        <LanguageSelector selectLanguage={setLanguage} />
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
