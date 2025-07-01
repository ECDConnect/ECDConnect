import { subMonths, startOfQuarter, lastDayOfQuarter } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import Loader from './components/loader/loader';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAppDispatch } from './store';
import { attendanceActions, attendanceThunkActions } from './store/attendance';
import { authActions } from './store/auth';
import { caregiverActions } from './store/caregiver';
import { childrenActions, childrenThunkActions } from './store/children';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from './store/classroom';
import { activityActions } from './store/content/activity';
import {
  contentConsentActions,
  contentConsentThunkActions,
} from './store/content/consent';
import {
  programmeRoutineActions,
  programmeRoutineThunkActions,
} from './store/content/programme-routine';
import {
  programmeThemeActions,
  programmeThemeThunkActions,
} from './store/content/programme-theme';
import { contentReportActions } from './store/content/report';
import {
  storyBookActions,
  storyBookThunkActions,
} from './store/content/story-book';
import { documentActions, documentThunkActions } from './store/document';
import { notesActions, notesThunkActions } from './store/notes';
import {
  progressTrackingActions,
  progressTrackingThunkActions,
} from './store/progress-tracking';
import { settingActions, settingThunkActions } from './store/settings';
import { staticDataActions, staticDataThunkActions } from './store/static-data';
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
import { userSelectors } from '@store/user';
import { useSelector } from 'react-redux';
import {
  classroomsForCoachThunkActions,
  classroomsForCoachActions,
} from './store/classroomForCoach';
import { programmeActions, programmeThunkActions } from './store/programme';
import { calendarActions, calendarThunkActions } from './store/calendar';
import { activityThunkActions } from '@store/content/activity';
import { authSelectors } from '@store/auth';
import { statementsActions, statementsThunkActions } from '@store/statements';
import { LocalStorageKeys, RoleSystemNameEnum } from '@ecdlink/core';
import { communityThunkActions } from './store/community';
import { ClassroomService } from './services/ClassroomService';
import { pointsThunkActions } from './store/points';

type IntialStoreSetupContextValues = {
  initloading: boolean;
  initStoreSetup: () => Promise<void>;
  resetAppStore: (showLoading?: boolean, isSync?: boolean) => Promise<void>;
  resetAuth: () => Promise<void>;
  getLoadingMessage: () => string;
  syncClassroom: () => Promise<void>;
  refreshClassroom: () => Promise<void>;
  refreshChildren: () => Promise<void>;
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
  const userAuth = useSelector(authSelectors.getAuthUser);
  const isCoach = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const classroomForUser = useSelector(classroomsSelectors.getClassroom);
  const isPrincipal = practitioner?.isPrincipal;
  const [otherLoading, setOtherLoading] = useState(false);

  const [shouldSaveStateHash, setShouldSaveStateHash] = useState(false);
  const quarterStartDate = startOfQuarter(new Date());
  const quarterLastDay = lastDayOfQuarter(new Date());

  const resetAuth = async () => {
    appDispatch(authActions.resetAuthState());
  };

  const resetAppStore = async (showLoading = true, isSync = false) => {
    if (showLoading) {
      setInitLoading(true);
    }
    await resetStaticStoreSetup();
    await resetAdditionalStoreSetup(isSync);
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
    appDispatch(settingActions.resetSettingsState());
    appDispatch(analyticsActions.resetAnalyticsState());
    appDispatch(programmeActions.resetProgrammeState());
    appDispatch(statementsActions.resetStatementsStaticState());
  };

  const resetAdditionalStoreSetup = async (isSync?: boolean) => {
    if (!isSync) {
      appDispatch(userActions.resetUserState());
    }
    appDispatch(notesActions.resetNotesState());
    appDispatch(classroomsActions.resetClassroomState());
    appDispatch(classroomsForCoachActions.resetClassroomState());
    appDispatch(coachActions.resetCoachState());
    appDispatch(practitionerActions.resetPractitionerState());
    appDispatch(practitionerForCoachActions.resetPractitionerState());
    appDispatch(childrenActions.resetChildrenState());
    appDispatch(caregiverActions.resetCaregiverState());
    appDispatch(documentActions.resetDocumentsState());
    appDispatch(attendanceActions.resetAttendanceState());
    appDispatch(contentReportActions.resetContentReportState());
    appDispatch(statementsActions.resetStatementsState());
    appDispatch(calendarActions.resetCalendarState());
  };

  const initStoreSetup = useCallback(async () => {
    if (isOnline) {
      setInitLoading(true);
      await initStaticStoreSetup();

      if (!!userData) {
        await initAdditionalStoreSetup();
      }
      appDispatch(settingActions.setLastDataSync());
      setInitLoading(false);
      setShouldSaveStateHash(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const initAdditionalStoreSetup = async () => {
    // SPECIFIC DATA
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    setOtherLoading(true);

    const promises: Promise<any>[] = [
      appDispatch(childrenThunkActions.getChildren({})).unwrap(),
      appDispatch(practitionerThunkActions.getAllPractitioners({})).unwrap(),
      appDispatch(documentThunkActions.getDocuments({})).unwrap(),
      appDispatch(staticDataThunkActions.getRoles({})).unwrap(),
      appDispatch(notesThunkActions.getNotes({})).unwrap(),
      appDispatch(programmeThunkActions.getUserProgrammes({})).unwrap(),
      appDispatch(userThunkActions.getUserConsents({})).unwrap(),
      appDispatch(
        calendarThunkActions.getCalendarEvents({
          start: subMonths(
            new Date(new Date().getFullYear(), new Date().getMonth(), 0),
            1
          ),
        })
      ),
    ];

    if (!isCoach) {
      promises.push(
        appDispatch(classroomsThunkActions.getClassroom({})).unwrap()
      );
      promises.push(
        appDispatch(
          communityThunkActions.getCommunityProfile({ userId: userData?.id! })
        ).unwrap()
      );
      promises.push(
        appDispatch(classroomsThunkActions.getClassroomGroups({})).unwrap()
      );
      promises.push(
        appDispatch(
          progressTrackingThunkActions.getChildProgressReports({})
        ).unwrap()
      );
      promises.push(
        appDispatch(
          attendanceThunkActions.getAttendance({
            startDate: thirtyDaysAgo,
            endDate: new Date(),
          })
        ).unwrap()
      );
      promises.push(
        appDispatch(
          practitionerThunkActions.getPractitionerPermissions({
            userId: practitioner?.userId!,
          })
        ).unwrap()
      );
      promises.push(
        appDispatch(
          pointsThunkActions.pointsTodoItems({ userId: userData?.id! })
        ).unwrap()
      );

      promises.push(
        appDispatch(
          pointsThunkActions.yearPointsView({ userId: userData?.id! })
        ).unwrap()
      );

      promises.push(
        appDispatch(
          pointsThunkActions.sharedData({
            userId: userData?.id!,
            isMonthly: true,
          })
        ).unwrap()
      );

      const currentDate = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setMonth(currentDate.getMonth() - 12);

      promises.push(
        (async () =>
          await appDispatch(
            pointsThunkActions.getPointsSummaryForUser({
              userId: userData?.id!,
              startDate: oneYearAgo,
              endDate: currentDate,
            })
          ).unwrap())()
      );
    }
    await Promise.allSettled(promises);
    setOtherLoading(false);
  };

  const initStaticStoreSetup = async () => {
    setStaticDataLoading(true);
    const promises = [
      appDispatch(settingThunkActions.getSettings({})).unwrap(),
      appDispatch(
        staticDataThunkActions.getHolidays({ year: new Date().getFullYear() })
      ).unwrap(),
      appDispatch(staticDataThunkActions.getProvinces({})).unwrap(),
      appDispatch(staticDataThunkActions.getGrants({})).unwrap(),
      appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap(),
      appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap(),
      appDispatch(staticDataThunkActions.getPermissions({})).unwrap(),
      appDispatch(staticDataThunkActions.getCommunitySkills({})).unwrap(),
      appDispatch(staticDataThunkActions.getGenders({})).unwrap(),
      appDispatch(staticDataThunkActions.getRaces({})).unwrap(),
      appDispatch(staticDataThunkActions.getRelations({})).unwrap(),
      appDispatch(staticDataThunkActions.getLanguages({})).unwrap(),
      appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap(),
      appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap(),

      appDispatch(
        contentConsentThunkActions.getConsent({ locale: 'en-za' })
      ).unwrap(),
      appDispatch(
        calendarThunkActions.getCalendarEventTypes({
          locale: 'en-za',
        })
      ).unwrap(),
      appDispatch(staticDataThunkActions.getProgrammeTypes({})).unwrap(),

      appDispatch(
        staticDataThunkActions.getProgrammeAttendanceReasons({})
      ).unwrap(),

      appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap(),
      appDispatch(
        staticDataThunkActions.getReasonsForPractitionerLeaving({})
      ).unwrap(),
      appDispatch(
        staticDataThunkActions.getReasonsForPractitionerLeavingProgramme({})
      ).unwrap(),
      appDispatch(
        activityThunkActions.getActivities({ locale: 'en-za' })
      ).unwrap(),
      appDispatch(
        storyBookThunkActions.getStoryBooks({ locale: 'en-za' })
      ).unwrap(),
      appDispatch(
        programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
      ).unwrap(),
      appDispatch(
        progressTrackingThunkActions.getProgressTrackingAgeGroups({
          locale: 'en-za',
        })
      ).unwrap(),
      appDispatch(
        progressTrackingThunkActions.getProgressTrackingContent({
          locale: 'en-za',
        })
      ).unwrap(),
      appDispatch(
        progressTrackingThunkActions.getResourceLinks({
          locale: 'en-za',
        })
      ).unwrap(),
      appDispatch(
        programmeRoutineThunkActions.getProgrammeRoutines({ locale: 'en-za' })
      ).unwrap(),
    ];

    Promise.allSettled(promises);
    setStaticDataLoading(false);
  };

  const syncClassroom = async () => {
    await appDispatch(classroomsThunkActions.upsertClassroom({})).unwrap();
    await appDispatch(
      classroomsThunkActions.upsertClassroomGroups({})
    ).unwrap();
    await appDispatch(
      classroomsThunkActions.upsertClassroomGroupLearners({})
    ).unwrap();
  };

  const refreshChildren = async () => {
    appDispatch(settingActions.setLastDataSync());
    appDispatch(
      childrenThunkActions.getChildren({ overrideCache: true })
    ).unwrap();
    appDispatch(
      documentThunkActions.getDocuments({ overrideCache: true })
    ).unwrap();
    appDispatch(
      classroomsThunkActions.getClassroomGroups({ overrideCache: true })
    ).unwrap();
  };

  const refreshClassroom = async () => {
    appDispatch(classroomsActions.resetClassroomState());
    appDispatch(
      classroomsThunkActions.getClassroom({ overrideCache: true })
    ).unwrap();
    appDispatch(
      classroomsThunkActions.getClassroomGroups({ overrideCache: true })
    ).unwrap();
    appDispatch(settingActions.setLastDataSync());

    if (isCoach) {
      appDispatch(classroomsForCoachActions.resetClassroomState());
      await appDispatch(
        classroomsForCoachThunkActions.getClassroomForCoach({
          id: userData?.id!,
        })
      ).unwrap();
      await appDispatch(
        classroomsForCoachThunkActions.getClassroomGroupsForCoach({})
      ).unwrap();
    }
  };

  const getLoadingMessage = () => {
    let message = 'Waking up the robots';

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
    refreshChildren,
  };

  useEffect(() => {
    async function init() {
      if (userAuth && !!userAuth.resetData) {
        await resetAppStore();
      }
      await initStoreSetup();
      appDispatch(userActions.updateUserResetData(false));
    }
    init().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData && !!userData?.id && !isCoach) {
      (async () =>
        await appDispatch(
          practitionerThunkActions.getPractitionerByUserId({
            userId: userData?.id || '',
          })
        ).unwrap())();
      (async () =>
        await appDispatch(
          practitionerThunkActions.getPractitionerDisplayMetrics({
            userType: 'practitioner',
          })
        ).unwrap())();
    }
    if (userData) {
      if (isPrincipal) {
        const startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        (async () =>
          await appDispatch(
            statementsThunkActions.getIncomeStatements({
              startDate: startDate,
              endDate: undefined,
            })
          ).unwrap())();
      }
    }
  }, [appDispatch, userData, isCoach, isPrincipal]);

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
    }
  }, [appDispatch, userData, practitioner, isCoach]);

  useEffect(() => {
    if (userData) {
      if (isCoach) {
        (async () =>
          await appDispatch(coachThunkActions.getCoachByUserId({})).unwrap())();
        (async () =>
          await appDispatch(
            practitionerThunkActions.getAllPractitioners({})
          ).unwrap())();
        (async () =>
          await appDispatch(
            practitionerForCoachThunkActions.getPractitionersForCoach({})
          ).unwrap())();
        (async (id) =>
          await appDispatch(
            classroomsForCoachThunkActions.getClassroomForCoach({
              id: userData?.id!,
            })
          ).unwrap())();
        (async () =>
          await appDispatch(
            classroomsForCoachThunkActions.getClassroomGroupsForCoach({})
          ).unwrap())();
        (async () =>
          await appDispatch(
            practitionerThunkActions.getPractitionerDisplayMetrics({
              userType: 'coach',
            })
          ).unwrap())();
      }
      if (!isCoach) {
        const currentDate = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setMonth(currentDate.getMonth() - 12);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appDispatch, userData, isCoach]);

  const handleNoClassroomForInvitedUser = useCallback(async () => {
    const classroom = await new ClassroomService(
      userAuth?.auth_token!
    ).getClassroomForUser(practitioner?.principalHierarchy!);
    if (classroom) {
      localStorage.setItem(
        LocalStorageKeys.classroomForInvitedUser,
        classroom?.name
      );
    }
  }, [practitioner?.principalHierarchy, userAuth?.auth_token]);

  useEffect(() => {
    if (practitioner?.principalHierarchy && !classroomForUser)
      handleNoClassroomForInvitedUser();
  }, [
    classroomForUser,
    handleNoClassroomForInvitedUser,
    practitioner?.principalHierarchy,
  ]);

  return (
    <IntialStoreSetupContext.Provider value={values}>
      {!initloading && children}
      {initloading && <Loader loadingMessage={getLoadingMessage()} />}
    </IntialStoreSetupContext.Provider>
  );
};

export default InitialStoreSetup;
