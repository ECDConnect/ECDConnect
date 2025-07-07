import {
  ActionModal,
  Button,
  Typography,
  DialogPosition,
  Alert,
  Card,
  RoundIcon,
  Divider,
  FADButton,
} from '@ecdlink/ui';
import { DateFormats } from '../../../../../../constants/Dates';
import {
  getActivityIdForRoutineItem,
  getAllGroupActivityIds,
  getProgrammeWeeks,
  getRoutineItemType,
} from '@utils/classroom/programme-planning/programmes.utils';
import { useHistory, useParams } from 'react-router';
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
import {
  programmeActions,
  programmeSelectors,
  programmeThunkActions,
} from '@store/programme';
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
import {
  programmeThemeSelectors,
  programmeThemeThunkActions,
} from '@/store/content/programme-theme';
import { useProgrammePlanning } from '@hooks/useProgrammePlanning';
import { WeekendDayIndicator } from '../../../programme-routine/components/weekend-day-indicator/weekend-day-indicator';
import {
  addWeeks,
  isSameDay,
  isSameWeek,
  isWeekend,
  nextMonday,
  parseISO,
} from 'date-fns';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import { CustomSuccessCard } from '@/components/custom-success-card/custom-success-card';
import { userSelectors } from '@/store/user';
import { ReactComponent as NoProgressEmoticon } from '@/assets/ECD_Connect_emoji4.svg';
import { ProgrammeThemeRouteState } from '../../../programme-theme/programme-theme.types';
import { ProgrammeDashboardRouteParams } from '../../programme-dashboard.types';
import { useAppContext } from '@/walkthrougContext';
import {
  dummyDailyProgramme,
  dummyRecommendedActivity,
  dummyRoutineItems,
} from '../../walkthrough/dummy-content';
import { practitionerSelectors } from '@/store/practitioner';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';

export const DailyRoutine: React.FC<DailyRoutineProps> = ({
  programme,
  currentDailyProgramme: dailyProgramme,
  setSelectedDate,
  selectedDate,
}) => {
  const { classroomGroupId } = useParams<ProgrammeDashboardRouteParams>();

  const { setState, state } = useAppContext();
  const nextWalkthroughStep = (stepNr: number) => {
    setState({ stepIndex: stepNr });
  };
  const isWalkthrough = state?.run;

  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const programmeRoutineById = useSelector(
    programmeRoutineSelectors.getProgrammeRoutineById(1)
  );

  const programmeRoutine = isWalkthrough
    ? { routineItems: dummyRoutineItems }
    : programmeRoutineById;

  const currentDailyProgramme = isWalkthrough
    ? dummyDailyProgramme
    : dailyProgramme;

  const programmeWeeks = getProgrammeWeeks(programme);

  const appDispatch = useAppDispatch();

  const dialog = useDialog();

  const currentDate = new Date();

  const nextProgrammes = useSelector(
    programmeSelectors.getProgrammesAfterDate(selectedDate!)
  );

  const { getCurrentProgrammeRecommendedActivities } =
    useProgrammePlanningRecommendations();

  const recommendedActivities = getCurrentProgrammeRecommendedActivities(
    programme,
    selectedDate
  );

  // const { getAdditionalRecommendedSubCategories } =
  //   useProgrammePlanningRecommendations();
  // const additionalRecommendedActivities =
  //   getAdditionalRecommendedSubCategories(programme);
  const isCurrentDayEmpty =
    !currentDailyProgramme?.largeGroupActivityId &&
    !currentDailyProgramme?.smallGroupActivityId &&
    !currentDailyProgramme?.storyActivityId;

  const { isHoliday } = useHolidays();
  const [isCurrentDayHoliday, setIsCurrentDayHoliday] = useState(false);
  const themes = useSelector(programmeThemeSelectors.getProgrammeThemes);

  const chosedTheme = themes?.find((item) => item?.name === programme?.name);

  const {
    createOrEditProgramme,
    checkIfWholeWeekIsPlanned,
    getPlannedWeeksCount,
  } = useProgrammePlanning();

  const { isWholeWeekPlanned } = checkIfWholeWeekIsPlanned(
    selectedDate!,
    classroomGroupId
  );
  const {
    isWholeWeekPlanned: isWholeNextWeekPlanned,
    dailyProgrammesByDate: nextWeekDailyProgrammesByDate,
  } = checkIfWholeWeekIsPlanned(addWeeks(selectedDate!, 1), classroomGroupId);
  const { plannedWeeksCount, weeksStartDates } = getPlannedWeeksCount(
    selectedDate!,
    classroomGroupId
  );

  const [selectedActivity, setSelectedActivity] = useState(0);
  const [routineItemSet, setRoutineItemSet] =
    useState<ProgrammeRoutineItemDto>();
  const [triggerSaveActivity, setTriggerSaveActivity] = useState(false);

  const isWeekendDay = isWeekend(new Date(selectedDate!));
  const userData = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const [celebrateMessage, setCelebrateMessage] = useState('');
  const [hideCelebrateMessage, setHideCelebrateMessage] = useState(false);
  const [skillMixMessage, setSkillMixMessage] = useState('');
  const [improveProgrammeMessage, setImproveProgrammeMessage] = useState('');
  const plannedActivities = getAllGroupActivityIds(programme!);

  const nextProgrammeDaysWithoutActivity =
    nextProgrammes?.[0]?.dailyProgrammes?.filter((item) => {
      return (
        !item?.storyActivityId &&
        isSameWeek(new Date(item?.dayDate), new Date(selectedDate!), {
          weekStartsOn: 6,
        })
      );
    });

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();
  const isTrialPeriod = useIsTrialPeriod();

  const hasPermissionToEdit =
    practitioner?.isPrincipal ||
    hasPermissionToPlanClassroomActivities ||
    isTrialPeriod;

  useEffect(() => {
    if (selectedDate) {
      setIsCurrentDayHoliday(isHoliday(selectedDate));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [isHoliday, selectedDate]);

  const isPastDay = () => {
    if (selectedDate) {
      if (selectedDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleAddProgramme = () => {
    const navigateToTheme = () => {
      nextWalkthroughStep(1);
      history.push(ROUTES.PROGRAMMES.THEME, {
        classroomGroupId,
      } as ProgrammeThemeRouteState);
    };

    if (isOnline) {
      if (themes.length === 0) {
        appDispatch(
          programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
        );
      }
      navigateToTheme();
    } else {
      isWalkthrough ? navigateToTheme() : showOnlineOnly();
    }
  };

  const showOnlineOnly = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onSubmit) => {
        return <OnlineOnlyModal onSubmit={onSubmit}></OnlineOnlyModal>;
      },
    });
  };

  const openInfoItem = (routineItem: ProgrammeRoutineItemDto) => {
    dialog({
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={routineItem.name}
            // importantText={`${routineItem.timeSpan}`}
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
          >
            <Typography
              type="markdown"
              fontSize={'16'}
              text={routineItem.description}
              color={'textDark'}
              className="font-h1 text-textMid mb-2 text-left text-base font-normal"
            />
          </ActionModal>
        );
      },
    });
  };

  const openActivityItem = (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto
  ) => {
    const activityId = getActivityIdForRoutineItem(
      routineItem.name,
      currentDailyProgramme
    );

    if (!activityId) {
      onEditActivityItem(routineItem, day);
      return;
    }

    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return routineItem.name !== DailyRoutineItemType.storyBook ? (
          <ActivityDetails
            activityId={activityId}
            isSelected={true}
            disabled={!hasPermissionToEdit}
            onActivitySelected={() => {
              if (state.stepIndex === 5) {
                nextWalkthroughStep(6);
              }
              onClose();
              // onEditActivityItem(routineItem, day);
            }}
            onActivityChanged={
              currentDailyProgramme
                ? () => {
                    onClose();
                    onEditActivityItem(routineItem, day);
                  }
                : () => {}
            }
            onBack={onClose}
          />
        ) : (
          <StoryActivityDetails
            selected={true}
            storyBookId={currentDailyProgramme?.storyBookId}
            activityId={activityId}
            disabled={false}
            viewType={'StoryActivity'}
            onBack={onClose}
            onStoryBookSwitched={
              currentDailyProgramme
                ? () => {
                    onClose();
                    onEditActivityItem(routineItem, day);
                  }
                : () => {}
            }
            onActivitySwitched={
              currentDailyProgramme
                ? () => {
                    onClose();
                    onEditActivityItem(routineItem, day);
                  }
                : () => {}
            }
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

  const onProgrammeClick = (
    routineItem: ProgrammeRoutineItemDto,
    stepIndex: number
  ) => {
    // walkthrough
    if (isWalkthrough) {
      if (stepIndex === 4) {
        nextWalkthroughStep(5);
      } else if (stepIndex === 6) {
        nextWalkthroughStep(7);
      }
    }

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
    if (currentDailyProgramme) {
      openActivityItem(routineItem, currentDailyProgramme);
      return;
    }
    openActivityItem(routineItem);
  };

  const onActivitySelected = async (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto,
    activityId?: number
  ) => {
    if (!currentDailyProgramme) {
      await createOrEditProgramme(
        classroomGroupId,
        selectedDate!,
        'en-za',
        undefined,
        selectedDate!
      );
    }

    if (day) {
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
    }
  };

  useEffect(() => {
    if (currentDailyProgramme && routineItemSet && triggerSaveActivity) {
      const currentDayCopy = { ...currentDailyProgramme! };
      if (routineItemSet) {
        switch (routineItemSet.name) {
          case DailyRoutineItemType.largeGroup:
            currentDayCopy.largeGroupActivityId = selectedActivity;
            break;
          case DailyRoutineItemType.smallGroup:
            currentDayCopy.smallGroupActivityId = selectedActivity;
            break;
        }
      }

      saveCurrentDay(currentDayCopy);
      setTriggerSaveActivity(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDailyProgramme, routineItemSet]);

  const currentProgramme = useSelector(
    programmeSelectors.getProgrammeByDateAndClassroomGroupId({
      date: selectedDate!,
      classroomGroupId,
    })
  );

  useEffect(() => {
    if (currentProgramme?.dailyProgrammes.length === 0) {
      createOrEditProgramme(
        classroomGroupId,
        selectedDate!,
        'en-za',
        undefined,
        selectedDate!
      );
    }
  }, [
    classroomGroupId,
    createOrEditProgramme,
    currentDailyProgramme,
    currentProgramme?.dailyProgrammes.length,
    selectedDate,
  ]);

  const unsavedDay = currentProgramme?.dailyProgrammes.find((dailyRoutine) =>
    isSameDay(new Date(dailyRoutine?.dayDate), selectedDate!)
  );

  const onStoryAndActivitySelected = async (
    storyId?: number,
    activityId?: number,
    day?: DailyProgrammeDto
  ) => {
    if (day) {
      const currentDayCopy = { ...day };
      currentDayCopy.storyBookId = storyId;
      currentDayCopy.storyActivityId = activityId;

      saveCurrentDay(currentDayCopy);
    }
  };

  useEffect(() => {
    // Celebrate message
    if (plannedWeeksCount > 1) {
      if (hasPermissionToPlanClassroomActivities) {
        setCelebrateMessage(
          `Wow, great job ${userData?.firstName}! You have planned for ${plannedWeeksCount} weeks in a row. Keep it up!`
        );
      }
    } else if (selectedDate && isWholeWeekPlanned) {
      setCelebrateMessage(
        `Great job ${userData?.firstName}! Your whole week is planned.`
      );
    } else {
      setCelebrateMessage('');
    }

    if (plannedActivities) {
      setSkillMixMessage('');
      setImproveProgrammeMessage('');

      // Improve programme
      if (
        plannedActivities.length <= 10 &&
        recommendedActivities.length !== 0
      ) {
        setImproveProgrammeMessage('Want to improve your programme?');
      }

      if (improveProgrammeMessage === '' && plannedActivities.length >= 10) {
        setSkillMixMessage(
          'Good job, your programme has a good mix of skills!'
        );
      }
    }
  }, [
    hasPermissionToPlanClassroomActivities,
    improveProgrammeMessage,
    isWholeWeekPlanned,
    plannedActivities,
    plannedWeeksCount,
    recommendedActivities.length,
    selectedDate,
    userData?.firstName,
    weeksStartDates,
  ]);

  const onEditActivityItem = (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto
  ) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit, onClose) => {
        return routineItem.name !== DailyRoutineItemType.storyBook ? (
          <ActivitySearch
            title={routineItem.name}
            subtitle={`${new Date(
              currentDailyProgramme?.dayDate || new Date()
            ).toLocaleString('en-ZA', DateFormats.dayWithLongMonthName)}`}
            date={day?.dayDate ? parseISO(day.dayDate) : new Date()}
            programmeId={programme?.id}
            preSelectedActivityId={
              routineItem.name === DailyRoutineItemType.largeGroup
                ? currentDailyProgramme?.largeGroupActivityId
                : currentDailyProgramme?.smallGroupActivityId
            }
            recommendedActivity={
              isWalkthrough && state.stepIndex === 6
                ? dummyRecommendedActivity
                : getFirstActivityByType(
                    recommendedActivities,
                    getRoutineItemType(routineItem.name)
                  )
            }
            routineItem={routineItem}
            onSave={(activityId?: number) => {
              onActivitySelected(routineItem, day, activityId);
              setRoutineItemSet(routineItem);
              setSelectedActivity(activityId!);
              setTriggerSaveActivity(true);
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
            subtitle={new Date(
              currentDailyProgramme?.dayDate || new Date()
            ).toLocaleString('en-ZA', DateFormats.dayWithLongMonthName)}
            onSave={(storyId?: number, activityId?: number) => {
              onStoryAndActivitySelected(storyId, activityId, unsavedDay);
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

    // send data to backend
    if (programme) {
      appDispatch(
        programmeThunkActions.updateProgramme({
          programmeId: programme?.id!,
        })
      ).unwrap();
    }
  };

  if (
    (isPastDay() && !currentDailyProgramme) ||
    (isPastDay() &&
      !currentDailyProgramme?.smallGroupActivityId &&
      !currentDailyProgramme?.largeGroupActivityId &&
      !currentDailyProgramme?.storyActivityId)
  ) {
    return (
      <div className={'mb-20 flex flex-col'}>
        <ProgrammePlanningHeaderUpdated
          headerText={`Today's daily Routine`}
          subHeaderText={currentDate}
          themeName={programme?.name || 'No theme'}
          theme={programme}
          showCount={false}
          plannedWeeks={
            programmeWeeks.filter((week) => week.totalIncompleteDays === 0)
              .length
          }
          totalWeeks={programmeWeeks.length}
          chosedTheme={chosedTheme}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          isWeekendDay={isWeekendDay}
        />

        <div className={'mt-8 flex flex-col items-center p-4'}>
          <NoProgressEmoticon className="mr-2 h-40 w-40" />
          <Typography
            className="mt-2 text-center"
            color="textMid"
            text={
              hasPermissionToEdit
                ? `You did not plan for this day.`
                : 'No activity planned for this day.'
            }
            type={'h1'}
          />
          {hasPermissionToEdit && (
            <>
              <Typography
                className="mt-2 text-center"
                color="textMid"
                text={`You can only plan for future days`}
                type={'body'}
              />
              <Button
                color={'secondary'}
                type={'outlined'}
                onClick={() =>
                  setSelectedDate && nextProgrammeDaysWithoutActivity?.length
                    ? setSelectedDate(
                        new Date(
                          nextProgrammeDaysWithoutActivity?.[0]?.dayDate!
                        )
                      )
                    : setSelectedDate && setSelectedDate(nextMonday(new Date()))
                }
                className={'w-25 mt-6 mb-4'}
                icon="ClipboardListIcon"
                text="Start planning"
                textColor="secondary"
              />
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className={'mb-20 flex flex-col'}>
        <ProgrammePlanningHeaderUpdated
          headerText={`Today's daily Routine`}
          subHeaderText={currentDate}
          themeName={programme?.name || 'No theme'}
          theme={programme}
          showCount={false}
          plannedWeeks={
            programmeWeeks.filter((week) => week.totalIncompleteDays === 0)
              .length
          }
          totalWeeks={programmeWeeks.length}
          chosedTheme={chosedTheme}
          setSelectedDate={setSelectedDate}
          selectedDate={selectedDate}
          isWeekendDay={isWeekendDay}
        />

        {(isCurrentDayEmpty || currentDailyProgramme || isWalkthrough) &&
          ((isCurrentDayHoliday || isWeekendDay) && !isWalkthrough ? (
            isWeekendDay ? (
              <WeekendDayIndicator
                date={new Date(selectedDate!)}
                nextProgrammeDaysWithoutActivity={
                  nextProgrammeDaysWithoutActivity
                }
                setSelectedDate={setSelectedDate}
              />
            ) : (
              <PublicHolidayIndicator
                date={new Date(selectedDate!)}
                nextProgrammeDaysWithoutActivity={
                  nextProgrammeDaysWithoutActivity
                }
                setSelectedDate={setSelectedDate}
              />
            )
          ) : (
            <div className="mt-4">
              {programmeRoutine?.routineItems.map((routineItem, index) => {
                if (routineItem?.name !== DailyRoutineItemType?.messageBoard) {
                  return (
                    <div
                      key={routineItem.id}
                      id={
                        index === 2
                          ? state.stepIndex === 4
                            ? 'walkthrough-plan-activity'
                            : 'walkthrough-add-activity'
                          : ''
                      }
                    >
                      <ProgrammePlanningRoutineListItemUpdated
                        key={`id_${routineItem.id}`}
                        routineItem={routineItem}
                        storyBookId={currentDailyProgramme?.storyBookId}
                        day={
                          isWalkthrough
                            ? dummyDailyProgramme
                            : currentDailyProgramme
                        }
                        selectedDate={selectedDate}
                        //disabled={isWalkthrough && state.stepIndex !== 4}
                        onClick={() =>
                          onProgrammeClick(routineItem, state.stepIndex)
                        }
                      />
                      {index === programmeRoutine.routineItems.length - 1 && (
                        <Divider className="-m-1 mb-4" />
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        {celebrateMessage && !hideCelebrateMessage && (
          <CustomSuccessCard
            className="mb-4"
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={celebrateMessage}
            textColour="white"
            color="successMain"
            onClose={() => setHideCelebrateMessage(true)}
            button={
              !isWholeNextWeekPlanned
                ? {
                    color: 'quatenary',
                    type: 'filled',
                    text: 'Plan next week',
                    className: 'mt-2 w-max',
                    icon: 'ClipboardListIcon',
                    size: 'small',
                    textColor: 'white',
                    onClick: () => {
                      setSelectedDate?.(
                        nextWeekDailyProgrammesByDate?.find(
                          (day) =>
                            !day.dailyProgramme?.largeGroupActivityId ||
                            !day.dailyProgramme?.smallGroupActivityId
                        )?.date
                      );
                    },
                  }
                : undefined
            }
          />
        )}
        {skillMixMessage && (
          <Alert
            type="success"
            variant="flat"
            customMessage={
              <div>
                <Typography
                  type="body"
                  color="textDark"
                  text={skillMixMessage}
                />
              </div>
            }
            messageColor="textMid"
            customIcon={<BalloonsIcon />}
          />
        )}
        {improveProgrammeMessage && (
          <div className="px-4">
            <Typography
              type={'h4'}
              text={improveProgrammeMessage}
              className="mt-4"
            />
            <Typography type={'h4'} text="Add more of these skills:" />
            <Card className="border-primary mt-2 w-full rounded-xl border-2 bg-white py-4 px-2">
              {recommendedActivities &&
                recommendedActivities?.map((activityItem) => {
                  if (activityItem?.subCategory) {
                    return (
                      <div className="mb-1 flex items-center gap-3">
                        <RoundIcon
                          imageUrl={activityItem?.subCategory.imageUrl}
                          backgroundColor="secondary"
                        />
                        <Typography
                          type={'body'}
                          text={activityItem?.subCategory.name}
                        />
                      </div>
                    );
                  }
                  return null;
                })}
            </Card>
          </div>
        )}
        {!isPastDay() && hasPermissionToEdit && (
          <FADButton
            id="walkthrough-start"
            click={handleAddProgramme}
            disabled={isWalkthrough && state.stepIndex !== 0}
            icon="PlusIcon"
            iconDirection="left"
            textToggle
            title="Add new theme"
            textColor="white"
            type="filled"
            color="quatenary"
            className="fixed bottom-6 right-0 z-10 m-3 px-3.5 py-2.5"
          />
        )}
        <div id="walkthrough-last-step" />
      </div>
    );
  }
};
