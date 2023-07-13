import { useAppDispatch } from '@/store';
import { PqaActions, getPractitionerTimeline } from '@/store/pqa/pqa.actions';
import { getPractitionerTimelineByIdSelector } from '@/store/pqa/pqa.selectors';
import { getUser } from '@/store/user/user.selectors';
import {
  Button,
  LoadingSpinner,
  MenuListDataItem,
  StackedList,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useLayoutEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { timelineSteps } from './timeline/timeline-steps';
import { getFormattedDateInYearsMonthsAndDays } from '@ecdlink/core';
import {
  dateLongMonthOptions,
  dateOptions,
  filterVisit,
  sortVisit,
} from './timeline/utils';
import { visitTypes } from './index.types';
import { Visit } from '@ecdlink/graphql';
import { Form, currentActivityKey, visitIdKey } from './forms';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

interface PractitionerJourneyProps {
  onIsDisplayFormChange: (value: boolean) => void;
}

export const PractitionerJourney = ({
  onIsDisplayFormChange,
}: PractitionerJourneyProps) => {
  const [, /* showForm */ setShowForm] = useState(false);

  const appDispatch = useAppDispatch();

  const user = useSelector(getUser);
  const userId = user?.id || '';

  const timeline = useSelector(getPractitionerTimelineByIdSelector(userId));

  const { isLoading: isLoadingTimeline } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_PRACTITIONER_TIMELINE
  );

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  // TODO: add rules
  const uncompletedSelfAssessment = true
    ? [
        {
          id: 'self-assessment',
          attended: false,
          visitType: {
            description: 'Self-assessment due',
            name: visitTypes.selfAssessment.first.name,
            order: 1,
          },
          // TODO: check correct date
          plannedVisitDate: new Date(),
        } as Visit,
      ]
    : [];

  const uncompletedVisits = [...uncompletedSelfAssessment];

  const onStart = (visitName?: string) => {
    window.sessionStorage.setItem(currentActivityKey, visitName || 'Visit');
    setShowForm(true);
    onIsDisplayFormChange(true);
  };

  const currentVisit = uncompletedVisits
    ?.filter(filterVisit)
    .sort(sortVisit)
    ?.map(
      (visit): MenuListDataItem<{ visitId?: string }> => ({
        showIcon: true,
        menuIcon: 'ClipboardListIcon',
        iconColor: 'white',
        titleStyle: 'text-textDark',
        title: visit?.visitType?.description || 'Visit',
        subTitle: !!visit?.plannedVisitDate
          ? new Date(visit?.plannedVisitDate).toLocaleDateString(
              'en-ZA',
              dateLongMonthOptions
            )
          : '',
        subTitleStyle: 'text-textDark',
        iconBackgroundColor: 'primary',
        backgroundColor: 'uiBg',
        extraData: { visitId: visit?.id },
        onActionClick: () => onStart(String(visit?.visitType?.name)),
      })
    )
    .shift();

  const onFormBack = () => {
    window.sessionStorage.removeItem(currentActivityKey);
    window.sessionStorage.removeItem(visitIdKey);
    setShowForm(false);
    onIsDisplayFormChange(false);
  };

  const getTimeline = useCallback(() => {
    if (userId) {
      appDispatch(getPractitionerTimeline({ userId: userId }));
    }
  }, [appDispatch, userId]);

  useLayoutEffect(() => {
    if (activityName) {
      onIsDisplayFormChange(true);
    }
  }, [activityName, onIsDisplayFormChange]);

  useLayoutEffect(() => {
    getTimeline();
  }, [getTimeline]);

  if (activityName && currentVisit?.extraData?.visitId) {
    return (
      <Form visitId={currentVisit.extraData.visitId} onBack={onFormBack} />
    );
  }

  if (isLoadingTimeline) {
    return (
      <LoadingSpinner
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
        className="tex pt-4"
      />
    );
  }

  return (
    <div className="p-4">
      {!!currentVisit && (
        <StackedList
          isFullHeight={false}
          type="MenuList"
          listItems={[currentVisit]}
        />
      )}
      <Typography
        className="mt-4 mb-2"
        type="h4"
        text={`You have been a SmartStarter for`}
      />
      <div className="mb-4 flex gap-2">
        <p className="bg-primary text-14 w-fit w-auto rounded-2xl py-1 px-2 font-semibold text-white">
          {getFormattedDateInYearsMonthsAndDays(
            timeline?.starterLicenseDate || new Date()
          )}
        </p>
        {!!timeline?.starterLicenseDate && (
          <Typography
            type="body"
            color="textMid"
            text={`Since ${new Date(
              timeline.starterLicenseDate
            ).toLocaleDateString('en-ZA', dateOptions)}`}
          />
        )}
      </div>
      <Button
        className="mb-4 w-full"
        color="primary"
        type="outlined"
        textColor="primary"
        icon="LocationMarkerIcon"
        text="Request a coaching visit or call"
        onClick={() => {}}
      />
      {!!timeline && (
        <Steps
          items={timelineSteps({ timeline })}
          typeColor={{ completed: 'successMain' }}
        />
      )}
    </div>
  );
};
