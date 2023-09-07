import { getYear, getMonth, getWeek, subMonths } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import Loader from './components/loader/loader';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAppDispatch, useAppSelector } from './store';
import { attendanceActions, attendanceThunkActions } from './store/attendance';
import { authActions } from './store/auth';
import { caregiverActions, caregiverThunkActions } from './store/caregiver';
import { childrenActions, childrenThunkActions } from './store/children';
import { classroomsActions, classroomsThunkActions } from './store/classroom';
import { activityActions } from './store/content/activity';
import {
  contentConsentActions,
  contentConsentThunkActions,
} from './store/content/consent';
import {
  programmeRoutineActions,
  programmeRoutineThunkActions,
} from './store/content/programme-routine';
import { programmeThemeActions } from './store/content/programme-theme';
import {
  contentReportActions,
  contentReportThunkActions,
} from './store/content/report';
import { storyBookActions } from './store/content/story-book';
import { documentActions, documentThunkActions } from './store/document';
import { notesActions, notesThunkActions } from './store/notes';
import { notificationActions } from './store/notifications';
import {
  progressTrackingActions,
  progressTrackingThunkActions,
} from './store/progress-tracking';
import { settingActions } from './store/settings';
import { staticDataActions } from './store/static-data';
import { userActions, userThunkActions } from './store/user';
import { coachActions, coachThunkActions } from './store/coach';
import {
  practitionerActions,
  practitionerSelectors,
  practitionerThunkActions,
} from './store/practitioner';
import {
  practitionerForCoachActions,
  practitionerForCoachThunkActions,
} from './store/practitionerForCoach';
import { analyticsActions } from './store/analytics';
import localforage from 'localforage';
import hash from 'object-hash';
import { userSelectors } from '@store/user';
import { useSelector } from 'react-redux';
import { childrenForPractitionerThunkActions } from './store/childrenForPractitioner';
import { programmeActions, programmeThunkActions } from './store/programme';
import { traineeSelectors, traineeThunkActions } from './store/trainee';
import { calendarThunkActions } from './store/calendar';
import { pointsThunkActions } from './store/points';

type IntialStoreSetupContextValues = {
  initloading: boolean;
  initStoreSetup: () => Promise<void>;
  resetAppStore: (showLoading?: boolean) => Promise<void>;
  resetAuth: () => Promise<void>;
  getLoadingMessage: () => string;
  syncClassroom: () => Promise<void>;
  refreshClassroom: () => Promise<void>;
};

export const IntialStoreSetupContext =
  React.createContext<IntialStoreSetupContextValues>(
    {} as IntialStoreSetupContextValues
  );

const InitialStoreSetup: React.FC = ({ children }) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [initloading, setInitLoading] = useState(false);
  const [staticDataLoading, setStaticDataLoading] = useState(false);
  const userData = useSelector(userSelectors.getUser);
  const isCoach = userData?.roles?.some((role) => role.name === 'Coach');
  const practitioners = useSelector(practitionerSelectors?.getPractitioners);
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;

  const traineeTimeline = useSelector(
    traineeSelectors.getTraineeOnboardTimeline
  );
  const traineeVisits = traineeTimeline?.traineeVisits;
  const traineeCurrentVisit = traineeVisits?.[0];
  const [otherLoading, setOtherLoading] = useState(false);

  const [shouldSaveStateHash, setShouldSaveStateHash] = useState(false);

  const { sync, analytics, settings, notifications, ...state } = useAppSelector(
    (state) => state
  );

  const resetAuth = async () => {
    appDispatch(authActions.resetAuthState());
  };

  useEffect(() => {
    if (userData) {
      if (practitioner?.coachHierarchy) {
        if (!isCoach) {
          (async () =>
            await appDispatch(
              coachThunkActions.getCoachByCoachId({
                coachId: practitioner?.coachHierarchy!,
              })
            ).unwrap())();
        }
      }
      if (practitioner?.isTrainee) {
        (async () =>
          await appDispatch(
            traineeThunkActions.getTraineeTimeline({
              userId: practitioner?.userId ? practitioner?.userId : '',
            })
          ).unwrap())();

        (async () =>
          await appDispatch(
            traineeThunkActions.getTraineeVisitData({
              visitId: traineeCurrentVisit?.id,
            })
          ).unwrap())();
      }
    }
  }, [appDispatch, userData, practitioner, isCoach, traineeCurrentVisit?.id]);

  useEffect(() => {
    if (userData) {
      (async () =>
        await appDispatch(
          traineeThunkActions.getTraineeById({ userId: userData?.id! })
        ).unwrap())();
      if (isCoach) {
        (async () =>
          await appDispatch(coachThunkActions.getCoachByUserId({})).unwrap())();
        (async () =>
          await appDispatch(
            practitionerForCoachThunkActions.getPractitionersForCoach({})
          ).unwrap())();
      }
      if (!isCoach) {
        (async () =>
          await appDispatch(
            pointsThunkActions.getPointsSummaryForUser({
              userId: userData?.id!,
            })
          ).unwrap())();

        (async () =>
          await appDispatch(
            pointsThunkActions.getPointsLibrary({
              userId: userData?.id!,
            })
          ).unwrap())();
      }
    }
  }, [appDispatch, userData, isCoach, practitioner]);

  useEffect(() => {
    if (userData) {
      if (practitioners && practitioners?.length > 0) {
        const currentPractitioner = practitioners.find(
          (item) => item?.userId === userData?.id!
        );
        if (currentPractitioner) {
          (async () =>
            await appDispatch(
              practitionerThunkActions.getPractitionerById({
                id: currentPractitioner?.id || '',
              })
            ).unwrap())();
        }
      }
    }
  }, [appDispatch, userData, practitioners]);

  useEffect(() => {
    if (userData) {
      if (isPrincipal) {
        (async () =>
          await appDispatch(
            childrenForPractitionerThunkActions?.getChildrenForPractitioner({
              id: userData?.id!,
            })
          ).unwrap())();
      }
    }
  }, [appDispatch, isPrincipal, userData]);

  const resetAppStore = async (showLoading = true) => {
    if (showLoading) {
      setInitLoading(true);
    }
    await resetStaticStoreSetup();
    await resetAdditionalStoreSetup();
    if (showLoading) {
      setInitLoading(false);
    }
  };

  const resetStaticStoreSetup = async () => {
    appDispatch(staticDataActions.resetStaticDataState());
    appDispatch(progressTrackingActions.resetProgressTrackingState());
    appDispatch(programmeRoutineActions.resetProgrammeRoutineState());
    appDispatch(activityActions.resetActivityState());
    appDispatch(storyBookActions.resetStoryBookState());
    appDispatch(programmeThemeActions.resetProgrammeThemeState());
    appDispatch(contentConsentActions.resetContentConsentState());
    appDispatch(notificationActions.resetNotificationState());
    appDispatch(settingActions.resetSettingsState());
    appDispatch(analyticsActions.resetAnalyticsState());
    appDispatch(programmeActions.resetProgrammeState());
  };

  const resetAdditionalStoreSetup = async () => {
    appDispatch(notesActions.resetNotesState());
    appDispatch(classroomsActions.resetClassroomState());
    appDispatch(userActions.resetUserState());
    appDispatch(coachActions.resetCoachState());
    appDispatch(practitionerActions.resetPractitionerState());
    appDispatch(practitionerForCoachActions.resetPractitionerState());
    appDispatch(childrenActions.resetChildrenState());
    appDispatch(caregiverActions.resetCaregiverState());
    appDispatch(documentActions.resetDocumentsState());
    appDispatch(attendanceActions.resetAttendanceState());
    appDispatch(contentReportActions.resetContentReportState());
  };

  const initStoreSetup = useCallback(async () => {
    if (isOnline && !userData) {
      setInitLoading(true);
      await initStaticStoreSetup();
      await initAdditionalStoreSetup();
      appDispatch(settingActions.setLastDataSync());
      setInitLoading(false);
      setShouldSaveStateHash(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  // useEffect(() => {
  //   if (shouldSaveStateHash) {
  //     localforage.setItem('state:hash', hash(state));
  //     setShouldSaveStateHash(false);
  //   }
  // }, [state, shouldSaveStateHash]);

  const initAdditionalStoreSetup = async () => {
    // SPECIFIC DATA
    setOtherLoading(true);
    await appDispatch(notesThunkActions.getNotes({})).unwrap();
    await appDispatch(classroomsThunkActions.getClassroom({})).unwrap();
    await appDispatch(classroomsThunkActions.getClassroomGroups({})).unwrap();
    await appDispatch(
      classroomsThunkActions.getClassroomProgrammes({})
    ).unwrap();
    await appDispatch(
      classroomsThunkActions.getClassroomGroupLearners({})
    ).unwrap();
    await appDispatch(userThunkActions.getUser({})).unwrap();
    await appDispatch(userThunkActions.getUserConsents({})).unwrap();
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    await appDispatch(childrenThunkActions.getChildren({})).unwrap();
    await appDispatch(caregiverThunkActions.getCaregivers({})).unwrap();
    await appDispatch(documentThunkActions.getDocuments({})).unwrap();
    await appDispatch(contentReportThunkActions.getDetailedProgressReports(50));
    await appDispatch(
      contentReportThunkActions.getChildProgressReportSummary(50)
    ).unwrap();
    await appDispatch(programmeThunkActions.getUserProgrammes({})).unwrap();
    await appDispatch(
      attendanceThunkActions.getAttendance({
        year: getYear(new Date()),
        monthOfYear: getMonth(new Date()) + 1,
        weekOfYear: getWeek(new Date()),
      })
    ).unwrap();
    await appDispatch(
      calendarThunkActions.getCalendarEvents({
        start: subMonths(
          new Date(new Date().getFullYear(), new Date().getMonth(), 0),
          1
        ),
      })
    );
    setOtherLoading(false);
  };

  const initStaticStoreSetup = async () => {
    setStaticDataLoading(true);

    await appDispatch(
      contentConsentThunkActions.getConsent({ locale: 'en-za' })
    ).unwrap();

    // PROGRESS TRACKING
    await appDispatch(
      progressTrackingThunkActions.getProgressTrackingCategories({
        locale: 'en-za',
      })
    ).unwrap();
    await appDispatch(
      progressTrackingThunkActions.getProgressTrackingSubCategories({
        locale: 'en-za',
      })
    ).unwrap();
    await appDispatch(
      progressTrackingThunkActions.getProgressTrackingSkills({
        locale: 'en-za',
      })
    ).unwrap();
    await appDispatch(
      progressTrackingThunkActions.getProgressTrackingLevels({
        locale: 'en-za',
      })
    ).unwrap();

    // CALENDAR
    await appDispatch(
      calendarThunkActions.getCalendarEventTypes({
        locale: 'en-za',
      })
    ).unwrap();

    await appDispatch(
      programmeRoutineThunkActions.getProgrammeRoutines({ locale: 'en-za' })
    ).unwrap();

    setStaticDataLoading(false);
  };

  const syncClassroom = async () => {
    await appDispatch(classroomsThunkActions.upsertClassroom({})).unwrap();
    await appDispatch(
      classroomsThunkActions.upsertClassroomGroups({})
    ).unwrap();
    await appDispatch(
      classroomsThunkActions.updateClassroomGroupProgrammes({})
    ).unwrap();
    await appDispatch(
      classroomsThunkActions.updateClassroomGroupLearners({})
    ).unwrap();
  };

  const refreshClassroom = async () => {
    appDispatch(classroomsActions.resetClassroomState());
    await appDispatch(classroomsThunkActions.getClassroom({})).unwrap();
    await appDispatch(classroomsThunkActions.getClassroomGroups({})).unwrap();
    await appDispatch(
      classroomsThunkActions.getClassroomProgrammes({})
    ).unwrap();
    await appDispatch(
      classroomsThunkActions.getClassroomGroupLearners({})
    ).unwrap();
  };

  const getLoadingMessage = () => {
    let message = 'Loading . . .';

    if (staticDataLoading) {
      message = 'Loading static data . . .';
    }

    if (otherLoading) {
      message = 'Loading other data . . .';
    }

    return message;
  };

  const values = {
    initloading,
    initStoreSetup,
    resetAppStore,
    resetAuth,
    getLoadingMessage,
    syncClassroom,
    refreshClassroom,
  };

  useEffect(() => {
    async function init() {
      await initStoreSetup();
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IntialStoreSetupContext.Provider value={values}>
      {!initloading && children}
      {initloading && <Loader loadingMessage={getLoadingMessage()} />}
    </IntialStoreSetupContext.Provider>
  );
};

export default InitialStoreSetup;
