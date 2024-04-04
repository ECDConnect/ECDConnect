import {
  ActionModal,
  Alert,
  Button,
  Typography,
  DialogPosition,
  renderIcon,
} from '@ecdlink/ui';
import { DateFormats } from '../../../../../../constants/Dates';
import {
  getActivityIdForRoutineItem,
  getProgrammeWeeks,
  getRoutineItemType,
} from '@utils/classroom/programme-planning/programmes.utils';
import { useHistory } from 'react-router';
import { DailyRoutineProps } from './daily-routine.types';
import { useSelector } from 'react-redux';
import { programmeRoutineSelectors } from '@store/content/programme-routine';
import {
  DailyProgrammeDto,
  ProgrammeRoutineItemDto,
  useDialog,
} from '@ecdlink/core';
import { MessageBoard } from '../../../components/message-board/message-board';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';
import ActivityDetails from '../../../components/activities/activity/activity-details/activity-details';
import StoryActivityDetails from '../../../components/activities/storybooks/story-activity-details/story-activity-details';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../../../modals/offline-sync/online-only-modal';
import { programmeActions } from '@store/programme';
import { useAppDispatch } from '@store';
import ActivitySearch from '../../../components/activities/activity/activity-search/activity-search';
import { getFirstActivityByType } from '@utils/classroom/programme-planning/activity-search.utils';
import { StoryActivitySearch } from '../../../components/activities/storybooks/story-activity-search/story-activity-search';
import { useProgrammePlanningRecommendations } from '@hooks/useProgrammePlanningRecommendations';
import { useHolidays } from '@hooks/useHolidays';
import { useEffect, useState } from 'react';
import { PublicHolidayIndicator } from '../../../programme-routine/components/public-holiday-indicator/public-holiday-indicator';
import ROUTES from '@routes/routes';
import { ProgrammePlanningHeaderUpdated } from '../../../components/programme-planning-header-updated/programme-planning-header-updated';
import { ProgrammePlanningRoutineListItemUpdated } from '../../../components/programme-planning-routine-list-item-updated/programme-planning-routine-list-item-updated';
import { programmeThemeSelectors } from '@/store/content/programme-theme';

export const DailyRoutine: React.FC<DailyRoutineProps> = ({
  programme,
  currentDailyProgramme,
  setSelectedDate,
  selectedDate,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const programmeRoutine = useSelector(
    programmeRoutineSelectors.getProgrammeRoutineById(1)
  );
  const programmeWeeks = getProgrammeWeeks(programme);
  const appDispatch = useAppDispatch();
  const dialog = useDialog();
  const currentDate = new Date();
  const { getCurrentProgrammeRecommendedActivities } =
    useProgrammePlanningRecommendations();
  const recommendedActivities =
    getCurrentProgrammeRecommendedActivities(programme);
  const routineContainsIncompleteDays =
    programmeWeeks.filter((week) => week.totalIncompleteDays > 0).length > 0;
  const isCurrentDayEmpty =
    !currentDailyProgramme?.largeGroupActivityId &&
    !currentDailyProgramme?.smallGroupActivityId &&
    !currentDailyProgramme?.storyActivityId;
  const { isHoliday } = useHolidays();
  const [isCurrentDayHoliday, setIsCurrentDayHoliday] = useState(false);
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const chosedTheme = themes?.find((item) => item?.name === programme?.name);

  useEffect(() => {
    setIsCurrentDayHoliday(isHoliday(new Date()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProgramme = () => {
    if (isOnline) {
      history.push(ROUTES.PROGRAMMES.THEME);
    } else {
      showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const handleViewProgrammeSummary = () => {
    history.push(ROUTES.PROGRAMMES.SUMMARY, {
      variation: 'view',
    });
  };

  const openInfoItem = (routineItem: ProgrammeRoutineItemDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={routineItem.name}
            importantText={`${routineItem.timeSpan}`}
            detailText={routineItem.description}
            icon={'InformationCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'infoBb'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'primary',
                onClick: onClose,
                type: 'filled',
                textColour: 'white',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  };

  const openActivityItem = (routineItem: ProgrammeRoutineItemDto) => {
    const activityId = getActivityIdForRoutineItem(
      routineItem.name,
      currentDailyProgramme
    );

    if (!activityId) {
      onEditActivityItem(routineItem);
      return;
    }

    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return routineItem.name !== DailyRoutineItemType.storyBook ? (
          <ActivityDetails
            activityId={activityId}
            isSelected={false}
            disabled={true}
            onActivitySelected={() => {}}
            onActivityChanged={() => {}}
            onBack={onClose}
          />
        ) : (
          <StoryActivityDetails
            selected={false}
            activityId={activityId}
            disabled={true}
            viewType={'StoryActivity'}
            onBack={onClose}
          />
        );
      },
    });
  };

  const onMessageBoardUpdated = (message: string) => {
    if (!currentDailyProgramme) return;

    const currentDayCopy = { ...currentDailyProgramme };

    currentDayCopy.messageBoardText = message;

    saveCurrentDay(currentDayCopy);
  };

  const openMessageBoardItem = (routineItem: ProgrammeRoutineItemDto) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return (
          <MessageBoard
            message={currentDailyProgramme?.messageBoardText}
            routineItem={routineItem}
            date={new Date(currentDailyProgramme?.dayDate || Date.now())}
            onSave={(message: string) => {
              onMessageBoardUpdated(message);
              onSubmit();
            }}
            onClose={onClose}
          />
        );
      },
    });
  };

  const onProgrammeClick = (routineItem: ProgrammeRoutineItemDto) => {
    if (routineItem.name === DailyRoutineItemType.messageBoard) {
      openMessageBoardItem(routineItem);
      return;
    }

    if (
      routineItem.name === DailyRoutineItemType.freePlay ||
      routineItem.name === DailyRoutineItemType.greeting
    ) {
      openInfoItem(routineItem);
      return;
    }

    openActivityItem(routineItem);
  };

  const onActivitySelected = (
    routineItem: ProgrammeRoutineItemDto,
    activityId?: number
  ) => {
    if (!currentDailyProgramme) return;

    const currentDayCopy = { ...currentDailyProgramme };

    switch (routineItem.name) {
      case DailyRoutineItemType.largeGroup:
        currentDayCopy.largeGroupActivityId = activityId;
        break;
      case DailyRoutineItemType.smallGroup:
        currentDayCopy.smallGroupActivityId = activityId;
        break;
    }

    saveCurrentDay(currentDayCopy);
  };
  const onStoryAndActivitySelected = (
    storyId?: number,
    activityId?: number
  ) => {
    if (!currentDailyProgramme) return;

    const currentDayCopy = { ...currentDailyProgramme };

    currentDayCopy.storyBookId = storyId;
    currentDayCopy.storyActivityId = activityId;

    saveCurrentDay(currentDayCopy);
  };

  const onEditActivityItem = (routineItem: ProgrammeRoutineItemDto) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return routineItem.name !== DailyRoutineItemType.storyBook ? (
          <ActivitySearch
            title={routineItem.name}
            subtitle={`${new Date(
              currentDailyProgramme?.dayDate || new Date()
            ).toLocaleString('en-ZA', DateFormats.dayWithLongMonthName)}`}
            programmeId={programme?.id}
            preSelectedActivityId={
              routineItem.name === DailyRoutineItemType.largeGroup
                ? currentDailyProgramme?.largeGroupActivityId
                : currentDailyProgramme?.smallGroupActivityId
            }
            recommendedActivity={getFirstActivityByType(
              recommendedActivities,
              getRoutineItemType(routineItem.name)
            )}
            routineItem={routineItem}
            onSave={(activityId?: number) => {
              onActivitySelected(routineItem, activityId);
              onSubmit();
            }}
            onClose={onClose}
          />
        ) : (
          <StoryActivitySearch
            preSelectedStoryId={currentDailyProgramme?.storyBookId}
            preSelectedActivityId={currentDailyProgramme?.storyActivityId}
            programmeId={programme?.id}
            routineItem={routineItem}
            title={`Story & activity`}
            subtitle={new Date(
              currentDailyProgramme?.dayDate || new Date()
            ).toLocaleString('en-ZA', DateFormats.dayWithLongMonthName)}
            onSave={(storyId?: number, activityId?: number) => {
              onStoryAndActivitySelected(storyId, activityId);
              onSubmit();
            }}
            onClose={onClose}
          />
        );
      },
    });
  };

  const saveCurrentDay = (day: DailyProgrammeDto) => {
    if (!day) return;

    appDispatch(
      programmeActions.updateProgrammeDay({
        programmeId: programme?.id || '',
        programmeDay: day,
      })
    );
  };

  return (
    <div className={'flex flex-col pt-4'}>
      <ProgrammePlanningHeaderUpdated
        headerText={`Today's daily Routine`}
        subHeaderText={currentDate}
        themeName={programme?.name || 'No theme'}
        theme={programme}
        showCount={false}
        plannedWeeks={
          programmeWeeks.filter((week) => week.totalIncompleteDays === 0).length
        }
        totalWeeks={programmeWeeks.length}
        chosedTheme={chosedTheme}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />

      <div className={'items-centers flex w-full flex-row p-4'}>
        <Button
          className={'w-1/2'}
          size="small"
          type={'outlined'}
          color={'primary'}
          onClick={handleViewProgrammeSummary}
        >
          {renderIcon('CalendarIcon', 'h-5 w-5 text-primary')}
          <Typography
            type={'small'}
            color={'primary'}
            text={'Programme summary'}
          />
        </Button>
        <Button
          id="gtm-add-programme"
          className={'ml-2 w-1/2'}
          size="small"
          type={'filled'}
          color={'primary'}
          onClick={handleAddProgramme}
        >
          {renderIcon('PlusIcon', 'h-5 w-5 text-white')}
          <Typography type={'small'} color={'white'} text={'Add new theme'} />
        </Button>
      </div>

      {!isCurrentDayEmpty &&
        routineContainsIncompleteDays &&
        !isCurrentDayHoliday && (
          <Alert
            className={'mx-4 mb-4'}
            type={'warning'}
            title={'There are incomplete days in your programme.'}
            message={'Tap on Programme summary to complete your programme.'}
          />
        )}

      {isCurrentDayEmpty && !isCurrentDayHoliday && (
        <Alert
          className={'mx-4'}
          type={'warning'}
          title={'You don’t have a plan for today'}
          message={'Add activities to your daily routine!'}
        />
      )}

      {currentDailyProgramme &&
        (isCurrentDayHoliday ? (
          <PublicHolidayIndicator
            date={new Date(currentDailyProgramme.dayDate)}
          />
        ) : (
          <div className="mt-4">
            {programmeRoutine?.routineItems.map((routineItem) => (
              <ProgrammePlanningRoutineListItemUpdated
                key={`id_${routineItem.id}`}
                routineItem={routineItem}
                day={currentDailyProgramme}
                onClick={() => onProgrammeClick(routineItem)}
              />
            ))}
          </div>
        ))}
    </div>
  );
};
