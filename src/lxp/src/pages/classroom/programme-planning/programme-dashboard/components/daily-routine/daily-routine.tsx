import {
  ActionModal,
  Button,
  Typography,
  DialogPosition,
  renderIcon,
  Alert,
  Card,
  RoundIcon,
} from '@ecdlink/ui';
import { DateFormats } from '../../../../../../constants/Dates';
import {
  getActivityIdForRoutineItem,
  getAllGroupActivityIds,
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
import { programmeActions, programmeSelectors } from '@store/programme';
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
import { isSameWeek, isWeekend, nextMonday } from 'date-fns';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import { ReactComponent as BalloonsIcon } from '@/assets/balloons.svg';
import { CustomSuccessCard } from '@/components/custom-success-card/custom-success-card';
import { userSelectors } from '@/store/user';
import format from 'date-fns/format';
import { ReactComponent as NoProgressEmoticon } from '@/assets/ECD_Connect_emoji4.svg';
import { activityActions } from '@/store/content/activity';
import { getActivities } from '@/store/content/activity/activity.actions';

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
  const { createProgramme } = useProgrammePlanning();
  const [selectedActitivy, setSelectedActivity] = useState(0);
  const [routineItemSet, setRoutineItemSet] =
    useState<ProgrammeRoutineItemDto>();
  const [triggerSaveActivity, setTriggerSaveActivity] = useState(false);
  const isWeekendDay = isWeekend(new Date(selectedDate!));
  const nextProgrammes = useSelector(
    programmeSelectors.getProgrammesAfterDate(selectedDate!)
  );
  const userData = useSelector(userSelectors.getUser);
  const [celebrateMessage, setCelebrateMessage] = useState('');
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

  useEffect(() => {
    if (selectedDate) {
      setIsCurrentDayHoliday(isHoliday(selectedDate));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, [isHoliday, selectedDate]);

  const isPastDay = () => {
    if (selectedDate) {
      if (
        selectedDate < new Date() &&
        selectedDate?.getTime() === new Date().getTime()
      ) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleAddProgramme = () => {
    if (isOnline) {
      if (themes.length === 0) {
        appDispatch(
          programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
        );
      }
      history.push(ROUTES.PROGRAMMES.THEME);
    } else {
      showOnlineOnly();
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

  const regex = /(<([^>]+)>)/gi;
  const secondRegEx = /((&nbsp;))*/gim;

  const openInfoItem = (routineItem: ProgrammeRoutineItemDto) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit, onClose) => {
        return (
          <ActionModal
            className={'mx-4'}
            title={routineItem.name}
            importantText={`${routineItem.timeSpan}`}
            detailText={routineItem.description
              .replace(regex, '')
              .replace(secondRegEx, '')}
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

  const openActivityItem = (
    routineItem: ProgrammeRoutineItemDto,
    day?: DailyProgrammeDto
  ) => {
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
            isSelected={true}
            disabled={false}
            onActivitySelected={() => {
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
      await createProgramme(selectedDate!, 'en-za', undefined, selectedDate!);
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
            currentDayCopy.largeGroupActivityId = selectedActitivy;
            break;
          case DailyRoutineItemType.smallGroup:
            currentDayCopy.smallGroupActivityId = selectedActitivy;
            break;
        }
      }

      saveCurrentDay(currentDayCopy);
      setTriggerSaveActivity(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDailyProgramme, routineItemSet]);

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

  useEffect(() => {
    // Celebrate message
    if (programmeWeeks && programmeWeeks.length >= 4 && selectedDate) {
      var lastWeek = programmeWeeks[programmeWeeks.length - 1];
      if (
        format(lastWeek.endDate, 'dd MMM yyyy') ===
        format(selectedDate, 'dd MMM yyyy')
      ) {
        var message =
          'Wow, great job ' +
          userData?.firstName +
          '! You have planned for ' +
          programmeWeeks.length +
          ' weeks in a row. Keep it up!';
        setCelebrateMessage(message);
      }
    }

    if (plannedActivities) {
      setSkillMixMessage('');
      setImproveProgrammeMessage('');

      // Mix skill message
      if (plannedActivities.length >= 10) {
        setSkillMixMessage(
          'Good job, your programme has a good mix of skills!'
        );
      }
      // Improve programme
      if (
        plannedActivities.length >= 10 &&
        recommendedActivities.length !== 0
      ) {
        setImproveProgrammeMessage('Want to improve your programme?');
      }
    }
  }, [
    programmeWeeks,
    setCelebrateMessage,
    userData,
    plannedActivities,
    setSkillMixMessage,
    setImproveProgrammeMessage,
    selectedDate,
    recommendedActivities,
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

  if (
    (isPastDay() && !currentDailyProgramme) ||
    (isPastDay() &&
      !currentDailyProgramme?.smallGroupActivityId &&
      !currentDailyProgramme?.largeGroupActivityId &&
      !currentDailyProgramme?.storyActivityId)
  ) {
    return (
      <div className={'mb-20 flex flex-col pt-4'}>
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
            text={`You did not plan for this day.`}
            type={'h1'}
          />
          <Typography
            className="mt-2 text-center"
            color="textMid"
            text={`You can only plan for future days`}
            type={'body'}
          />
          <Button
            color={'primary'}
            type={'outlined'}
            onClick={() =>
              setSelectedDate && nextProgrammeDaysWithoutActivity?.length
                ? setSelectedDate(
                    new Date(nextProgrammeDaysWithoutActivity?.[0]?.dayDate!)
                  )
                : setSelectedDate && setSelectedDate(nextMonday(new Date()))
            }
            className={'w-25 mt-6 mb-4'}
          >
            {renderIcon('ClipboardListIcon', `w-5 h-5 text-primary`)}
            <Typography
              color={'primary'}
              type={'help'}
              weight={'normal'}
              text={'Start planning'}
            />
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className={'mb-20 flex flex-col pt-4'}>
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

        {(isCurrentDayEmpty || currentDailyProgramme) &&
          (isCurrentDayHoliday || isWeekendDay ? (
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
              {programmeRoutine?.routineItems.map((routineItem) => {
                if (routineItem?.name !== DailyRoutineItemType?.messageBoard) {
                  return (
                    <ProgrammePlanningRoutineListItemUpdated
                      key={`id_${routineItem.id}`}
                      routineItem={routineItem}
                      day={currentDailyProgramme}
                      selectedDate={selectedDate}
                      onClick={() => onProgrammeClick(routineItem)}
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}

        {celebrateMessage && (
          <CustomSuccessCard
            className="my-4"
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text={celebrateMessage}
            textColour="successDark"
            color="successBg"
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
                          backgroundColor="tertiary"
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
        {!isPastDay() ? (
          <Button
            id="gtm-add-programme"
            className={'absolute bottom-6 right-4 ml-2 mt-4 w-1/2 rounded-2xl'}
            size="small"
            type={'filled'}
            color={'primary'}
            onClick={handleAddProgramme}
          >
            {renderIcon('PlusIcon', 'h-5 w-5 text-white')}
            <Typography type={'small'} color={'white'} text={'Add new theme'} />
          </Button>
        ) : (
          ''
        )}
      </div>
    );
  }
};
