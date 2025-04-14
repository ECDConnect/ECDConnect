import { BannerWrapper, Button, Card, Divider, Typography } from '@ecdlink/ui';
import LanguageSelector from '../../../../../../../components/language-selector/language-selector';
import { activitySelectors } from '@store/content/activity';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ActivitySubCategoryCard } from '../../components/activity-sub-category-card/activity-sub-category-card';
import { ActivityDetailsProps } from './activity-details.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';
import { useAppContext } from '@/walkthrougContext';
import { dummyActivityDetails } from '@/pages/classroom/programme-planning/programme-dashboard/walkthrough/dummy-content';
import ProgrammeWrapper from '../../../../programme-dashboard/walkthrough/programme-wrapper';
import { LanguageCode } from '@/i18n/types';
import { ActivityDto, LanguageDto } from '@ecdlink/core';
import { ContentActivityService } from '@/services/ContentActivityService';
import { authSelectors } from '@/store/auth';

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activityId,
  isSelected,
  disabled,
  onActivityChanged,
  onActivitySelected,
  onBack,
  availableLanguages,
}) => {
  const [isOnlineOnlyAlert, setOnlineOnlyAlert] = useState(false);
  const { isOnline } = useOnlineStatus();
  const authUser = useSelector(authSelectors.getAuthUser);

  const { state } = useAppContext();
  const isWalkthrough = state?.run;

  const [language, setLanguage] = useState({ locale: 'en-za' });
  const [languages, setLanguages] = useState([language.locale as LanguageCode]);
  const [currentActivity, setCurrentActivity] = useState<ActivityDto>();

  useEffect(() => {
    if (availableLanguages !== undefined) {
      setLanguages(
        availableLanguages
          ? availableLanguages?.map((item) => {
              return item?.locale as LanguageCode;
            })
          : [language.locale as LanguageCode]
      );
    }
  }, [availableLanguages, language.locale]);

  const activityById = useSelector(
    activitySelectors.getActivityById(activityId)
  );

  useEffect(() => {
    if (isWalkthrough) {
      setCurrentActivity(dummyActivityDetails);
    } else {
      setCurrentActivity(activityById);
    }
  }, [activityById, isWalkthrough]);

  const date = new Date();

  const handleActivityChanged = () => {
    if (isOnline) {
      onActivityChanged();
    } else {
      setOnlineOnlyAlert(true);
    }
  };

  useEffect(() => {
    if (isWalkthrough && state.stepIndex === 7) {
      onActivityChanged();
    }
  }, [isWalkthrough, onActivityChanged, state.stepIndex]);

  const getDataByLanguage = async (language: LanguageDto) => {
    setLanguage(language);

    let activities: ActivityDto[] | undefined;

    activities = await new ContentActivityService(
      authUser?.auth_token || ''
    ).getActivities(language.locale);

    const translatedActivity = activities?.find(
      (item) => item.id === currentActivity?.id
    );
    setCurrentActivity(translatedActivity || currentActivity);
  };

  if (!currentActivity) return <></>;

  return (
    <>
      <ProgrammeWrapper />
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={currentActivity.name}
        subTitle={`${date.toDateString()}`}
        color={'primary'}
        backgroundColour="white"
        onBack={onBack}
        displayOffline={!isOnline}
      >
        {isOnlineOnlyAlert && (
          <div className="absolute  z-10 flex h-full items-center ">
            <div className="rounded-10 z-10 mx-4 bg-white opacity-100">
              <OnlineOnlyModal
                onSubmit={() => setOnlineOnlyAlert(false)}
              ></OnlineOnlyModal>
            </div>
            <div className="absolute z-0 h-full w-full bg-gray-600 opacity-40"></div>
          </div>
        )}
        {currentActivity.image && currentActivity.image?.length > 0 && (
          <img
            src={currentActivity.image}
            className="mx-auto h-40 w-full rounded-md"
            alt=""
          />
        )}

        <LanguageSelector
          labelClassName="text-textDark mr-2"
          currentLocale={language?.locale}
          selectLanguage={(data) => getDataByLanguage(data)}
          availableLanguages={languages}
        />
        <Divider />
        <div className="px-4 py-3">
          <Typography
            type="h1"
            text={currentActivity.name}
            color={'textDark'}
          />

          {!disabled &&
            (isSelected ? (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-2 mb-4 w-full'}
                textColor={'white'}
                text={`Change activity`}
                icon={'RefreshIcon'}
                iconPosition={'start'}
                onClick={handleActivityChanged}
              />
            ) : (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-2 mb-4 w-full'}
                textColor={'white'}
                text={'Choose this activity'}
                icon={'CheckCircleIcon'}
                iconPosition={'start'}
                onClick={onActivitySelected}
              />
            ))}

          <Divider dividerType="dashed" />

          <Typography
            type="body"
            weight="bold"
            fontSize={'18'}
            text={'Skills'}
            color={'textDark'}
            className="mt-5"
          />
          <Card className="border-primary mt-2 rounded-lg border">
            {currentActivity.subCategories?.map((subCategory, idx) => (
              <ActivitySubCategoryCard
                key={`activity-details-sub-category-${idx}`}
                subCategory={subCategory}
              />
            ))}
          </Card>
          <div id="walkthrough-activity-detail">
            <Typography
              type="body"
              fontSize={'18'}
              weight="bold"
              text={'What do I need?'}
              color={'textDark'}
              className="mt-5"
            />

            <Typography
              type="body"
              fontSize={'16'}
              text={currentActivity.materials}
              color={'textMid'}
            />
            <Typography
              type="body"
              fontSize={'18'}
              weight="bold"
              text={'What do I do?'}
              color={'textDark'}
              className="mt-5"
            />

            <Typography
              type="markdown"
              fontSize={'16'}
              text={currentActivity.description}
              color={'textDark'}
            />
          </div>
        </div>
        <div className="bg-uiBg px-4 py-2">
          <Typography
            type="body"
            fontSize={'18'}
            weight="bold"
            text={'Notes'}
            color={'textDark'}
          />
          <Typography
            type="markdown"
            fontSize={'16'}
            text={currentActivity.notes}
            color={'textDark'}
          />
        </div>
        <div className="mb-20 p-4">
          {!disabled &&
            (isSelected ? (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-2 w-full'}
                textColor={'white'}
                text={`Change activity`}
                icon={'RefreshIcon'}
                iconPosition={'start'}
                onClick={onActivityChanged}
              />
            ) : (
              <Button
                type={'filled'}
                color={'quatenary'}
                className={'mt-2 w-full'}
                textColor={'white'}
                text={'Choose this activity'}
                icon={'CheckCircleIcon'}
                iconPosition={'start'}
                onClick={onActivitySelected}
              />
            ))}
        </div>
      </BannerWrapper>
    </>
  );
};

export default ActivityDetails;
