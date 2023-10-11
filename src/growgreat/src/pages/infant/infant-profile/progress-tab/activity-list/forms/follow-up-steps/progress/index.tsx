import { Header } from '@/pages/infant/infant-profile/components';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { TipCard } from '../../../../../components';
import { FollowUp } from '../../components/follow-up';
import { useDialog } from '@ecdlink/core';
import { ActionModal, DialogPosition, LoadingSpinner } from '@ecdlink/ui';
import { OfflineCard } from '@/components/offline-card/offline-card';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';

export const ProgressStep = ({ infant, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const { isOnline } = useOnlineStatus();

  const { isLoading: isLoadingPreviousVisit } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_INFANT
  );
  const { isLoading: isLoadingSummary } = useThunkFetchCall(
    'visits',
    VisitActions.GET_INFANT_SUMMARY_BY_PRIORITY
  );

  const isLoading = isLoadingPreviousVisit || isLoadingSummary;

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const dialog = useDialog();
  const [isPrint, setIsPrint] = useState(false);

  const onShare = useCallback(() => {
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
                  setIsPrint(true);
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
  }, [caregiverName, dialog]);

  const renderContent = useMemo(() => {
    if (!isOnline) {
      return <OfflineCard />;
    }

    if (isLoading) {
      return (
        <LoadingSpinner
          size="medium"
          spinnerColor={'primary'}
          backgroundColor={'uiLight'}
          className="p-4"
        />
      );
    }

    return (
      <>
        <TipCard
          className="mb-4"
          hideLeftIcon
          title="Want to share?"
          buttonText="Yes, share now!"
          buttonIcon="ShareIcon"
          onClick={onShare}
        />
        <FollowUp infant={infant || {}} isPrint={isPrint} />
      </>
    );
  }, [infant, isLoading, isOnline, isPrint, onShare]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="ChartBarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Progress"
        subTitle={`${caregiverName ? `${caregiverName} & ` : ''}${name}`}
      />
      <div className="p-4">{renderContent}</div>
    </>
  );
};
