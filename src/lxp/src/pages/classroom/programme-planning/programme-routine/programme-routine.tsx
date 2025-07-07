import {
  useDialog,
  DailyProgrammeDto,
  ProgrammeRoutineItemDto,
} from '@ecdlink/core/';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Card,
  DialogPosition,
  renderIcon,
  Typography,
  Dialog,
} from '@ecdlink/ui/';
import { useHistory, useLocation } from 'react-router';
import ActivitySearch from '../components/activities/activity/activity-search/activity-search';
import { WeekTab } from '../components/week-tab/week-tab';
import { useEffect, useState } from 'react';
import { ProgrammeRoutineRouteState } from './programme-routine.types';
import { SuccessCard } from '../../../../components/success-card/success-card';
import {
  getActivityIdForRoutineItem,
  getProgrammeWeeks,
  getRoutineItemType,
  getWeekBreakDown,
  isProgrammeRoutineDayComplete,
} from '@utils/classroom/programme-planning/programmes.utils';
import { DateFormats } from '../../../../constants/Dates';
import { useHolidays } from '@hooks/useHolidays';
import { ProgrammeWeekPaging } from './components/programme-week-paging/programme-week-paging';
import { useSelector } from 'react-redux';
import { programmeActions, programmeSelectors } from '@store/programme';
import { programmeRoutineSelectors } from '@store/content/programme-routine';
import { StoryActivitySearch } from '../components/activities/storybooks/story-activity-search/story-activity-search';
import { useAppDispatch } from '@store';
import { MessageBoard } from '../components/message-board/message-board';
import { PublicHolidayIndicator } from './components/public-holiday-indicator/public-holiday-indicator';
import { DailyRoutineItemType } from '@enums/ProgrammeRoutineType';
import { isDayInThePast } from '@utils/common/date.utils';
import { useProgrammePlanningRecommendations } from '@hooks/useProgrammePlanningRecommendations';
import {
  getFirstActivityByType,
  getRequiredActivitiesCount,
} from '@utils/classroom/programme-planning/activity-search.utils';
import ActivityDetails from '../components/activities/activity/activity-details/activity-details';
import StoryActivityDetails from '../components/activities/storybooks/story-activity-details/story-activity-details';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import OnlineOnlyModal from '../../../../modals/offline-sync/online-only-modal';
import { ProgrammePlanningHeaderUpdated } from '../components/programme-planning-header-updated/programme-planning-header-updated';
import { programmeThemeSelectors } from '@/store/content/programme-theme';
import { ProgrammePlanningRoutineListItemUpdated } from '../components/programme-planning-routine-list-item-updated/programme-planning-routine-list-item-updated';
import { ProgrammePlanningRoutineListItemNotCompleted } from '../components/programme-planning-routine-not-completed-list-item/programme-planning-routine-list-item-not-completed';
import PosiviteIcon from '../../../../assets/positive-bonus-emoticon.png';
import { practitionerSelectors } from '@/store/practitioner';
import walkthroughImage from '../../../../assets/walktroughImage.png';
import { parseISO } from 'date-fns';
import { useAppContext } from '@/walkthrougContext';
import { useUserPermissions } from '@/hooks/useUserPermissions';

export const ProgrammeRoutine: React.FC = () => {
  const { state } = useLocation<ProgrammeRoutineRouteState>();
  const { holidays } = useHolidays();
  const history = useHistory();
  const dialog = useDialog();
  const appDispatch = useAppDispatch();

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();

  const {
    state: { run: isWalkthrough },
  } = useAppContext();

  const { isOnline } = useOnlineStatus();
  const programme = useSelector(
    programmeSelectors.getProgrammeById(state.programmeId)
  );
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);
  const chosedTheme = themes?.find((item) => item?.name === programme?.name);
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);

  const prorgammeRoutine = useSelector(
    programmeRoutineSelectors.getProgrammeRoutineById(1)
  );
  const initialWeekIndex = state?.weekIndex;

  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(
    initialWeekIndex || 0
  );
  const [currentDay, setCurrentDay] = useState<DailyProgrammeDto>();
  const [displayDayCompletedCard, setDisplayDayCompletedCard] =
    useState<boolean>();
  const programmeWeeks = getProgrammeWeeks(programme);
  const [programmeWeekBreakdown, setProgrammeWeekBreakdown] = useState(
    getWeekBreakDown(programmeWeeks[activeWeekIndex], holidays, programme)
  );

  const activeBreakdown = programmeWeekBreakdown[activeDayIndex];

  const isDayCompleted = isProgrammeRoutineDayComplete(currentDay);
  const isWeekComplete =
    programmeWeeks[activeWeekIndex].totalIncompleteDays === 0;
  const isProgrammeCompleted =
    programmeWeeks.filter((week) => week.totalIncompleteDays === 0).length ===
    programmeWeeks.length;

  const [successMessage, setSuccessMessage] = useState(false);
  const allProgrammesPlanned =
    isDayCompleted &&
    isProgrammeCompleted &&
    isWeekComplete &&
    displayDayCompletedCard;

  const { getCurrentProgrammeRecommendedActivities } =
    useProgrammePlanningRecommendations();

  const recommendedActivities =
    getCurrentProgrammeRecommendedActivities(programme);
  const sortedRoutineItems = prorgammeRoutine?.routineItems
    ? [...prorgammeRoutine?.routineItems].sort((a, b) =>
        (a.sequence || 1) < (b.sequence || 0) ? -1 : 1
      )
    : [];
  const activityRequiredProgrammeRoutineItems = sortedRoutineItems.filter(
    (routineItem) =>
      routineItem.name === DailyRoutineItemType.smallGroup ||
      routineItem.name === DailyRoutineItemType.largeGroup ||
      routineItem.name === DailyRoutineItemType.storyBook
  );

  useEffect(() => {
    if (activeBreakdown) {
      setCurrentDay(activeBreakdown.programmeDay);
      setDisplayDayCompletedCard(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBreakdown]);

  useEffect(() => {
    const newWeekBreakdown = getWeekBreakDown(
      programmeWeeks[activeWeekIndex],
      holidays,
      programme
    );
    setProgrammeWeekBreakdown(newWeekBreakdown);

    let indexOfFirstValidDay = newWeekBreakdown.findIndex(
      (day) => !day.isCompleted && !day.isDisabled && !day.isHoliday
    );
    if (indexOfFirstValidDay < 0) {
      indexOfFirstValidDay = newWeekBreakdown.findIndex(
        (day) => day.isCompleted
      );
    }
    setActiveDayIndex(indexOfFirstValidDay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWeekIndex]);

  useEffect(() => {
    const newWeekBreakdown = getWeekBreakDown(
      programmeWeeks[activeWeekIndex],
      holidays,
      programme
    );
    setProgrammeWeekBreakdown(newWeekBreakdown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDay]);

  const onActivitySelected = (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto,
    activityId?: number
  ) => {
    if (!day) return;
    const currentDayCopy = { ...day };
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

  const saveCurrentDay = (day: DailyProgrammeDto) => {
    if (!day) return;

    appDispatch(
      programmeActions.updateProgrammeDay({
        programmeId: state.programmeId,
        programmeDay: day,
      })
    );

    setCurrentDay(day);

    editNextOutstandingActivity(day);
  };

  const editNextOutstandingActivity = (day: DailyProgrammeDto) => {
    const [
      smallGroupActivityId,
      largeGroupActivityId,
      storyBookId,
      storyActivityId,
    ] = [
      day.smallGroupActivityId,
      day.largeGroupActivityId,
      day.storyBookId,
      day.storyActivityId,
    ];

    const isLast = getRequiredActivitiesCount(day) <= 1;

    if (!smallGroupActivityId) {
      const routineItem = prorgammeRoutine?.routineItems.find(
        (x) => x.name === DailyRoutineItemType.smallGroup
      );

      if (routineItem) {
        onEditActivityItem(routineItem, day, isLast);
        return;
      }
    }

    if (!largeGroupActivityId) {
      const routineItem = prorgammeRoutine?.routineItems.find(
        (x) => x.name === DailyRoutineItemType.largeGroup
      );

      if (routineItem) {
        onEditActivityItem(routineItem, day, isLast);
        return;
      }
    }

    if (!storyBookId) {
      const routineItem = prorgammeRoutine?.routineItems.find(
        (x) => x.name === DailyRoutineItemType.storyBook
      );

      if (routineItem) {
        onEditActivityItem(routineItem, day, isLast);
        return;
      }
    }

    if (!storyActivityId) {
      const routineItem = prorgammeRoutine?.routineItems.find(
        (x) => x.name === DailyRoutineItemType.storyBook
      );

      if (routineItem) {
        onEditActivityItem(routineItem, day, isLast);
        return;
      }
    }
  };

  const onStoryAndActivitySelected = (
    storyId?: number,
    day?: DailyProgrammeDto,
    activityId?: number
  ) => {
    if (!day) return;

    const currentDayCopy = { ...day };

    currentDayCopy.storyBookId = storyId;
    currentDayCopy.storyActivityId = activityId;

    saveCurrentDay(currentDayCopy);
  };

  const onMessageBoardUpdated = (message: string) => {
    if (!currentDay) return;

    const currentDayCopy = { ...currentDay };

    currentDayCopy.messageBoardText = message;

    saveCurrentDay(currentDayCopy);
  };

  const onProgrammeClick = (routineItem: ProgrammeRoutineItemDto) => {
    if (isWalkthrough) return;

    const routineItemName = routineItem?.name;

    const currentDayDate = currentDay?.dayDate
      ? new Date(currentDay?.dayDate)
      : new Date();

    const currentDayIsInPast = isDayInThePast(currentDayDate, new Date());

    if (routineItemName === DailyRoutineItemType.messageBoard) {
      onEditMessageBoard(routineItem, !currentDayIsInPast);
      return;
    }

    if (
      routineItemName === DailyRoutineItemType.freePlay ||
      routineItemName === DailyRoutineItemType.greeting
    ) {
      onViewStaticItems(routineItem);
      return;
    }
    const isLast = getRequiredActivitiesCount(currentDay) <= 1;
    if (!currentDayIsInPast) {
      if (!isOnline) {
        showOnlineOnly();
        return;
      }

      if (currentDay && !isDayCompleted) {
        onEditActivityItem(routineItem, currentDay, isLast);
      } else {
        openActivityDetails(routineItem, currentDay, isLast);
      }
    } else {
      openActivityDetails(routineItem, currentDay, isLast);
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

  const onEditActivityItem = (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto,
    isLast?: boolean
  ) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return routineItem.name !== DailyRoutineItemType.storyBook ? (
          <ActivitySearch
            title={routineItem.name}
            subtitle={`${new Date(day?.dayDate || new Date()).toLocaleString(
              'en-ZA',
              DateFormats.dayWithLongMonthName
            )}`}
            date={day?.dayDate ? parseISO(day.dayDate) : new Date()}
            programmeId={programme?.id}
            submitButtonText={isLast ? 'Save' : 'Save & continue'}
            preSelectedActivityId={
              routineItem.name === DailyRoutineItemType.largeGroup
                ? day?.largeGroupActivityId
                : day?.smallGroupActivityId
            }
            recommendedActivity={getFirstActivityByType(
              recommendedActivities,
              getRoutineItemType(routineItem.name)
            )}
            routineItem={routineItem}
            onSave={(activityId?: number) => {
              onSubmit();
              onActivitySelected(routineItem, day, activityId);
            }}
            onClose={onClose}
          />
        ) : (
          <StoryActivitySearch
            preSelectedStoryId={day?.storyBookId}
            preSelectedActivityId={day?.storyActivityId}
            programmeId={programme?.id}
            routineItem={routineItem}
            subtitle={new Date(day?.dayDate || new Date()).toLocaleString(
              'en-ZA',
              DateFormats.dayWithLongMonthName
            )}
            onSave={(storyId?: number, activityId?: number) => {
              onSubmit();
              onStoryAndActivitySelected(storyId, day, activityId);
            }}
            onClose={onClose}
          />
        );
      },
    });
  };

  const onEditMessageBoard = (
    routineItem: ProgrammeRoutineItemDto,
    canEdit: boolean
  ) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return (
          <MessageBoard
            disabled={!canEdit}
            message={currentDay?.messageBoardText}
            routineItem={routineItem}
            date={new Date(currentDay?.dayDate || 0)}
            onSave={(message: string) => {
              if (canEdit) onMessageBoardUpdated(message);
              onSubmit();
            }}
            onClose={onClose}
          />
        );
      },
    });
  };

  const onViewStaticItems = (routineItem: ProgrammeRoutineItemDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={routineItem.name}
            importantText={`${routineItem.timeSpan} minutes`}
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

  const openActivityDetails = (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto,
    isLast?: boolean
  ) => {
    const activityId = getActivityIdForRoutineItem(routineItem.name, day);

    if (!activityId) return;

    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return routineItem.name !== DailyRoutineItemType.storyBook ? (
          <ActivityDetails
            activityId={activityId}
            isSelected={true}
            disabled={false}
            onActivitySelected={() => {
              onClose();
            }}
            onActivityChanged={() => {
              onClose();
              onEditActivityItem(routineItem, day, isLast);
            }}
            onBack={onClose}
          />
        ) : (
          <StoryActivityDetails
            selected={true}
            activityId={activityId}
            disabled={false}
            viewType={'StoryActivity'}
            onActivitySelected={onClose}
            onStoryBookSwitched={() => {
              onClose();
              onEditActivityItem(routineItem, day, isLast);
            }}
            onActivitySwitched={() => {
              onClose();
              onEditActivityItem(routineItem, day, isLast);
            }}
            onBack={onClose}
          />
        );
      },
    });
  };

  const getCurrentDateSubTitleText = (day?: DailyProgrammeDto) => {
    if (!day) return '';

    const dayDate = new Date(day?.dayDate);

    return dayDate;
  };

  useEffect(() => {
    if (allProgrammesPlanned) {
      setSuccessMessage(true);
    }
  }, [allProgrammesPlanned]);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      onBack={history.goBack}
      title={'Plan your programme'}
      subTitle={`Week ${activeWeekIndex + 1} of ${programmeWeeks.length}`}
      displayOffline={!isOnline}
    >
      <WeekTab
        steps={programmeWeekBreakdown}
        onStepChanged={(idx) => setActiveDayIndex(idx)}
        activeStepIndex={activeDayIndex}
      />

      {activeBreakdown && activeBreakdown.isHoliday ? (
        <PublicHolidayIndicator date={activeBreakdown.date} />
      ) : (
        <>
          {programme && (
            <ProgrammePlanningHeaderUpdated
              className={'flex pt-4'}
              headerText={isDayCompleted ? 'Your routine' : 'Plan your routine'}
              subHeaderText={getCurrentDateSubTitleText(currentDay)}
              themeName={programme?.name}
              theme={programme}
              plannedWeeks={
                programmeWeeks.filter((week) => week.totalIncompleteDays === 0)
                  .length
              }
              totalWeeks={programmeWeeks.length}
              chosedTheme={chosedTheme}
              weekSummary={true}
            />
          )}
          {isDayCompleted &&
            !isProgrammeCompleted &&
            !isWeekComplete &&
            displayDayCompletedCard && (
              <SuccessCard
                className={'mx-4 mt-2'}
                icon={'SparklesIcon'}
                text={'You have planned your day.'}
                subText={
                  'You can see your daily routine and add a note to the message board.'
                }
                onClose={() => {
                  setDisplayDayCompletedCard(false);
                }}
              />
            )}
          {/* {isDayCompleted &&
            isProgrammeCompleted &&
            isWeekComplete &&
            displayDayCompletedCard && (
              <div className={'mt-2 px-4'}>
                <SuccessCard
                  icon={'SparklesIcon'}
                  text={`Great job, your whole “${programme?.name}” programme has been planned!`}
                  subText={'You can now view your programme summary'}
                  onClose={() => {
                    setDisplayDayCompletedCard(false);
                  }}
                />
                <Button
                  className={'mt-4 w-full'}
                  type={'filled'}
                  color={'primary'}
                  onClick={handleSummaryView}
                  icon={'CalendarIcon'}
                  text={'See programme summary'}
                  textColor={'white'}
                />
              </div>
            )} */}
          <div className={'pt-4'}>
            {isDayCompleted &&
              sortedRoutineItems.map((routineItem) => {
                if (routineItem?.name !== DailyRoutineItemType?.messageBoard) {
                  return (
                    <ProgrammePlanningRoutineListItemUpdated
                      key={routineItem.id}
                      day={currentDay}
                      routineItem={routineItem}
                      onClick={() => onProgrammeClick(routineItem)}
                    />
                  );
                }
                return null;
              })}

            {!isDayCompleted &&
              activityRequiredProgrammeRoutineItems?.map((routineItem) => {
                return (
                  <ProgrammePlanningRoutineListItemNotCompleted
                    key={routineItem.id}
                    day={currentDay}
                    routineItem={routineItem}
                    onClick={() => onProgrammeClick(routineItem)}
                  />
                );
              })}
          </div>
        </>
      )}

      {hasPermissionToPlanClassroomActivities &&
        isDayCompleted &&
        !isProgrammeCompleted &&
        isWeekComplete &&
        displayDayCompletedCard && (
          <Card className={'bg-successMain mx-4 mt-2 rounded-xl p-4'}>
            <div className="flex gap-3">
              <img src={PosiviteIcon} alt="bonus" />
              <Typography
                type="h4"
                color={'white'}
                text={`Great job ${practitioner?.user?.firstName}! Your whole week is planned.`}
                className="pt-2"
              />
              <div
                onClick={() => setDisplayDayCompletedCard(false)}
                className={'h-4 w-4'}
              >
                {renderIcon('XIcon', 'h-6 w-6 text-white')}
              </div>
            </div>
            <Button
              text="Plan next week"
              icon="ClipboardListIcon"
              type={'filled'}
              color={'primary'}
              textColor={'white'}
              onClick={() => setActiveWeekIndex(activeWeekIndex + 1)}
              className="mt-2 ml-14"
            />
          </Card>
        )}

      {programmeWeeks && programmeWeeks.length > 1 && (
        <ProgrammeWeekPaging
          activeIndex={activeWeekIndex}
          maxIndex={programmeWeeks.length - 1}
          onBack={() => setActiveWeekIndex(activeWeekIndex - 1)}
          onNext={() => setActiveWeekIndex(activeWeekIndex + 1)}
        />
      )}

      <div>
        <Dialog
          className={'mb-16 px-4'}
          stretch
          visible={successMessage}
          position={DialogPosition.Middle}
        >
          <ActionModal
            customIcon={
              <img
                src={walkthroughImage}
                alt="walkthroughImage"
                className="mb-2"
              />
            }
            iconColor="alertMain"
            iconBorderColor="alertBg"
            importantText={`Great, You have set up your ${programme?.name} programme week!`}
            detailText={`Great job ${practitioner?.user?.firstName}! Your whole week is planned.`}
            actionButtons={[
              {
                text: 'Plan next week',
                textColour: 'white',
                colour: 'primary',
                type: 'filled',
                onClick: () => {
                  setActiveWeekIndex(activeWeekIndex + 1);
                  setSuccessMessage(false);
                },
                leadingIcon: 'ClipboardCheckIcon',
              },
              {
                text: 'Close',
                textColour: 'primary',
                colour: 'primary',
                type: 'outlined',
                onClick: () => {
                  setSuccessMessage(false);
                },
                leadingIcon: 'XIcon',
              },
            ]}
          />
        </Dialog>
      </div>
    </BannerWrapper>
  );
};
