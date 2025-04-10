import { ActionModal, BannerWrapper, DialogPosition } from '@ecdlink/ui';
import { format, isSameDay, isSameWeek } from 'date-fns';
import { useSelector } from 'react-redux';
import { userSelectors } from '@store/user';
import { programmeSelectors } from '@store/programme';
import { DailyRoutine } from './components/daily-routine/daily-routine';
import { useCallback, useEffect, useState } from 'react';
import { useHolidays } from '@/hooks/useHolidays';
import { LocalStorageKeys, useDialog, usePrevious } from '@ecdlink/core';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import { progressTrackingSelectors } from '@/store/progress-tracking';
import { useHistory, useLocation, useParams } from 'react-router';
import ProgressReport from '../components/progress-report/progress-report';
import robot from '../../../../assets/iconRobot.svg';
import { classroomsSelectors } from '@store/classroom';
import ROUTES from '@routes/routes';
import {
  ClassDashboardRouteState,
  TabsItems,
} from '../../class-dashboard/class-dashboard.types';
import {
  ProgrammeDashboardRouteParams,
  ProgrammeDashboardRouteState,
} from './programme-dashboard.types';
import { useProgrammePlanning } from '@/hooks/useProgrammePlanning';
import ProgrammeWrapper from './walkthrough/programme-wrapper';
import { ProgrammeWalkthroughStart } from './walkthrough/components/walkthrough-start';
import { useAppContext } from '@/walkthrougContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { ProgrammeThemeRouteState } from '../programme-theme/programme-theme.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ActivitiesActions } from '@/store/content/activity/activity.actions';
import { StoryBookActions } from '@/store/content/story-book/story-book.actions';
import { useIsTrialPeriod } from '@/hooks/useIsTrialPeriod';
import { useUserPermissions } from '@/hooks/useUserPermissions';
import { practitionerSelectors } from '@/store/practitioner';

const { usePDF } = require('react-to-pdf');
export interface iSkills {
  skill: string;
  totalChildren: number;
}

export const ProgrammeDashboard: React.FC = () => {
  const [showInitialWalkthrough, setShowInitialWalkthrough] = useState(false);

  const { isLoading: isLoadingActivities } = useThunkFetchCall(
    'activityData',
    ActivitiesActions.GET_ACTIVITIES
  );
  const { isLoading: isLoadingStoryBooks } = useThunkFetchCall(
    'storyBookData',
    StoryBookActions.GET_STORY_BOOKS
  );

  const isLoading = isLoadingActivities || isLoadingStoryBooks;

  const programmeStartDate = new Date();

  const { classroomGroupId } = useParams<ProgrammeDashboardRouteParams>();
  const { state } = useLocation<ProgrammeDashboardRouteState>();

  const { isOnline } = useOnlineStatus();
  const history = useHistory();

  const classroomGroup = useSelector(
    classroomsSelectors.getClassroomGroupById(classroomGroupId)
  );
  const user = useSelector(userSelectors.getUser);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const dialog = useDialog();

  const isTrialPeriod = useIsTrialPeriod();

  const { hasPermissionToPlanClassroomActivities } = useUserPermissions();

  const hasPermissionToEdit =
    practitioner?.isPrincipal ||
    hasPermissionToPlanClassroomActivities ||
    isTrialPeriod;

  const [showReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    programmeStartDate || new Date()
  );

  const previousSelectedDate = usePrevious(selectedDate);

  const currentReportingPeriod = useSelector(
    classroomsSelectors.getCurrentProgressReportPeriod()
  );

  const currentProgramme = useSelector(
    programmeSelectors.getProgrammeByDateAndClassroomGroupId({
      date: selectedDate,
      classroomGroupId,
    })
  );

  const currentDailyProgramme = currentProgramme?.dailyProgrammes.find(
    (dailyRoutine) => isSameDay(new Date(dailyRoutine?.dayDate), selectedDate)
  );
  const holiday = useHolidays();
  const isHoliday = holiday?.isHoliday(selectedDate);
  // Progress Summary Report
  const progressSummary = useSelector(
    progressTrackingSelectors?.getPractitionerProgressReportSummary
  );

  const { checkIfWholeWeekIsPlanned } = useProgrammePlanning();

  const {
    state: { run: isWalkthrough },
  } = useAppContext();

  const { isWholeWeekPlanned, dailyProgrammesUnplanned } =
    checkIfWholeWeekIsPlanned(selectedDate, classroomGroupId);

  useEffect(() => {
    if (state?.selectedDate) {
      setSelectedDate(state.selectedDate);
      history.replace(history.location.pathname, {
        ...state,
        selectedDate: undefined,
      });
    }
  }, [history, state]);

  const { targetRef } = usePDF({
    filename: 'practitioner-progress-summary-report.pdf',
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tomorrowUnplannedActivity = dailyProgrammesUnplanned.find(
    (x) => format(x.date, 'EEEE, d LLLL') === format(tomorrow, 'EEEE, d LLLL')
  );

  const showStartPlanning = useCallback(() => {
    if (
      isOnline &&
      !isWalkthrough &&
      hasPermissionToEdit &&
      !isWholeWeekPlanned &&
      tomorrowUnplannedActivity &&
      (!previousSelectedDate || !isSameWeek(selectedDate, previousSelectedDate))
    ) {
      dialog({
        position: DialogPosition.Middle,
        color: 'bg-white',
        render: (onSubmit, onCancel) => (
          <ActionModal
            customIcon={
              <div className="flex">
                <img src={robot} alt="profile" className="mb-4 h-20 w-20" />
              </div>
            }
            importantText={`Hello, ${user?.firstName}! Start planning your daily routine`}
            detailText={
              'Choose a theme and create your own programme for this week'
            }
            actionButtons={[
              {
                text: 'Choose a theme',
                textColour: 'white',
                colour: 'quatenary',
                type: 'filled',
                onClick: () => {
                  setStorageItem(
                    true,
                    LocalStorageKeys.hasVisitedProgrammeDashboard
                  );
                  history.push(ROUTES.PROGRAMMES.THEME, {
                    classroomGroupId,
                  } as ProgrammeThemeRouteState);
                  onCancel();
                },
                leadingIcon: 'ColorSwatchIcon',
              },
              {
                text: 'Create my own programme',
                textColour: 'quatenary',
                colour: 'quatenary',
                type: 'outlined',
                onClick: () => {
                  setStorageItem(
                    true,
                    LocalStorageKeys.hasVisitedProgrammeDashboard
                  );
                  onCancel();
                },
                leadingIcon: 'PencilAltIcon',
              },
            ]}
          />
        ),
      });
    }
  }, [
    classroomGroupId,
    dialog,
    hasPermissionToEdit,
    history,
    isWalkthrough,
    isWholeWeekPlanned,
    previousSelectedDate,
    selectedDate,
    tomorrowUnplannedActivity,
    user?.firstName,
    isOnline,
  ]);

  const checkIfToShowInitialWalkthrough = useCallback(() => {
    if (
      hasPermissionToEdit &&
      classroomGroup?.classProgrammes.length &&
      !getStorageItem(LocalStorageKeys.programmeWalkthroughComplete)
    ) {
      setShowInitialWalkthrough(true);
    }
  }, [classroomGroup?.classProgrammes.length, hasPermissionToEdit]);

  useEffect(() => {
    checkIfToShowInitialWalkthrough();
  }, [checkIfToShowInitialWalkthrough]);

  useEffect(() => {
    if (!isWalkthrough) {
      if (!isHoliday) {
        showStartPlanning();
      }
    }
  }, [isHoliday, isWalkthrough, showStartPlanning]);

  // useEffect(() => {
  //   if (!progressSummary) {
  //     const today = new Date();
  //     const reportDate =
  //       today.getMonth() >= 0 && today.getMonth() <= 6
  //         ? 'June'
  //         : 'November' + today.getFullYear();
  //     fetchData(reportDate);
  //   } else {
  //     let total: number = 0;
  //     const skills: iSkills[] = [];
  //     const dMessage = [];

  //     const showProgressReportDialog = async (dMessage: string[]) => {
  //       dialog({
  //         // blocking: true,
  //         position: DialogPosition.Middle,
  //         render: (onSubmit: any, onCancel: any) => (
  //           <ActionModal
  //             className={'mx-4'}
  //             title="What are children working on?"
  //             paragraphs={dMessage}
  //             customIcon={
  //               <div
  //                 className="bg-tertiary mb-4 flex h-auto justify-center overflow-hidden rounded-full"
  //                 style={{ width: 85 }}
  //               >
  //                 <img src={iconRobotImage} alt="card" />
  //               </div>
  //             }
  //             actionButtons={[
  //               {
  //                 text: 'Download the full summary',
  //                 colour: 'quatenary',
  //                 onClick: () => {
  //                   // downloadPdf();
  //                   // setTimeout(() => onCancel(), 600);
  //                   history?.push(
  //                     ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP,
  //                     {
  //                       report: 'completed-all',
  //                     }
  //                   );
  //                   onCancel();
  //                 },
  //                 type: 'filled',
  //                 textColour: 'white',
  //                 leadingIcon: 'DownloadIcon',
  //               },
  //               {
  //                 text: 'Close',
  //                 textColour: 'quatenary',
  //                 colour: 'quatenary',
  //                 type: 'outlined',
  //                 onClick: () => onCancel(),
  //                 leadingIcon: 'XIcon',
  //               },
  //             ]}
  //           />
  //         ),
  //       });
  //     };

  //     progressSummary?.classSummaries?.forEach((item) => {
  //       total = item.childCount || 0;
  //       item?.categories?.forEach((subItem) => {
  //         subItem?.subCategories?.forEach((subCategoriesItem) => {
  //           subCategoriesItem?.childrenPerSkill?.forEach((skillItem) => {
  //             let childSkill: string = skillItem?.skill || '';
  //             let childCount: number = skillItem?.childCount || 0;
  //             const existing = skills.find((n) => n.skill === childSkill);
  //             if (existing) {
  //               childCount = existing.totalChildren + childCount;
  //             }
  //             skills.push({ skill: childSkill, totalChildren: childCount });
  //           });
  //         });
  //       });
  //     });

  //     const today = new Date();
  //     const thisYear31July = new Date(today.getFullYear(), 6, 31);
  //     const thisYear20Dec = new Date(today.getFullYear(), 11, 20);
  //     const nextYear31July = new Date(today.getFullYear() + 1, 6, 31);
  //     const reportMonth = today.getMonth() >= 6 ? 'June' : 'November';

  //     if (skills.length === 0) {
  //       dMessage.push('None of the children are working on skills.');
  //     } else {
  //       dMessage.push(
  //         'Based on your ' +
  //           reportMonth +
  //           ' progress reports, here are some areas that children are working on:'
  //       );

  //       skills.sort((a, b) => a.totalChildren - b.totalChildren);
  //       skills.forEach((item, index) => {
  //         if (index <= 2) {
  //           dMessage.push(
  //             '- ' +
  //               item.skill +
  //               ' (' +
  //               item.totalChildren +
  //               (item.totalChildren === 1 ? ' child)' : ' children)')
  //           );
  //         }
  //       });

  //       dMessage.push(
  //         'Think about adding activities to work on these areas. Download the full summary.'
  //       );
  //     }

  //     const storageItemJuly = getStorageItem<number>(
  //       LocalStorageKeys.hasViewedJulProgressReport
  //     );
  //     const storageItemDecember = getStorageItem<number>(
  //       LocalStorageKeys.hasViewedDecProgressReport
  //     );

  //     if (total > 0) {
  //       if (today >= thisYear31July && today < thisYear20Dec) {
  //         if (!storageItemJuly || storageItemJuly === 0) {
  //           setStorageItem(
  //             today.getTime(),
  //             LocalStorageKeys.hasViewedJulProgressReport
  //           );
  //           showProgressReportDialog(dMessage);
  //         }
  //       } else if (today >= thisYear20Dec && today < nextYear31July) {
  //         if (!storageItemDecember || storageItemDecember === 0) {
  //           showProgressReportDialog(dMessage);
  //           setStorageItem(
  //             today.getTime(),
  //             LocalStorageKeys.hasViewedDecProgressReport
  //           );
  //         }
  //       }
  //     }
  //   }
  // }, [fetchData, progressSummary, downloadPdf, dialog]);

  const baseReports = useSelector(
    progressTrackingSelectors.getProgressReportsForReportingPeriod(
      currentReportingPeriod?.id || ''
    )
  );

  const skillsToWorkOnBaseOnPeriod = baseReports?.map((item) =>
    item?.skillsToWorkOn?.map((item2) => item2?.skillId)
  );

  // const firstSkillOfTwoFirstReports = skillsToWorkOnBaseOnPeriod?.map(item => item?.)
  const flattenedArray: number[] = skillsToWorkOnBaseOnPeriod.flat();

  // Step 2: Count the occurrences of each number
  const countOccurrences: Record<number, number> = {};
  flattenedArray.forEach((num: number) => {
    countOccurrences[num] = (countOccurrences[num] || 0) + 1;
  });

  // useEffect(() => {
  //   if (
  //     (percentageObservationsCompleted === 100 ||
  //       percentageReportsCompleted === 100 ||
  //       completedReportCount > 0) &&
  //     lastProgressReportPeriodHasPassed
  //   ) {
  //     showProgressReportEndedDialog();
  //   }
  // }, [
  //   percentageReportsCompleted,
  //   percentageObservationsCompleted,
  //   completedReportCount,
  //   lastProgressReportPeriodHasPassed,
  // ]);

  return (
    <BannerWrapper
      isLoading={isLoading}
      size="small"
      renderBorder
      title="Activities"
      subTitle={classroomGroup?.name}
      displayOffline={!isOnline}
      displayHelp={hasPermissionToEdit}
      onHelp={() =>
        history.push(
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.TUTORIAL.GETTING_STARTED.replace(
            ':classroomGroupId',
            classroomGroupId
          )
        )
      }
      onBack={() =>
        history.push(ROUTES.CLASSROOM.ROOT, {
          activeTabIndex: TabsItems.ACTIVITES,
        } as ClassDashboardRouteState)
      }
      className="relative p-4"
    >
      <ProgrammeWrapper />
      <DailyRoutine
        programme={currentProgramme}
        currentDailyProgramme={currentDailyProgramme}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
        isHoliday={isHoliday}
      />

      {showReport && (
        <div className="mt-10 h-screen overflow-y-scroll">
          <div ref={targetRef}>
            <ProgressReport progressSummary={progressSummary!} />
          </div>
        </div>
      )}
      {showInitialWalkthrough && (
        <ProgrammeWalkthroughStart
          onClose={() => setShowInitialWalkthrough(false)}
        />
      )}
    </BannerWrapper>
  );
};

export default ProgrammeDashboard;
