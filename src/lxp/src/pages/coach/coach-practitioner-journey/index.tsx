import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerById } from '@/store/practitioner/practitioner.selectors';
import {
  Alert,
  AlertType,
  BannerWrapper,
  Button,
  MenuListDataItem,
  StackedList,
  Steps,
  Typography,
} from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import { PractitionerJourneyParams } from './coach-practitioner-journey.types';
import { useLayoutEffect, useState } from 'react';
import { Form } from './forms';
import { useAppDispatch } from '@/store';
import { getPractitionerTimeline } from '@/store/pqa/pqa.actions';
import { getPractitionerTimelineSelector } from '@/store/pqa/pqa.selectors';
import {
  dateOptions,
  filterVisit,
  sortVisit,
  timelineSteps,
} from './timeline-steps';
import { getAgeInYearsMonthsAndDays } from '@ecdlink/core';

export const currentActivityKey = 'selectedOption';

export const CoachPractitionerJourney: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const practitioner = useSelector(getPractitionerById(practitionerId));
  const timeline = useSelector(getPractitionerTimelineSelector(practitionerId));

  const practitionerFirstName = practitioner?.user?.firstName;

  const getTime = (startedDate?: string) => {
    if (!startedDate) return undefined;
    const { years, months, days } = getAgeInYearsMonthsAndDays(startedDate);

    if (years === 0 && months < 1) {
      return `${days} ${days > 1 ? 'days' : 'day'}`;
    }

    if (years === 0) {
      return `${months} ${months > 1 ? 'months' : 'month'}`;
    }

    return `${years} ${years > 1 ? 'years' : 'year'} ${months} ${
      months > 1 ? 'months' : 'month'
    }`;
  };

  const dateLongMonthOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const currentVisit = timeline?.siteVisits
    ?.filter(filterVisit)
    .sort(sortVisit)
    .map(
      (visit): MenuListDataItem => ({
        showIcon: true,
        menuIcon: 'ClipboardListIcon',
        iconColor: 'white',
        title: visit?.visitType?.description || 'Visit',
        subTitle: !!visit?.plannedVisitDate
          ? new Date(visit?.plannedVisitDate).toLocaleDateString(
              'en-ZA',
              dateLongMonthOptions
            )
          : '',
        iconBackgroundColor: 'primary',
        backgroundColor: 'uiBg',
        onActionClick: () => {
          window.sessionStorage.setItem(
            currentActivityKey,
            visit?.visitType?.description || 'Visit'
          );
          setShowForm(true);
        },
      })
    )
    .shift();

  useLayoutEffect(() => {
    appDispatch(getPractitionerTimeline({ userId: practitionerId }));
  }, [appDispatch, practitionerId]);

  if (showForm) {
    return <Form onBack={() => setShowForm(false)} />;
  }
  return (
    <BannerWrapper
      size="small"
      renderOverflow
      displayOffline={!isOnline}
      title="SmartStarter journey"
      subTitle={`${practitionerFirstName} ${practitioner?.user?.surname}`}
      onBack={() => history.goBack()}
      className="p-4"
    >
      {!!currentVisit && (
        <StackedList
          isFullHeight={false}
          type="MenuList"
          listItems={[currentVisit]}
        />
      )}
      <Alert
        className="mt-4"
        type={
          timeline?.smartSpaceLicenseColor?.toLocaleLowerCase() as AlertType
        }
        title={timeline?.smartSpaceLicenseStatus || ''}
        message={
          !!timeline?.smartSpaceLicenseDate
            ? new Date(timeline.smartSpaceLicenseDate).toLocaleDateString(
                'en-ZA',
                dateLongMonthOptions
              )
            : ''
        }
        messageColor="textMid"
        customIcon={<BalloonsIcon />}
      />
      <Typography
        className="mt-4 mb-2"
        type="h4"
        text={`${practitionerFirstName} has been a SmartStarter for`}
      />
      <div className="mb-4 flex gap-2">
        <p className="bg-primary text-14 w-fit w-auto rounded-2xl py-1 px-2 font-semibold text-white">
          {getTime(timeline?.starterLicenseDate || new Date())}
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
        text="Schedule support visit"
      />
      {!!timeline && (
        <Steps
          items={timelineSteps(timeline)}
          typeColor={{ completed: 'successMain' }}
        />
      )}
    </BannerWrapper>
  );
};
