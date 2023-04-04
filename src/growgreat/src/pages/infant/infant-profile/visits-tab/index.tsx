import React, { useCallback, useLayoutEffect, useMemo } from 'react';
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
import { useAppDispatch } from '@/store';
import { useDialog, VisitDto } from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { MotherActions } from '@/store/mother/mother.actions';
import {
  getInfantById,
  getInfantCurrentVisitSelector,
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { infantThunkActions } from '@/store/infant';

const HEADER_HEIGHT = 64;

export const VisitsTab: React.FC = () => {
  const { height } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const [, , , infantId] = location.pathname.split('/');

  const infant = useSelector((state: RootState) =>
    getInfantById(state, infantId)
  );

  const visits = useSelector(getInfantVisitsSelector);
  const currentVisit = useSelector(getInfantCurrentVisitSelector);

  const { isLoading } = useThunkFetchCall(
    'mothers',
    MotherActions.GET_MOTHER_VISITS
  );

  const currentDate = useMemo(() => new Date(), []);
  const next7Days = new Date(new Date().setDate(currentDate.getDate() + 7));
  const dateToCheck = currentVisit && new Date(currentVisit?.plannedVisitDate);

  const isWeekDeadline =
    dateToCheck && dateToCheck >= currentDate && dateToCheck <= next7Days;

  const insertedDate = useMemo(
    () => new Date(infant?.insertedDate || ''),
    [infant?.insertedDate]
  );

  const getType = useCallback(
    (item: VisitDto): StepItem['type'] => {
      if (item.attended) {
        return 'completed';
      }

      if (
        currentVisit &&
        item.visitType?.id === currentVisit.visitType?.id &&
        infant?.statusInfo?.color !== 'None'
      ) {
        return 'inProgress';
      }

      return 'todo';
    },
    [currentVisit, infant?.statusInfo?.color]
  );

  const filterArrayById = (arr: VisitDto[], id: string) => {
    const index = arr.findIndex((obj) => obj.id === id);
    return index !== -1 ? arr.slice(index) : [];
  };

  const visitSteps = useMemo(() => {
    const visitsFromCurrentVisit = filterArrayById(
      visits,
      currentVisit?.id || ''
    );
    const filteredVisits = visitsFromCurrentVisit.filter(
      (item) => !item.attended
    );
    const isPastVisits = visits.length > filteredVisits.length;

    const sortedVisits = filteredVisits.sort(
      (a, b) => (a.visitType?.order || 0) - (b.visitType?.order || 0)
    );

    const array: StepItem[] = sortedVisits.map((item) => {
      const date = new Date(item.plannedVisitDate);
      const isMissedVisit = date < currentDate;

      return {
        title: item.visitType?.normalizedName || 'Visit',
        subTitle: isMissedVisit
          ? 'Missed visit deadline'
          : `By ${date.getDate()} ${date.toLocaleString('default', {
              month: 'long',
            })} ${date.getFullYear()}`,
        ...(((isWeekDeadline &&
          currentVisit.visitType?.id === item.visitType?.id) ||
          isMissedVisit) && { subTitleColor: 'alertDark' }),
        inProgressStepIcon: isMissedVisit
          ? 'ExclamationCircleIcon'
          : 'CalendarIcon',
        type: getType(item),
        showActionButton: getType(item) === 'inProgress',
        actionButtonIcon: 'ArrowCircleRightIcon',
        actionButtonText: 'Start visit',
        actionButtonOnClick: () =>
          history.push(`${location.pathname}/activities-form/${item.id}`),
      };
    });

    array.unshift({
      title: isPastVisits ? 'Past visits' : 'Folder opened',
      subTitle: isPastVisits
        ? ''
        : `${insertedDate.getDate()} ${insertedDate.toLocaleString('default', {
            month: 'long',
          })} ${insertedDate.getFullYear()}`,
      type: 'completed',
      showActionButton: isPastVisits,
      actionButtonText: 'See info',
      actionButtonTextColor: 'secondary',
      actionButtonColor: 'secondaryAccent2',
      actionButtonOnClick: () =>
        history.push(`${location.pathname}/past-visits`),
    });

    return array;
  }, [
    currentDate,
    currentVisit,
    getType,
    history,
    insertedDate,
    isWeekDeadline,
    location.pathname,
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
                onClick: () => {
                  history.push(`${location.pathname}/book-visit`);
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
  }, [dialog, history, location.pathname]);

  const onRecordEvent = useCallback(
    () => history.push(`${location.pathname}/record-event`),
    [history, location.pathname]
  );

  useLayoutEffect(() => {
    appDispatch(infantThunkActions.getInfantVisits({ infantId })).unwrap();
  }, [appDispatch, infantId]);

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
      <div className="bg-uiBg mt-14 flex items-center gap-2 p-4">
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
