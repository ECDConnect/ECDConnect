import { Header } from '@/pages/infant/infant-profile/components';
import { useLayoutEffect, useMemo } from 'react';
import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { TipCard } from '../../../../../components';
import { FollowUp } from '../../components/follow-up';
import mockedImg from './mockedImg.png';
import { useDialog } from '@ecdlink/core';
import { ActionModal, DialogPosition } from '@ecdlink/ui';

export const ProgressStep = ({ infant, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const dialog = useDialog();

  const onDownloadImage = () => {
    const imageUrl = mockedImg;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.setAttribute('download', 'Child-progress-summary.jpg');
    document.body.appendChild(link);
    link.click();
  };

  const onShare = () => {
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            title={`Only share this with ${caregiverName}`}
            detailText={`You can only share this information with your client, ${caregiverName}.`}
            icon="ExclamationCircleIcon"
            actionButtons={[
              {
                colour: 'primary',
                text: 'Share',
                textColour: 'white',
                type: 'filled',
                leadingIcon: 'ShareIcon',
                onClick: () => {
                  onDownloadImage();
                  onClose();
                },
              },
              {
                colour: 'primary',
                text: 'Cancel',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="ChartBarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Progress"
        subTitle={`${caregiverName} & ${name}`}
      />
      <div className="p-4">
        <TipCard
          className="mb-4"
          hideLeftIcon
          title="Want to share?"
          buttonText="Yes, share now!"
          buttonIcon="ShareIcon"
          onClick={onShare}
        />
        <FollowUp infant={infant || {}} />
      </div>
    </>
  );
};
