import { Header } from '@/pages/infant/infant-profile/components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { TipCard } from '../../../../../components';
import { FollowUp } from '../../components/follow-up';
import { useDialog } from '@ecdlink/core';
import { ActionModal, DialogPosition, LoadingSpinner } from '@ecdlink/ui';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { VisitActions } from '@/store/visit/visit.actions';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { OfflineCard } from '@/components/offline-card/offline-card';

export const ProgressStep = ({ mother, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const caregiverName = useMemo(
    () => mother?.user?.firstName || '',
    [mother?.user?.firstName]
  );

  const { isOnline } = useOnlineStatus();

  const { isLoading: isLoadingPreviousVisit } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_MOTHER
  );
  const { isLoading: isLoadingSummary } = useThunkFetchCall(
    'visits',
    VisitActions.GET_MOTHER_SUMMARY_BY_PRIORITY
  );

  const isLoading = isLoadingPreviousVisit || isLoadingSummary;

  const dialog = useDialog();

  const [isPrint, setIsPrint] = useState(false);

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

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
        <div>
          <FollowUp mother={mother || {}} isPrint={isPrint} />
        </div>
      </>
    );
  }, [mother, isLoading, isOnline, isPrint, onShare]);

  return (
    <div>
      <Header
        icon="ChartBarIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title="Progress"
        subTitle={`${name}`}
      />
      <div className="p-4">{renderContent}</div>
    </div>
  );
};
