import React, { useCallback, useLayoutEffect } from 'react';
import { useWindowSize } from '@reach/window-size';

import {
  ActionModal,
  Button,
  DialogPosition,
  Divider,
  RoundIcon,
  StepItem,
  Steps,
  Typography,
} from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { useHistory, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { getMotherById } from '@/store/mother/mother.selectors';
import { getWeeksPregnant } from '@/utils/mom/pregnant.utils';
import { useAppDispatch } from '@/store';
import { motherThunkActions } from '@/store/mother';
import { useDialog } from '@ecdlink/core';

const HEADER_HEIGHT = 64;

const MOCK_DATA = {
  name: 'Lethabo Nkosi',
  weeks: 10,
  folderOpened: new Date('03-28-2022'),
  visit1: new Date('04-04-2022'),
  visit2: new Date('06-20-2022'),
};

const MOCK_VISITS: StepItem[] = [
  {
    title: 'Folder opened (Static data)',
    subTitle: `By ${MOCK_DATA.folderOpened.getDate()} ${MOCK_DATA.folderOpened.toLocaleString(
      'default',
      { month: 'long' }
    )} ${MOCK_DATA.folderOpened.getFullYear()}`,
    type: 'completed',
  },
  {
    title: 'Visit 1 (Static data)',
    subTitle: `By ${MOCK_DATA.visit1.getDate()} ${MOCK_DATA.visit1.toLocaleString(
      'default',
      { month: 'long' }
    )} ${MOCK_DATA.visit1.getFullYear()}`,
    inProgressStepIcon: 'CalendarIcon',
    type: 'inProgress',
    showActionButton: true,
    actionButtonIcon: 'ArrowCircleRightIcon',
    actionButtonText: 'Start visit',
  },
  {
    title: 'Visit 2 (Static data)',
    subTitle: `By ${MOCK_DATA.visit2.getDate()} ${MOCK_DATA.visit2.toLocaleString(
      'default',
      { month: 'long' }
    )} ${MOCK_DATA.visit2.getFullYear()}`,
    type: 'todo',
  },
];

export const Visits: React.FC = () => {
  const { height } = useWindowSize();

  const history = useHistory();

  const location = useLocation();

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const [, , , motherId] = location.pathname.split('/');

  const mother = useSelector((state: RootState) =>
    getMotherById(state, motherId)
  );

  const weeksPregnant = mother?.expectedDateOfDelivery
    ? getWeeksPregnant(mother?.expectedDateOfDelivery)
    : 1;

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
                  history.push(`${location.pathname}/start-visit`);
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
    appDispatch(motherThunkActions.getMotherVisits({ motherId })).unwrap();
  }, [appDispatch, motherId]);

  return (
    <div className="flex flex-col" style={{ height: height - HEADER_HEIGHT }}>
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
        <Steps items={MOCK_VISITS} />
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
