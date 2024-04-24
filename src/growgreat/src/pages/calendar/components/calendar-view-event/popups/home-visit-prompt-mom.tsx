import { useAppDispatch } from '@/store';
import { motherThunkActions } from '@/store/mother';
import {
  getMotherById,
  getMotherNearestPreviousVisitByOrderDate,
  getMotherVisits,
} from '@/store/mother/mother.selectors';
import { RootState } from '@/store/types';
import { getPregnancyWeeks } from '@/utils/mom/pregnant.utils';
import { VisitDto, getDateWithoutTimeZone } from '@ecdlink/core';
import { ActionModal, Dialog, DialogPosition, StepItem } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface HomeVisitPromptProps {
  clientId: string;
  startVisit: (type: 'planned' | 'other') => void;
}

export const HomeVisitPromptMom = (props: HomeVisitPromptProps) => {
  const appDispatch = useAppDispatch();
  const [actionButtons, setActionButtons] = useState<ActionModalButton[]>([]);

  const mother = useSelector((state: RootState) =>
    getMotherById(state, props.clientId)
  );

  const visits = useSelector(getMotherVisits).filter((v) =>
    v.visitType?.name?.startsWith('visit_')
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
    const filteredVisits = visits.filter((item) => !item.attended);

    const sortedVisits = getSortedVisits(filteredVisits);

    const array: StepItem[] = sortedVisits.map((item, index) => {
      const previousItem = index > 0 ? sortedVisits[index - 1] : undefined;

      const orderDateString = item?.orderDate
        ? item?.orderDate?.split('T')?.[0]
        : item?.plannedVisitDate?.split('T')?.[0];
      const day = orderDateString?.split('-')?.[2];

      const orderDate = getDateWithoutTimeZone(orderDateString);

      const isMissedVisit =
        orderDate?.getTime()! < todayDateWithoutTimeZone?.getTime()!;

      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      let subTitle = `By ${day} ${orderDate?.toLocaleString('default', {
        month: 'long',
      })} ${orderDate?.getFullYear()}`;

      if (isAdditionalVisit && item.comment) {
        subTitle = item.comment;
      }

      if (isMissedVisit && (!previousItem || previousItem?.attended)) {
        subTitle = 'Missed visit deadline';
      }

      return {
        title: isAdditionalVisit
          ? 'Other visit'
          : item.visitType?.normalizedName || 'Visit',
        subTitle,
        ...((isMissedVisit || isAdditionalVisit) && {
          subTitleColor: 'alertDark',
        }),
        inProgressStepIcon: 'CalendarIcon',
        type: getType(item),
        showActionButton:
          (!previousItem || previousItem?.attended) &&
          (getType(item) === 'inProgress' || isMissedVisit),
        actionButtonIcon: 'ArrowCircleRightIcon',
        actionButtonText: 'Start visit',
        actionButtonOnClick: () => {},
      };
    });

    return array;
  }, [
    getSortedVisits,
    getType,
    insertedDate,
    todayDateWithoutTimeZone,
    visits,
  ]);

  useEffect(() => {
    appDispatch(
      motherThunkActions.getMotherVisits({ motherId: props.clientId })
    ).unwrap();
  }, []);

  useEffect(() => {
    const buttonOther = {
      text: 'Other',
      textColour: 'primary',
      colour: 'primary',
      type: 'outlined',
      onClick: async () => await props.startVisit('other'),
      leadingIcon: 'ClipboardListIcon',
    } as ActionModalButton;
    if (!props.clientId) {
      setActionButtons([buttonOther]);
      return;
    }
    (async () => {
      const nextVisits = visitSteps.filter((x) => x.showActionButton);
      const nextVisit = nextVisits.length > 0 ? nextVisits[0] : undefined;
      const buttons: ActionModalButton[] = [];
      if (!!nextVisit) {
        buttons.push({
          text: nextVisit.title,
          textColour: 'primary',
          colour: 'primary',
          type: 'outlined',
          onClick: async () => await props.startVisit('planned'),
          leadingIcon: 'PresentationChartBarIcon',
        });
      }
      buttons.push(buttonOther);
      setActionButtons(buttons);
    })();
  }, [visitSteps]);

  return (
    <ActionModal
      importantText={`Which visit would you like to complete?`}
      actionButtons={actionButtons}
    />
  );
};
