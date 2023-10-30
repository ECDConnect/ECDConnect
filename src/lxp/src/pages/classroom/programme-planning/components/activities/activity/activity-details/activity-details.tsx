import {
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import LanguageSelector from '../../../../../../../components/language-selector/language-selector';
import { activitySelectors } from '@store/content/activity';
import React from 'react';
import { useSelector } from 'react-redux';
import { ActivitySubCategoryCard } from '../../components/activity-sub-category-card/activity-sub-category-card';
import { ActivityDetailsProps } from './activity-details.types';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useDialog } from '@ecdlink/core';
import OnlineOnlyModal from '@/modals/offline-sync/online-only-modal';

const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activityId,
  isSelected,
  disabled,
  onActivityChanged,
  onActivitySelected,
  onBack,
}) => {
  const { isOnline } = useOnlineStatus();
  const activityDetail = useSelector(
    activitySelectors.getActivityById(activityId)
  );

  const date = new Date();

  const dialog = useDialog();

  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const handleActivityChanged = () => {
    if (isOnline) {
      onActivityChanged();
    } else {
      showOnlineOnly();
    }
  };

  if (!activityDetail) return <></>;

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={activityDetail.name}
      subTitle={`${date.toDateString()}`}
      color={'primary'}
      backgroundColour="white"
      onBack={onBack}
      displayOffline={!isOnline}
    >
      {activityDetail.image && activityDetail.image?.length > 0 && (
        <img
          src={activityDetail.image}
          className="mx-auto h-40 w-full rounded-md"
          alt=""
        />
      )}

      <LanguageSelector currentLocale={'en-za'} selectLanguage={() => {}} />
      <Divider />
      <div className="px-4 py-3">
        <Typography type="h1" text={activityDetail.name} color={'textDark'} />

        {!disabled &&
          (isSelected ? (
            <Button
              type={'filled'}
              color={'primary'}
              className={'mt-2 mb-4 w-full'}
              textColor={'white'}
              text={`Change activity`}
              icon={'SwitchVerticalIcon'}
              iconPosition={'start'}
              onClick={handleActivityChanged}
            />
          ) : (
            <Button
              type={'filled'}
              color={'primary'}
              className={'mt-2 mb-4 w-full'}
              textColor={'white'}
              text={'Choose this activity'}
              icon={'CheckCircleIcon'}
              iconPosition={'start'}
              onClick={onActivitySelected}
            />
          ))}

        <Divider dividerType="dashed" />

        <div id="walkthrough-activity-detail">
          <Typography
            type="body"
            weight="bold"
            fontSize={'18'}
            text={'Skills'}
            color={'textDark'}
            className="mt-5"
          />
          <Card className="border-primary mt-2 rounded-lg border">
            {activityDetail.subCategories?.map((subCategory, idx) => (
              <ActivitySubCategoryCard
                key={`activity-details-sub-category-${idx}`}
                subCategory={subCategory}
              />
            ))}
          </Card>

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
            text={activityDetail.materials}
            color={'textMid'}
          />
        </div>
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
          text={activityDetail.description}
          color={'textDark'}
        />
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
          text={activityDetail.notes}
          color={'textDark'}
        />
      </div>
      <div className="mb-20 p-4">
        {!disabled &&
          (isSelected ? (
            <Button
              type={'filled'}
              color={'primary'}
              className={'mt-2 w-full'}
              textColor={'white'}
              text={`Change activity`}
              icon={'SwitchVerticalIcon'}
              iconPosition={'start'}
              onClick={onActivityChanged}
            />
          ) : (
            <Button
              type={'filled'}
              color={'primary'}
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
  );
};

export default ActivityDetails;
