import React, { useCallback, useEffect, useMemo } from 'react';
import { useWindowSize } from '@reach/window-size';

import {
  ActionModal,
  Button,
  DialogPosition,
  Divider,
  LoadingSpinner,
  RoundIcon,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import Infant from '@/assets/infant.svg';
import { useHistory, useLocation, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { useAppDispatch } from '@/store';
import {
  getDateWithoutTimeZone,
  getStringFromClassNameOrId,
  useDialog,
  usePrevious,
  VisitDto,
} from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import {
  getInfantCurrentVisitSelector,
  getInfantById,
  getInfantVisitsSelector,
  getInfantNearestPreviousVisitByOrderDate,
} from '@/store/infant/infant.selectors';
import { infantThunkActions } from '@/store/infant';
import { InfantProfileParams } from '../infant-profile.types';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { InfantActions } from '@/store/infant/infant.actions';
import { differenceInDays } from 'date-fns';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { VisitModelInput } from '@ecdlink/graphql';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { visitSteps as walkthroughSteps } from './walkthrough/steps';
import { useCalendarAddEvent } from '@/pages/calendar/components/calendar-add-event/calendar-add-event';
import {
  canStartVisit,
  getVisitStatus,
  getVisitSubTitle,
  isVisitInProgress,
  isVisitMissed,
} from '@/helpers/visit-helpers';

const HEADER_HEIGHT = 64;

export const filterArrayBeforeId = (arr: VisitDto[], id: string) => {
  const sortedArray = arr.sort((a, b) => {
    const dataA = Date.parse(a.orderDate);
    const dataB = Date.parse(b.orderDate);

    return dataA - dataB;
  });

  const index = sortedArray.findIndex((obj) => obj.id === id);
  return index !== -1 ? sortedArray.slice(0, index) : [];
};

export const VisitsTab: React.FC = () => {
  const { height } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const { errorDialog } = useRequestResponseDialog();

  const calendarAddEvent = useCalendarAddEvent();

  const { id: infantId } = useParams<InfantProfileParams>();

  const previousInfantId = usePrevious(infantId);

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const visits = useSelector(getInfantVisitsSelector);
  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, '')
  );
  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, currentVisit)
  );
  const isFirstVisit = visits
    .filter((item) => item.visitType?.name !== 'additional_visits')
    .every((item) => !item.attended);

  const { isLoading } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_VISITS
  );
  const {
    isLoading: isAddingAdditionalVisit,
    isRejected: isRejectedAdditionalVisit,
  } = useThunkFetchCall(
    'infants',
    InfantActions.ADD_ADDITIONAL_VISIT_FOR_INFANT
  );

  const wasLoading = usePrevious(isLoading);
  const wasAddingAdditionalVisit = usePrevious(isAddingAdditionalVisit);

  const { infantName, caregiverName } = useMemo(
    () => ({
      infantName: infant?.user?.firstName,
      caregiverName: infant?.caregiver?.firstName,
    }),
    [infant?.caregiver?.firstName, infant?.user?.firstName]
  );

  // EC-685 - only show start visit button if today falls between planned and due date for current visit
  const todayEndOfTheDay = new Date();
  todayEndOfTheDay.setHours(23, 59, 59, 999);
  const todayDateWithoutTimeZone = getDateWithoutTimeZone(
    todayEndOfTheDay.toISOString()
  );

  const infantAgeDays = infant?.user?.dateOfBirth
    ? differenceInDays(todayEndOfTheDay, new Date(infant?.user?.dateOfBirth))
    : 0;

  const infantInsertedDate = useMemo(
    () => new Date(infant?.insertedDate || ''),
    [infant?.insertedDate]
  );

  const getSortedVisits = useCallback((visitsToSort: VisitDto[]) => {
    return visitsToSort.sort((a, b) => {
      if (a === undefined && b === undefined) {
        return 0;
      }
      if (a === undefined) {
        return -1;
      }
      if (b === undefined) {
        return 1;
      }

      if (a.visitType && b.visitType) {
        return (
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime() ||
          a.visitType.order - b.visitType.order!
        );
      } else {
        return (
          new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
        );
      }
    });
  }, []);

  const restartVisit = useCallback((existingVisitId: string) => {
    appDispatch(infantThunkActions.restartVisitForInfant({ existingVisitId }))
      .unwrap()
      .then((newVisit) =>
        history.push(`${location.pathname}/activities-form/${newVisit.id}`, {
          editView: true,
        })
      );
  }, []);

  const anyVisitInProgress = useMemo(() => {
    return visits.some((visit) => isVisitInProgress(visit));
  }, [visits]);

  const visitSteps = useMemo(() => {
    const activeAndFutureVisits = visits.filter((item) => {
      const dueDate = getDateWithoutTimeZone(item.dueDate);
      const plannedDate = getDateWithoutTimeZone(item.plannedVisitDate);

      if (item.attended || item.isCancelled) {
        return false;
      }

      if (!!dueDate && dueDate >= todayDateWithoutTimeZone!) {
        return true;
      }

      if (
        !dueDate &&
        !!plannedDate &&
        plannedDate >= todayDateWithoutTimeZone!
      ) {
        return true;
      }

      return false;
    });

    const sortedVisits = getSortedVisits(activeAndFutureVisits);
    const isToShowPastVisits = visits.length > activeAndFutureVisits.length;

    const array: StepItem[] = sortedVisits.map((item, index) => {
      const previousItem = index > 0 ? sortedVisits[index - 1] : undefined;

      const date = new Date(item.orderDate);
      date.setHours(0, 0, 0, 0);

      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      const isPreviousVisitMissed = previousItem && isVisitMissed(previousItem);
      const isCurrentVisitMissed = isVisitMissed(item);
      const checkPreviousVisit =
        !previousItem ||
        previousItem.attended ||
        previousItem.isCancelled ||
        isPreviousVisitMissed;

      return {
        title: isAdditionalVisit
          ? 'Other visit'
          : item.visitType?.normalizedName + ' visit' || 'Visit',
        subTitle: getVisitSubTitle(item),
        ...((isVisitMissed(item) || isAdditionalVisit) && {
          subTitleColor: 'alertDark',
        }),
        isAdditionalVisit: isAdditionalVisit,
        inProgressStepIcon: 'CalendarIcon',
        type: getVisitStatus(item),
        showActionButton:
          (checkPreviousVisit && (canStartVisit(item) || isFirstVisit)) ||
          (isAdditionalVisit && previousVisit?.attended),
        actionButtonIcon: 'ArrowCircleRightIcon',
        actionButtonText: !isCurrentVisitMissed ? 'Start visit' : 'Redo visit',
        actionButtonOnClick: () =>
          !isCurrentVisitMissed
            ? history.push(`${location.pathname}/activities-form/${item.id}`, {
                editView: true,
              })
            : restartVisit(item.id),
      };
    });

    array.unshift({
      title: isToShowPastVisits ? 'Past visits' : 'Folder opened',
      subTitle: isToShowPastVisits
        ? ''
        : `${infantInsertedDate.getDate()} ${infantInsertedDate.toLocaleString(
            'default',
            {
              month: 'long',
            }
          )} ${infantInsertedDate.getFullYear()}`,
      type: 'completed',
      showActionButton: isToShowPastVisits,
      actionButtonText: 'See info',
      actionButtonTextColor: 'secondary',
      actionButtonColor: 'secondaryAccent2',
      actionButtonOnClick: () =>
        history.push(`${location.pathname}/past-visits`),
    });

    return array;
  }, [
    getSortedVisits,
    history,
    infantInsertedDate,
    location.pathname,
    todayDateWithoutTimeZone,
    visits,
  ]);

  const isCompletedAllVisits = useMemo(
    () => visitSteps.length === 1,
    [visitSteps.length]
  );

  const onBookVisit = () => {
    calendarAddEvent({
      event: {
        participantUserIds: [infantId],
      },
    });
  };

  const onAddVisit = useCallback(() => {
    return dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render(onClose) {
        return (
          <ActionModal
            className={'z-10 mx-4'}
            title="Do you want to start the additional visit now or book a time in your calendar?"
            actionButtons={[
              {
                text: 'Start visit now',
                colour: 'primary',
                onClick: async () => {
                  const input: VisitModelInput = {
                    infantId,
                    plannedVisitDate: new Date().toISOString(),
                    actualVisitDate: new Date().toISOString(),
                    attended: false,
                  };

                  const response = await appDispatch(
                    infantThunkActions.addAdditionalVisitForInfant(input)
                  );

                  const otherVisit =
                    (response.payload as VisitDto) || undefined;
                  if (otherVisit?.id) {
                    history.push(
                      `${location.pathname}/activities-form/${otherVisit?.id}`,
                      {
                        editView: true,
                      }
                    );
                  }

                  onClose();
                },
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'HomeIcon',
              },
              {
                text: 'Book a visit',
                colour: 'primary',
                onClick: () => {
                  onClose();
                  onBookVisit();
                },
                type: 'outlined',
                textColour: 'primary',
                leadingIcon: 'CalendarIcon',
              },
            ]}
          />
        );
      },
    });
  }, [appDispatch, dialog, history, infantId, location.pathname]);

  const onRecordEvent = useCallback(
    () => history.push(`${location.pathname}/record-event`),
    [history, location.pathname]
  );

  const on1000days = useCallback(
    () =>
      dialog({
        blocking: false,
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onClose) => {
          return (
            <ActionModal
              className="z-50"
              title="Great job!"
              detailText={`You supported ${infantName} ${
                !caregiverName ? 'and' + caregiverName : ''
              } through the First 1000 Days and ensured ${infantName} has the best possible start in life.

          You can continue to visit and support this family.`}
              customIcon={
                <div>
                  <PollyImpressed className="mb-3 h-24 w-24" />
                </div>
              }
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Close',
                  textColour: 'primary',
                  type: 'outlined',
                  leadingIcon: 'XIcon',
                  onClick: onClose,
                },
              ]}
            />
          );
        },
      }),
    [caregiverName, dialog, infantName]
  );

  const renderContent = useMemo(() => {
    if (isLoading || isAddingAdditionalVisit) {
      return (
        <LoadingSpinner
          size="big"
          spinnerColor="white"
          backgroundColor="secondary"
          className="mb-7"
        />
      );
    }

    return (
      <>
        {isCompletedAllVisits && (
          <SuccessCard
            className="mb-7"
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text="Finished all visits!"
            color="successMain"
          />
        )}
        <Steps items={visitSteps.slice(0, 3)} />
      </>
    );
  }, [isAddingAdditionalVisit, isCompletedAllVisits, isLoading, visitSteps]);

  useEffect(() => {
    if (!wasAddingAdditionalVisit && isAddingAdditionalVisit) {
      return dialog({
        color: 'transparent',
        render: () => {},
      });
    }
  }, [dialog, isAddingAdditionalVisit, wasAddingAdditionalVisit]);

  useEffect(() => {
    if (wasAddingAdditionalVisit && isRejectedAdditionalVisit) {
      errorDialog();
    }
  }, [errorDialog, isRejectedAdditionalVisit, wasAddingAdditionalVisit]);

  useEffect(() => {
    if (
      wasLoading &&
      !isLoading &&
      infantAgeDays >= 1000 &&
      !infant?.completed24MonthVisits
    ) {
      if (isCompletedAllVisits) {
        on1000days();
      }

      appDispatch(
        infantThunkActions.updateInfant({
          id: infantId,
          input: {
            completed24MonthVisits: true,
            dateOfBirth: infant?.user?.dateOfBirth,
          },
        })
      );
    }
  }, [
    appDispatch,
    infant?.completed24MonthVisits,
    infant?.user?.dateOfBirth,
    infantAgeDays,
    infantId,
    isCompletedAllVisits,
    isLoading,
    on1000days,
    wasLoading,
  ]);

  useEffect(() => {
    if (!previousInfantId && !!infantId) {
      appDispatch(infantThunkActions.getInfantVisits({ infantId }));
      /////////////////////////////////////////////////////////////////////////////
      // TODO: integrate EC-1110 (new child event) and EC-1593 (new pregnant event)
      // appDispatch(infantThunkActions.getEventRecordByClientId({clientId: infantId}))
      /////////////////////////////////////////////////////////////////////////////
    }
  }, [appDispatch, infantId, previousInfantId]);

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
      <div id={getStringFromClassNameOrId(walkthroughSteps[1].target)}>
        <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
          <RoundIcon
            imageUrl={Infant}
            backgroundColor="tertiary"
            className="row-span-3"
          />
          <div>
            <Typography
              type="h2"
              align="left"
              weight="bold"
              text={`${
                infant?.caregiver?.firstName
                  ? infant?.caregiver?.firstName + ' & '
                  : ''
              }${infant?.user?.firstName || ''} `}
              color="textDark"
              className="col-span-2"
            />
          </div>
        </div>
        <div className="px-4 pb-4 pt-7">{renderContent}</div>
      </div>
      {!anyVisitInProgress && (
        <div className="px-4">
          <Divider dividerType="dashed" />
          <div className="my-4 flex items-center gap-3">
            <div className="flex flex-col">
              <Typography
                type="h4"
                align="left"
                weight="bold"
                text="Other visit"
                color="textDark"
              />
              <Typography
                type="body"
                align="left"
                weight="skinny"
                text="Use this if the client needs additional support from you"
                color="textMid"
                className="text-sm"
              />
            </div>
            <Button
              type="outlined"
              color="primary"
              icon="PlusIcon"
              className="h-10 w-48"
              onClick={onAddVisit}
            >
              Add Visit
            </Button>
          </div>
          <Divider dividerType="dashed" />
        </div>
      )}
      <div className="mx-4 mt-7 mb-4 flex h-full items-end">
        <Button
          id={getStringFromClassNameOrId(walkthroughSteps[2].target)}
          type="outlined"
          color="primary"
          icon="ClipboardCheckIcon"
          className="w-full "
          onClick={onRecordEvent}
        >
          Record an event
        </Button>
      </div>
    </div>
  );
};
