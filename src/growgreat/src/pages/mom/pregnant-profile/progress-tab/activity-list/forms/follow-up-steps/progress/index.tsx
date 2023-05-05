import { Header } from '@/pages/infant/infant-profile/components';
import { useLayoutEffect, useMemo, useState } from 'react';
import { activitiesColours } from '../../../activities-list';
import { DynamicFormProps } from '../../dynamic-form';
import { TipCard } from '../../../../../components';
import { FollowUp } from '../../components/follow-up';
import { useDialog, usePrevious, VisitDto } from '@ecdlink/core';
import { ActionModal, DialogPosition, LoadingSpinner } from '@ecdlink/ui';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { useSelector } from 'react-redux';
import { getPreviousVisitInformationForMotherSelector } from '@/store/visit/visit.selectors';
import { getMotherCurrentVisitSelector } from '@/store/mother/mother.selectors';
import { VisitActions } from '@/store/visit/visit.actions';
import { useAppDispatch } from '@/store';
import { visitThunkActions } from '@/store/visit';

export const ProgressStep = ({ mother, setEnableButton }: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const caregiverName = useMemo(
    () => mother?.user?.firstName || '',
    [mother?.user?.firstName]
  );
  const appDispatch = useAppDispatch();
  const dialog = useDialog();

  // Previous visit data
  const { isLoading } = useThunkFetchCall(
    'visits',
    VisitActions.GET_PREVIOUS_VISIT_INFORMATION_FOR_MOTHER
  );
  const previousVisit = useSelector(
    getPreviousVisitInformationForMotherSelector
  );
  const currentVisit = useSelector(getMotherCurrentVisitSelector);
  const previousCurrentVisit = usePrevious(currentVisit) as
    | VisitDto
    | undefined;
  const [isPrint, setIsPrint] = useState(false);

  useLayoutEffect(() => {
    if (
      (!previousCurrentVisit ||
        (!!previousCurrentVisit &&
          previousCurrentVisit?.id !== currentVisit?.id)) &&
      !!currentVisit
    )
      appDispatch(
        visitThunkActions.getPreviousVisitInformationForMother({
          visitId: currentVisit?.id,
        })
      );
  }, [appDispatch, currentVisit, currentVisit?.id, previousCurrentVisit]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="pt-20"
        size="medium"
        spinnerColor={'primary'}
        backgroundColor={'uiLight'}
      />
    );
  }

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
  };

  return (
    <div>
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
        <div>
          <FollowUp mother={mother || {}} isPrint={isPrint} />
        </div>
      </div>
    </div>
  );
};
