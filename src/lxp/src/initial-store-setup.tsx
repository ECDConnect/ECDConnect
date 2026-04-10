import { endOfMonth, startOfMonth, subMonths } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import Loader from './components/loader/loader';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAppDispatch } from './store';
import { attendanceThunkActions } from './store/attendance';
import { authActions } from './store/auth';
import { caregiverActions } from './store/caregiver';
import { childrenActions, childrenThunkActions } from './store/children';
import {
  classroomsActions,
  classroomsSelectors,
  classroomsThunkActions,
} from './store/classroom';
import { contentConsentThunkActions } from './store/content/consent';
import { programmeRoutineActions } from './store/content/programme-routine';
import { programmeThemeActions } from './store/content/programme-theme';
import { contentReportActions } from './store/content/report';
import { storyBookActions } from './store/content/story-book';
import { documentActions, documentThunkActions } from './store/document';
import { notesActions, notesThunkActions } from './store/notes';
import { progressTrackingThunkActions } from './store/progress-tracking';
import { settingActions, settingThunkActions } from './store/settings';
import { staticDataThunkActions } from './store/static-data';
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
import { authSelectors } from '@store/auth';
import { statementsActions, statementsThunkActions } from '@store/statements';
import {
  LocalStorageKeys,
  ResourceLocaleId,
  RoleSystemNameEnum,
} from '@ecdlink/core';
import { communityActions, communityThunkActions } from './store/community';
import { ClassroomService } from './services/ClassroomService';
import { pointsActions, pointsThunkActions } from './store/points';
import { notificationActions } from './store/notifications';
import { pqaActions } from './store/pqa';
import { googleLogout } from '@react-oauth/google';
import { CmsSyncStatus } from '@ecdlink/graphql';
import { resourcesThunkActions } from './store/resources';
import { activityActions } from './store/content/activity';
import { invitesThunkActions } from './store/invites';

type IntialStoreSetupContextValues = {
  initLoading: boolean;
  initStoreSetup: () => Promise<void>;
  resetAppStore: (showLoading?: boolean, isSync?: boolean) => Promise<void>;
  resetAuth: () => Promise<void>;
  resetUser: () => Promise<void>;
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
  const [initLoading, setInitLoading] = useState(false);
  const [staticDataLoading, setStaticDataLoading] = useState(false);
  const userData = useSelector(userSelectors.getUser);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const isCoach = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Coach
  );
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const classroomForUser = useSelector(classroomsSelectors.getClassroom);
  const isPrincipal = userData?.roles?.some(
    (role) => role.systemName === RoleSystemNameEnum.Principal
  );
  const [otherLoading, setOtherLoading] = useState(false);

  const resetAuth = async () => {
    if (userAuth?.loginType === 'google') {
      googleLogout();
    }
    // not logout for Facebook it appears...
    appDispatch(authActions.resetAuthState());
  };

  const resetUser = async () => {
    appDispatch(userActions.resetUserState());
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
    appDispatch(analyticsActions.resetAnalyticsState());
    appDispatch(settingActions.resetSettingsState());
  };

  const resetAdditionalStoreSetup = async (isSync?: boolean) => {
    if (!isSync) {
      appDispatch(userActions.resetUserState());
    }
    appDispatch(calendarActions.resetCalendarState());
    appDispatch(caregiverActions.resetCaregiverState());
    appDispatch(childrenActions.resetChildrenState());
    appDispatch(classroomsActions.resetClassroomState());
    appDispatch(classroomsForCoachActions.resetClassroomState());
    appDispatch(coachActions.resetCoachState());
    appDispatch(communityActions.resetCommunityConnectState());
    appDispatch(contentReportActions.resetContentReportState());
    appDispatch(documentActions.resetDocumentsState());
    appDispatch(notesActions.resetNotesState());
    appDispatch(notificationActions.resetNotificationState());
    appDispatch(notificationActions.resetFrontendNotificationState());
    appDispatch(pointsActions.resetPointsState());
    appDispatch(pqaActions.resetPQAState());
    appDispatch(practitionerActions.resetPractitionerState());
    appDispatch(practitionerForCoachActions.resetPractitionerState());
    appDispatch(programmeActions.resetProgrammeState());
    appDispatch(statementsActions.resetStatementsState());
  };

  const initStoreSetup = useCallback(async () => {
    if (!isOnline) return;

    setInitLoading(true);
    const cmsStatus = await appDispatch(
      staticDataThunkActions.getCmsSyncStatus()
    ).unwrap();
    appDispatch(settingActions.setLastCmsDataSync());

    await initCmsStaticStoreSetup(cmsStatus);

    await initStaticStoreSetup();

    await initAdditionalStoreSetup();

    setInitLoading(false);
  }, [isOnline, appDispatch]);

  const initAdditionalStoreSetup = async () => {
    // SPECIFIC DATA
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    // for attendance overview report
    const firstDayOfMonth = new Date(
      startOfMonth(new Date()).setHours(23, 59, 59)
    );
    const lastDayOfMonth = endOfMonth(new Date());
    setOtherLoading(true);

    const promises: Promise<any>[] = !isCoach
      ? [
          appDispatch(
            practitionerThunkActions.getAllPractitioners({
              overrideCache: true,
            })
          ).unwrap(),
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
        ]
      : [
          appDispatch(
            calendarThunkActions.getCalendarEvents({
              start: subMonths(
                new Date(new Date().getFullYear(), new Date().getMonth(), 0),
                1
              ),
            })
          ),
        ];

    if (isPrincipal) {
      promises.push(
        appDispatch(
          childrenThunkActions.getChildrenForClassroom({
            userId: userData?.id!,
          })
        ).unwrap()
      );
      promises.push(
        appDispatch(
          invitesThunkActions.getInvitesByPrincipalId({
            userId: userData?.id!,
          })
        ).unwrap()
      );
    } else {
      promises.push(appDispatch(childrenThunkActions.getChildren({})).unwrap());
    }
    if (!isCoach) {
      promises.push(
        appDispatch(classroomsThunkActions.getClassroomForUser({})).unwrap()
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
          attendanceThunkActions.getClassroomAttendanceReport({
            startDate: firstDayOfMonth,
            endDate: lastDayOfMonth,
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

  const initCmsStaticStoreSetup = async (cmsStatus: CmsSyncStatus) => {
    setStaticDataLoading(true);

    const promises: Promise<any>[] = isCoach
      ? [
          appDispatch(
            contentConsentThunkActions.getConsent({
              locale: 'en-za',
              overrideCache: cmsStatus?.syncConsent,
            })
          ).unwrap(),

          appDispatch(
            calendarThunkActions.getCalendarEventTypes({
              locale: 'en-za',
              overrideCache: cmsStatus?.syncCalendarEventTypes,
            })
          ).unwrap(),

          appDispatch(
            staticDataThunkActions.getHolidays({
              year: new Date().getFullYear(),
              overrideCache: cmsStatus?.syncHolidays,
            })
          ).unwrap(),
        ]
      : [
          appDispatch(
            contentConsentThunkActions.getConsent({
              locale: 'en-za',
              overrideCache: cmsStatus?.syncConsent,
            })
          ).unwrap(),

          appDispatch(
            calendarThunkActions.getCalendarEventTypes({
              locale: 'en-za',
              overrideCache: cmsStatus?.syncCalendarEventTypes,
            })
          ).unwrap(),

          appDispatch(
            staticDataThunkActions.getHolidays({
              year: new Date().getFullYear(),
              overrideCache: cmsStatus?.syncHolidays,
            })
          ).unwrap(),

          appDispatch(
            progressTrackingThunkActions.getResourceLinks({
              locale: 'en-za',
              force: cmsStatus?.syncResourceLinks,
            })
          ).unwrap(),
          appDispatch(
            resourcesThunkActions.getResources({
              locale: ResourceLocaleId,
              sectionType: 'business',
              overrideCache: cmsStatus?.syncResources,
            })
          ).unwrap(),
          appDispatch(
            resourcesThunkActions.getResources({
              locale: ResourceLocaleId,
              sectionType: 'classroom',
              overrideCache: cmsStatus?.syncResources,
            })
          ).unwrap(),
        ];

    // clear non persistent activity planning data if data changed in the database
    if (cmsStatus?.syncActivities) {
      appDispatch(activityActions.resetActivityState());
    }
    if (cmsStatus?.syncProgrammeRoutines) {
      appDispatch(programmeRoutineActions.resetProgrammeRoutine());
    }
    if (cmsStatus?.syncProgrammeThemes) {
      appDispatch(programmeThemeActions.resetProgrammeTheme());
    }
    if (cmsStatus?.syncStoryBooks) {
      appDispatch(storyBookActions.resetStoryBookState());
    }

    Promise.allSettled(promises).then((results) => {
      setStaticDataLoading(false);
    });
  };

  const initStaticStoreSetup = async () => {
    setStaticDataLoading(true);

    const promises: Promise<any>[] = !isCoach
      ? [
          appDispatch(settingThunkActions.getSettings({})).unwrap(),
          appDispatch(staticDataThunkActions.getProvinces({})).unwrap(),
          appDispatch(staticDataThunkActions.getGrants({})).unwrap(),
          appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap(),
          appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap(),
          appDispatch(staticDataThunkActions.getPermissions({})).unwrap(),
          // move to communnity
          appDispatch(staticDataThunkActions.getCommunitySkills({})).unwrap(),
          appDispatch(staticDataThunkActions.getGenders({})).unwrap(),
          appDispatch(staticDataThunkActions.getRaces({})).unwrap(),
          appDispatch(staticDataThunkActions.getRelations({})).unwrap(),
          appDispatch(staticDataThunkActions.getLanguages({})).unwrap(),
          appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap(),
          appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap(),
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
          // Progress tracking
          appDispatch(
            progressTrackingThunkActions.getProgressTrackingContent({
              locale: 'en-za',
            })
          ).unwrap(),
          appDispatch(
            progressTrackingThunkActions.getProgressTrackingAgeGroups({
              locale: 'en-za',
            })
          ).unwrap(),
        ]
      : [appDispatch(settingThunkActions.getSettings({})).unwrap()];

    Promise.allSettled(promises).then((results) => {
      setStaticDataLoading(false);
    });
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

  const refreshClassroom = async () => {
    appDispatch(classroomsActions.resetClassroomState());
    appDispatch(
      classroomsThunkActions.getClassroomForUser({ overrideCache: true })
    ).unwrap();
    appDispatch(
      classroomsThunkActions.getClassroomGroups({ overrideCache: true })
    ).unwrap();
    appDispatch(settingActions.setLastDataSync());

    if (isCoach) {
      appDispatch(classroomsForCoachActions.resetClassroomState());
      await appDispatch(
        classroomsForCoachThunkActions.getClassroomForCoach({})
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
    initLoading,
    initStoreSetup,
    resetAppStore,
    resetAuth,
    resetUser,
    getLoadingMessage,
    syncClassroom,
    refreshClassroom,
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
    }
    if (userData) {
      // if we have unsynced statements, this will override the values which should not happen
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
    if (userData && practitioner?.principalHierarchy && !classroomForUser)
      handleNoClassroomForInvitedUser();
  }, [
    classroomForUser,
    handleNoClassroomForInvitedUser,
    practitioner?.principalHierarchy,
  ]);

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
            practitionerThunkActions.getAllPractitioners({
              overrideCache: true,
            })
          ).unwrap())();
        (async () =>
          await appDispatch(
            practitionerForCoachThunkActions.getPractitionersForCoach({})
          ).unwrap())();
        (async (id) =>
          await appDispatch(
            classroomsForCoachThunkActions.getClassroomForCoach({})
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

  return (
    <IntialStoreSetupContext.Provider value={values}>
      {!initLoading && children}
      {initLoading && <Loader loadingMessage={getLoadingMessage()} />}
    </IntialStoreSetupContext.Provider>
  );
};

export default InitialStoreSetup;
