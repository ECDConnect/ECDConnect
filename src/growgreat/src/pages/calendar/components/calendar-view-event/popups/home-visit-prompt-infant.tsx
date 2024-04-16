import { useAppDispatch } from '@/store';
import { infantThunkActions } from '@/store/infant';
import {
  getInfantById,
  getInfantCurrentVisitSelector,
  getInfantNearestPreviousVisitByOrderDate,
  getInfantVisitsSelector,
} from '@/store/infant/infant.selectors';
import { RootState } from '@/store/types';
import { VisitDto, getDateWithoutTimeZone } from '@ecdlink/core';
import { ActionModal, Dialog, DialogPosition, StepItem } from '@ecdlink/ui';
import { ActionModalButton } from '@ecdlink/ui/lib/components/action-modal/models/ActionModalButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

interface HomeVisitPromptProps {
  clientId: string;
  startVisit: (type: 'planned' | 'other') => void;
}

export const HomeVisitPromptInfant = (props: HomeVisitPromptProps) => {
  const appDispatch = useAppDispatch();
  const [actionButtons, setActionButtons] = useState<ActionModalButton[]>([]);

  const infant = useSelector((state: RootState) =>
    getInfantById(state, props.clientId)
  );

  const visits = useSelector(getInfantVisitsSelector).filter(
    (v) => v.visitType?.name !== 'additional_visits'
  );
  const currentVisit = useSelector((state: RootState) =>
    getInfantCurrentVisitSelector(state, '')
  );
  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, currentVisit)
  );

  // EC-685 - only show start visit button if today falls between planned and due date for current visit
  const todayEndOfTheDay = new Date();
  todayEndOfTheDay.setHours(23, 59, 59, 999);
  const todayDateWithoutTimeZone = getDateWithoutTimeZone(
    todayEndOfTheDay.toISOString()
  );

  const plannedVisitDate =
    currentVisit && new Date(currentVisit?.plannedVisitDate);
  plannedVisitDate?.setHours(0, 0, 0, 0);
  const dueDate = currentVisit && new Date(currentVisit?.dueDate);
  dueDate?.setHours(0, 0, 0, 0);
  const isWeekDeadline =
    plannedVisitDate &&
    dueDate &&
    todayEndOfTheDay >= plannedVisitDate &&
    todayDateWithoutTimeZone! <= dueDate;

  const infantInsertedDate = useMemo(
    () => new Date(infant?.insertedDate || ''),
    [infant?.insertedDate]
  );

  const getType = useCallback(
    (item: VisitDto): StepItem['type'] => {
      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      if (item.attended) {
        return 'completed';
      }

      if (
        (isWeekDeadline && currentVisit.visitType?.id === item.visitType?.id) ||
        (isAdditionalVisit && previousVisit?.attended)
      ) {
        return 'inProgress';
      }

      return 'todo';
    },
    [currentVisit, isWeekDeadline, previousVisit?.attended]
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

  const getSubTitle = useCallback(
    (item: VisitDto, isAdditionalVisit: boolean, date: Date): string => {
      if (isAdditionalVisit && item.comment) {
        return item.comment;
      }

      return `By ${date.getDate()} ${date.toLocaleString('default', {
        month: 'long',
      })} ${date.getFullYear()}`;
    },
    []
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

    const array: StepItem[] = sortedVisits.map((item, index) => {
      const previousItem = index > 0 ? sortedVisits[index - 1] : undefined;

      const date = new Date(item.orderDate);
      date.setHours(0, 0, 0, 0);

      const isAdditionalVisit =
        item.visitType?.normalizedName === 'Additional visits';

      return {
        title: isAdditionalVisit
          ? 'Other visit'
          : item.visitType?.normalizedName + ' visit' || 'Visit',
        subTitle: getSubTitle(item, isAdditionalVisit, date),
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
        actionButtonOnClick: () => {},
      };
    });
    return array;
  }, [
    getSortedVisits,
    getSubTitle,
    getType,
    infantInsertedDate,
    todayDateWithoutTimeZone,
    visits,
  ]);

  useEffect(() => {
    appDispatch(
      infantThunkActions.getInfantVisits({ infantId: props.clientId })
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
          text: nextVisit.title || '',
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
