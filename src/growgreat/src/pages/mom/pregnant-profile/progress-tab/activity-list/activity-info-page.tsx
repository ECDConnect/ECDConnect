import {
  BannerWrapper,
  Button,
  Card,
  Divider,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import LanguageSelector from '@/components/language-selector/language-selector';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getMoreInformationSelector } from '@/store/visit/visit.selectors';
import { VisitActions } from '@/store/visit/visit.actions';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { replaceBraces } from '@ecdlink/core';
import { ReactComponent as PollyNeutral } from '@/assets/pollyNeutral.svg';
import { Walkthrough } from './walkthrough';
import { RootState } from '@/store/types';
import { getInfantById } from '@/store/infant/infant.selectors';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { LanguageCode } from '@/i18n/types';

export const ActivityInfoPage = ({
  section,
  client,
  setDisplayHelp,
}: {
  subTitle?: string;
  section: string;
  client?: string;
  setDisplayHelp: (displayHelp: boolean) => void;
}) => {
  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [isDisplayWalkthrough, setIsDisplayWalkthrough] = useState(false);
  const [moreInformationList, setMoreInformationList] = useState(
    useSelector(getMoreInformationSelector)
  );

  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MORE_INFORMATION
  );

  const moreInformation = moreInformationList?.find(
    (item) => item.section === section
  );
  const availableLanguages: LanguageCode[] = moreInformation?.availableLanguages
    ? moreInformation.availableLanguages?.map((item) => {
        return item?.locale as LanguageCode;
      })
    : [language.locale as LanguageCode];

  const location = useLocation();
  const [, , , infantId] = location.pathname.split('/');
  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const OnWalkThrough = () => {
    setIsDisplayWalkthrough(true);
  };

  const renderContent = useMemo(() => {
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
              className={`text-${
                moreInformation?.descriptionAColor || 'textDark'
              } font-normal`}
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
            <div className="flex gap-2">
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
                    color: moreInformation?.descriptionBColor || '#5A5A5A',
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
              className={`text-${
                moreInformation?.descriptionCColor || 'textDark'
              } font-normal`}
              color="infoDark"
              text={replaceBraces(moreInformation.descriptionC, client || '')}
            />
          )}
          {!!moreInformation?.showDividerC && (
            <Divider dividerType="dashed" className="my-2" />
          )}
          {/* ------- D ------- */}
          {!!moreInformation.headerD && (
            <Typography
              type="h4"
              text={replaceBraces(moreInformation.headerD, client || '')}
              className="mb-4"
            />
          )}
          {!!moreInformation.descriptionD && (
            <div className="flex gap-2">
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
                  className={`text-${
                    moreInformation?.descriptionDColor || 'textDark'
                  } font-normal`}
                  color="infoDark"
                  text={replaceBraces(
                    moreInformation.descriptionD,
                    client || ''
                  )}
                />
              )}
            </div>
          )}
        </div>
      );
    }

    return 'Unavailable translation';
  }, [client, isLoading, moreInformation]);

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

  if (isDisplayWalkthrough) {
    return (
      <Walkthrough
        infant={infant}
        onClose={() => setIsDisplayWalkthrough(false)}
      />
    );
  }

  return (
    <BannerWrapper
      size="small"
      onBack={() => setDisplayHelp(false)}
      title="Pregnancy activities"
      renderOverflow
    >
      <div className="bg-uiBg border-primary border-t px-4">
        <LanguageSelector
          showOfflineAlert
          currentLocale={'en-za'}
          availableLanguages={availableLanguages}
          selectLanguage={setLanguage}
        />
      </div>
      <div className="p-4">
        <Card className="bg-uiBg my-4 flex flex-col justify-center rounded-2xl p-4">
          <div className="mt-2 flex flex-wrap justify-center p-8">
            <PollyNeutral className="mb-3 h-24 w-24" />
          </div>
          <Typography
            className={'mt-4'}
            color={'textDark'}
            type={'h2'}
            text={'Need my help using the visit activities?'}
          />
          <Button
            text={`Start walkthrough`}
            icon={'ArrowCircleRightIcon'}
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            className={'mt-4 max-h-10'}
            iconPosition={'start'}
            onClick={OnWalkThrough}
          />
        </Card>
        <div>{renderContent}</div>
        <Divider dividerType="dashed" />
        <SuccessCard
          className="my-4"
          customIcon={<CelebrateIcon className="h-14	w-14" />}
          text={`You can earn points with every visit!`}
          textColour="successDark"
          color="successBg"
        />
        <div className="flex h-full items-end">
          <Button
            text={`Get started`}
            icon={'ArrowCircleRightIcon'}
            type={'filled'}
            color={'primary'}
            textColor={'white'}
            className={'bottom-10 mt-2 max-h-10 w-full'}
            iconPosition={'start'}
            onClick={() => setDisplayHelp(false)}
          />
        </div>
      </div>
    </BannerWrapper>
  );
};
