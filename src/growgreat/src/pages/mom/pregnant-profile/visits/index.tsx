import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
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
import Pregnant from '@/assets/pregnant.svg';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import {
  getMotherById,
  getMotherVisits,
  getMotherNearestPreviousVisitByOrderDate,
} from '@/store/mother/mother.selectors';
import { getPregnancyWeeks } from '@/utils/mom/pregnant.utils';
import { useAppDispatch } from '@/store';
import { motherThunkActions } from '@/store/mother';
import {
  getDateWithoutTimeZone,
  getStringFromClassNameOrId,
  useDialog,
  usePrevious,
  VisitDto,
} from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { MotherActions } from '@/store/mother/mother.actions';
import { VisitModelInput } from '@/../../../packages/graphql/lib';
import { useRequestResponseDialog } from '@/hooks/useRequestResponseDialog';
import { visitSteps as walkthroughSteps } from './walkthrough/steps';

const HEADER_HEIGHT = 64;

export const Visits: React.FC = () => {
  const { height } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const { errorDialog } = useRequestResponseDialog();

  const [, , , motherId] = location.pathname.split('/');

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const visits = useSelector(getMotherVisits);

  const { isLoading } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHER_VISITS
  );
  const {
    isLoading: isAddingAdditionalVisit,
    isRejected: isRejectedAdditionalVisit,
  } = useThunkFetchCall(
    'mothers',
    MotherActions.ADD_ADDITIONAL_VISIT_FOR_MOTHER
  );

  const { isLoading: isLoadingAddAdditionalVisit } = useThunkFetchCall(
    'mothers',
    MotherActions.ADD_ADDITIONAL_VISIT_FOR_MOTHER
  );
  const wasAddingAdditionalVisit = usePrevious(isAddingAdditionalVisit);

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

  const todayEndOfTheDay = new Date();
  todayEndOfTheDay.setHours(23, 59, 59, 999);
  const todayDateWithoutTimeZone = getDateWithoutTimeZone(
    todayEndOfTheDay.toISOString()
  );

  const currentVisit = useMemo((): VisitDto | undefined => {
    const noAttended =
      visits.filter((item) => {
        const dueDate = getDateWithoutTimeZone(item.dueDate);
        const orderDate = getDateWithoutTimeZone(item.orderDate);
        const isAttend = item.attended;

        if (dueDate) {
          return !isAttend && dueDate >= todayDateWithoutTimeZone!;
        }

        if (orderDate) {
          return !isAttend && orderDate >= todayDateWithoutTimeZone!;
        }

        return !isAttend;
      }) || [];

    return noAttended.length
      ? noAttended.reduce((prev, curr) =>
          (prev.visitType?.order ?? 0) < (curr.visitType?.order ?? 0)
            ? prev
            : curr
        )
      : undefined;
  }, [todayDateWithoutTimeZone, visits]);

  // INFO: EC-685 - only show start visit button if today falls between planned and due date for current visit
  const plannedVisitDate =
    currentVisit && new Date(currentVisit?.plannedVisitDate);
  plannedVisitDate?.setHours(0, 0, 0, 0);
  const dueDate = currentVisit?.dueDate
    ? new Date(currentVisit?.dueDate)
    : todayEndOfTheDay;
  dueDate?.setHours(0, 0, 0, 0);

  const isFirstVisit = visits
    .filter((item) => item.visitType?.name !== 'additional_visits')
    .every((item) => !item.attended);
  const isOrderVisitDate =
    plannedVisitDate && todayEndOfTheDay >= plannedVisitDate;
  const isDueDate = dueDate && todayDateWithoutTimeZone! <= dueDate;
  const isDeadline = isFirstVisit || (isOrderVisitDate && isDueDate);
  const previousVisit = useSelector((state: RootState) =>
    getMotherNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  console.log({ dueDate, todayDateWithoutTimeZone });
  const weeksPregnant = useMemo(
    () =>
      mother?.expectedDateOfDelivery
        ? getPregnancyWeeks(mother?.expectedDateOfDelivery)
        : 0,
    [mother?.expectedDateOfDelivery]
  );

  const insertedDate = useMemo(
    () => new Date(mother?.insertedDate || ''),
    [mother?.insertedDate]
  );

  const getType = useCallback(
    (item: VisitDto): StepItem['type'] => {
      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      if (item.attended) {
        return 'completed';
      }
      if (
        (isDeadline && currentVisit?.visitType?.id === item.visitType?.id) ||
        (isAdditionalVisit && previousVisit?.attended)
      ) {
        return 'inProgress';
      }
      return 'todo';
    },
    [currentVisit?.visitType?.id, isDeadline, previousVisit?.attended]
  );

  const visitSteps = useMemo(() => {
    const filteredVisits = visits.filter((item) => {
      const dueDate = getDateWithoutTimeZone(item.dueDate);
      const orderDate = getDateWithoutTimeZone(item.orderDate);
      const isAttend = item.attended;
      if (dueDate) {
        return !isAttend && dueDate >= todayDateWithoutTimeZone!;
      }

      if (orderDate) {
        return !isAttend && orderDate >= todayDateWithoutTimeZone!;
      }

      return !isAttend;
    });

    const sortedVisits = getSortedVisits(filteredVisits);
    const isToShowPastVisits = visits.length > filteredVisits.length;

    const array: StepItem[] = sortedVisits.map((item, index) => {
      const previousItem = index > 0 ? sortedVisits[index - 1] : undefined;

      const orderDateString = item?.orderDate
        ? item?.orderDate?.split('T')?.[0]
        : item?.plannedVisitDate?.split('T')?.[0];
      const day = orderDateString?.split('-')?.[2];

      const orderDate = getDateWithoutTimeZone(orderDateString);

      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      return {
        title: isAdditionalVisit
          ? 'Other visit'
          : item.visitType?.normalizedName || 'Visit',
        subTitle:
          isAdditionalVisit && item.comment!
            ? item.comment
            : `By ${day} ${orderDate?.toLocaleString('default', {
                month: 'long',
              })} ${orderDate?.getFullYear()}`,
        ...(isAdditionalVisit && {
          subTitleColor: 'alertDark',
        }),
        inProgressStepIcon: 'CalendarIcon',
        type: getType(item),
        showActionButton:
          (!previousItem || previousItem?.attended) &&
          getType(item) === 'inProgress',
        actionButtonIcon: 'ArrowCircleRightIcon',
        actionButtonText: 'Start visit',
        actionButtonOnClick: () =>
          history.push(
            `${location.pathname}/activities-form/${currentVisit?.id}`,
            { editView: true }
          ),
      };
    });

    array.unshift({
      title: isToShowPastVisits ? 'Past visits' : 'Folder opened',
      subTitle: isToShowPastVisits
        ? ''
        : `${insertedDate.getDate()} ${insertedDate.toLocaleString('default', {
            month: 'long',
          })} ${insertedDate.getFullYear()}`,
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
    currentVisit,
    getSortedVisits,
    getType,
    history,
    insertedDate,
    location,
    todayDateWithoutTimeZone,
    visits,
  ]);

  const onAddVisit = useCallback(() => {
    return dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render(onClose) {
        return (
          <ActionModal
            className={'mx-4'}
            title="Do you want to start the additional visit now or book a time in your calendar?"
            actionButtons={[
              {
                text: 'Start visit now',
                colour: 'primary',
                isLoading: isLoadingAddAdditionalVisit,
                disabled: isLoadingAddAdditionalVisit,
                onClick: async () => {
                  const input: VisitModelInput = {
                    motherId,
                    plannedVisitDate: new Date().toISOString(),
                    actualVisitDate: new Date().toISOString(),
                    attended: false,
                  };
                  const response = await appDispatch(
                    motherThunkActions.addAdditionalVisitForMother(input)
                  );

                  const otherVisit =
                    (response.payload as VisitDto) || undefined;
                  if (otherVisit?.id) {
                    history.push(
                      `${location.pathname}/activities-form/${otherVisit?.id}`,
                      { editView: true }
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
                isLoading: isLoadingAddAdditionalVisit,
                disabled: isLoadingAddAdditionalVisit,
                onClick: () => {
                  history.push(`${location.pathname}/book-visit`);
                  onClose();
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
  }, [
    appDispatch,
    dialog,
    history,
    isLoadingAddAdditionalVisit,
    location.pathname,
    motherId,
  ]);

  const onRecordEvent = useCallback(
    () => history.push(`${location.pathname}/record-event`),
    [history, location.pathname]
  );

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

  useLayoutEffect(() => {
    appDispatch(motherThunkActions.getMotherVisits({ motherId })).unwrap();
  }, [appDispatch, motherId]);

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
      <div id={getStringFromClassNameOrId(walkthroughSteps[1].target)}>
        <div className="bg-uiBg mt-14 flex gap-2 p-4">
          <RoundIcon
            imageUrl={Pregnant}
            backgroundColor="tertiary"
            className="row-span-3"
          />
          <div>
            <Typography
              type="h2"
              align="left"
              weight="bold"
              text={`${mother?.user?.firstName || ''} ${
                mother?.user?.surname || ''
              }`}
              color="textDark"
              className="col-span-2"
            />
            <Typography
              className="col-span-2 row-span-2"
              type="body"
              align="left"
              weight="skinny"
              text={`${weeksPregnant} ${
                weeksPregnant > 1 ? 'weeks' : 'week'
              } pregnant`}
              color="textMid"
            />
          </div>
        </div>
        <div className="px-4 pb-4 pt-7">
          {isLoading ? (
            <LoadingSpinner
              size="big"
              spinnerColor="white"
              backgroundColor="secondary"
              className="mb-7"
            />
          ) : (
            <Steps items={visitSteps.slice(0, 3)} />
          )}
        </div>
      </div>
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
