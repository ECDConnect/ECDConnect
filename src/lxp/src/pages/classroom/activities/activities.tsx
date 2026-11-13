import ROUTES from '@/routes/routes';
import { classroomsSelectors } from '@/store/classroom';
import { programmeSelectors } from '@/store/programme';
import { DailyProgrammeDto, ProgrammeDto, getAvatarColor } from '@ecdlink/core';
import {
  ActionModal,
  CelebrationCard,
  DialogPosition,
  StackedList,
  UserAlertListDataItem,
} from '@ecdlink/ui';
import { isSameDay, parseISO, isAfter, isBefore } from 'date-fns';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import Emoji3 from '@/assets/ECD_Connect_emoji3.svg?react';
import { useCallback, useEffect, useState } from 'react';
import { ClassroomGroupDto } from '@/models/classroom/classroom-group.dto';
import { IconInformationIndicator } from '../programme-planning/components/icon-information-indicator/icon-information-indicator';
import { practitionerSelectors } from '@/store/practitioner';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import iconRobotImage from '@/assets/iconRobot.svg';
import { programmePlanningPromptKey, useDialog } from '@ecdlink/core';

import { replaceSkillText } from '@/utils/child/child-progress-report.utils';

import { useUserFlag } from '@/hooks/useUserFlag';

export const ActivitiesTab = () => {
  const history = useHistory();
  const today = new Date();
  const dialog = useDialog();

  const classes = useSelector(classroomsSelectors.getClassroomGroups);
  const programmes = useSelector(programmeSelectors.getProgrammes);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  // Add a state to track if the dialog has been shown
  const [hasShownDialog, setHasShownDialog] = useState(false);
  const [displayCelebrationCard, setDisplayCelebrationCard] = useState(true);

  // Handling the popup after the period has ended and there is completed reports
  const progressReports = useSelector(
    progressTrackingSelectors.getProgressReports()
  );
  const latestPeriod = useSelector(
    classroomsSelectors.getExpiredProgressReportPeriod()
  );
  const completedReports = progressReports.filter(
    (report) =>
      !!report.dateCompleted &&
      report.childProgressReportPeriodId == latestPeriod?.id
  );

  // One flag per reporting period, keyed by the period id, so a new period is
  // a key nobody has set yet - there is nothing to reset when the year rolls
  // over, which is what the four numbered keys and a stored year used to do.
  const [hasDismissedPeriodPrompt, dismissPeriodPrompt] = useUserFlag(
    programmePlanningPromptKey(latestPeriod?.id ?? '')
  );

  const hasClickedOnLatestPeriod =
    !!latestPeriod?.id &&
    completedReports.length > 0 &&
    hasDismissedPeriodPrompt;

  const allSkills = useSelector(
    progressTrackingSelectors.getProgressTrackingSkillsWithCategoryInfo()
  );

  const baseReports = useSelector(
    progressTrackingSelectors.getProgressReportsForReportingPeriod(
      latestPeriod?.id || ''
    )
  );

  const skillsToWorkOnBaseOnPeriod = baseReports?.map((item) =>
    item?.skillsToWorkOn?.map((item2) => item2?.skillId)
  );

  const flattenedArray: number[] = skillsToWorkOnBaseOnPeriod.flat();

  // Step 2: Count the occurrences of each number
  const countOccurrences: Record<number, number> = {};
  flattenedArray.forEach((num: number) => {
    countOccurrences[num] = (countOccurrences[num] || 0) + 1;
  });

  // Step 3: Extract the numbers that appear more than once and their counts
  const duplicatesWithCounts: { number: number; count: number }[] =
    Object.entries(countOccurrences)
      .filter(([_, count]) => count > 1)
      .map(([num, count]) => ({ number: Number(num), count }));

  const randomValues = getRandomValues(flattenedArray, 2);

  const listOfWorkingOnActivities =
    duplicatesWithCounts?.length > 0
      ? allSkills?.filter((skill) =>
          duplicatesWithCounts?.some((l) => skill?.id === l?.number)
        )
      : allSkills?.filter((skill) => randomValues.some((l) => skill?.id === l));

  function getRandomValues(arr: number[], n: number): number[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  const showProgressReportEndedDialog = useCallback(async () => {
    dialog({
      // blocking: true,
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          className={'mx-4 bg-white'}
          title="What are children working on?"
          customDetailText={
            <div className="text-textMid">
              {`Based on Report ${latestPeriod?.reportNumber}, here are some areas that children are working on:`}
              <div>
                {listOfWorkingOnActivities?.map((item) => (
                  <div
                    key={item?.id}
                    className="mt-2"
                  >{`\u00A0\u00A0\u00A0\u00A0• ${replaceSkillText(
                    item?.name,
                    'Child'
                  )}`}</div>
                ))}
                <div className="mb-2 mt-8">{`Think about adding activities to work on these areas. Download the full summary.`}</div>
              </div>
            </div>
          }
          customIcon={
            <div
              className="bg-tertiary mb-4 flex h-auto justify-center overflow-hidden rounded-full"
              style={{ width: 85 }}
            >
              <img src={iconRobotImage} alt="card" />
            </div>
          }
          actionButtons={[
            {
              text: 'Download the full summary',
              colour: 'quatenary',
              onClick: () => {
                history?.push(
                  ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
                  {
                    report: 'completed-all',
                  }
                );
                if (latestPeriod?.id) dismissPeriodPrompt();
                onCancel();
              },
              type: 'filled',
              textColour: 'white',
              leadingIcon: 'DownloadIcon',
            },
            {
              text: 'Close',
              textColour: 'quatenary',
              colour: 'quatenary',
              type: 'outlined',
              onClick: () => {
                if (latestPeriod?.id) dismissPeriodPrompt();
                onCancel();
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      ),
    });
  }, [
    latestPeriod?.id,
    latestPeriod?.reportNumber,
    dismissPeriodPrompt,
    dialog,
    history,
    listOfWorkingOnActivities,
  ]);

  useEffect(() => {
    if (
      latestPeriod &&
      completedReports.length > 0 &&
      listOfWorkingOnActivities.length > 0 &&
      !hasClickedOnLatestPeriod &&
      !hasShownDialog
    ) {
      showProgressReportEndedDialog();
      setHasShownDialog(true);
    }
  }, [
    latestPeriod,
    completedReports,
    hasClickedOnLatestPeriod,
    hasShownDialog,
    showProgressReportEndedDialog,
  ]);

  const getProgrammeName = (currentClass: ClassroomGroupDto) => {
    const todayProgramme = programmes?.find((programme) =>
      programme.dailyProgrammes?.some(
        (day) =>
          programme.classroomGroupId === currentClass.id &&
          isSameDay(parseISO(day.dayDate.replace('Z', '')), today)
      )
    );

    if (todayProgramme && todayProgramme?.name !== 'No theme') {
      return todayProgramme.name;
    }

    const closestFutureProgramme = programmes?.reduce(
      // TODO: Check interface warning
      // @ts-ignore
      (closest: ProgrammeDto | undefined, programme: ProgrammeDto) => {
        if (programme.classroomGroupId === currentClass.id) {
          const futureDays = programme.dailyProgrammes?.filter((day) =>
            isAfter(parseISO(day.dayDate.replace('Z', '')), today)
          );

          if (futureDays && futureDays.length > 0) {
            const closestDay = futureDays.reduce(
              (
                nearest: DailyProgrammeDto | undefined,
                day: DailyProgrammeDto
              ) => {
                const currentDayDate = parseISO(day.dayDate.replace('Z', ''));
                if (
                  !nearest ||
                  isBefore(
                    currentDayDate,
                    parseISO(nearest.dayDate.replace('Z', ''))
                  )
                ) {
                  return day;
                }
                return nearest;
              },
              undefined
            );

            if (
              !closest ||
              (closestDay &&
                isBefore(
                  parseISO(closestDay.dayDate.replace('Z', '')),
                  parseISO(closest.dailyProgrammes![0].dayDate.replace('Z', ''))
                ))
            ) {
              return { ...programme, dailyProgrammes: [closestDay] };
            }
          }
        }
        return closest;
      },
      undefined
    );

    return closestFutureProgramme?.name || 'No theme';
  };

  const classList: UserAlertListDataItem[] = classes?.map((currentClass) => ({
    title: currentClass.name,
    profileText: currentClass.name.slice(0, 2).toUpperCase(),
    subTitle: getProgrammeName(currentClass),
    alertSeverity: 'none',
    avatarColor: getAvatarColor(),
    iconColor: 'secondary',
    hideAlertSeverity: true,
    onActionClick: () =>
      history.push(
        ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT.replace(
          ':classroomGroupId',
          currentClass.id
        )
      ),
  }));

  const isToShowCelebratoryCard =
    classList?.length &&
    classList?.every((item) => item.subTitle !== 'No theme');

  return (
    <div className="p-4">
      {!!isToShowCelebratoryCard && !!displayCelebrationCard && (
        <CelebrationCard
          className="mb-4"
          onDismiss={() => setDisplayCelebrationCard(false)}
          secondaryTextColour="white"
          secondaryMessage=""
          primaryTextColour="white"
          image={<Emoji3 className="mt-2 h-16" />}
          backgroundColour="successMain"
          primaryMessage="Great job! You have activities planned for all classes!"
        />
      )}
      {classList.length ? (
        <StackedList
          className="mb-20 flex flex-col gap-1"
          type="UserAlertList"
          listItems={classList}
        />
      ) : (
        <IconInformationIndicator
          title="You don't have any classes yet!"
          subTitle={
            practitioner?.isPrincipal
              ? 'Go to the "Classes" tab to add a class.'
              : 'Ask your principal to assign you to a class.'
          }
        />
      )}
    </div>
  );
};
