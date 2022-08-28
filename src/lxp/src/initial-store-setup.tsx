import { getYear, getMonth, getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Loader from './components/loader/loader';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAppDispatch } from './store';
import { attendanceActions, attendanceThunkActions } from './store/attendance';
import { authActions } from './store/auth';
import { caregiverActions, caregiverThunkActions } from './store/caregiver';
import { childrenActions, childrenThunkActions } from './store/children';
import { classroomsActions, classroomsThunkActions } from './store/classroom';
import {
  activityActions,
  activityThunkActions,
} from './store/content/activity';
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
import {
  contentReportActions,
  contentReportThunkActions,
} from './store/content/report';
import {
  storyBookActions,
  storyBookThunkActions,
} from './store/content/story-book';
import { documentActions, documentThunkActions } from './store/document';
import { notesActions, notesThunkActions } from './store/notes';
import { notificationActions } from './store/notifications';
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
  practitionerThunkActions,
} from './store/practitioner';
import {
  practitionerForCoachActions,
  practitionerForCoachThunkActions,
} from './store/practitionerForCoach';
import { analyticsActions } from './store/analytics';
import { userSelectors } from '@store/user';
import { useSelector } from 'react-redux';

type IntialStoreSetupContextValues = {
  initloading: boolean;
  initStoreSetup: () => Promise<void>;
  resetAppStaticStores: (showLoading?: boolean) => Promise<void>;
  resetAuth: () => Promise<void>;
  getLoadingMessage: () => string;
  syncClassroom: () => Promise<void>;
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

  const [otherLoading, setOtherLoading] = useState(false);

  const resetAuth = async () => {
    await appDispatch(authActions.resetAuthState());
  };

  useEffect(() => {
    if (userData) {
      (async () =>
        await appDispatch(coachThunkActions.getCoachByUserId({})).unwrap())();
    }
  }, [appDispatch, userData]);

  const resetAppStaticStores = async (showLoading = true) => {
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
    await appDispatch(staticDataActions.resetStaticDataState());
    await appDispatch(progressTrackingActions.resetProgressTrackingState());
    await appDispatch(programmeRoutineActions.resetProgrammeThemeState());
    await appDispatch(activityActions.resetActivityState());
    await appDispatch(storyBookActions.resetStoryBookState());
    await appDispatch(programmeThemeActions.resetProgrammeThemeState());
    await appDispatch(contentConsentActions.resetContentConsentState());
    await appDispatch(notificationActions.resetNotificationState());
    await appDispatch(settingActions.resetSettingsState());
    await appDispatch(analyticsActions.resetAnalyticsState());
  };

  const resetAdditionalStoreSetup = async () => {
    await appDispatch(notesActions.resetNotesState());
    await appDispatch(classroomsActions.resetClassroomState());
    await appDispatch(userActions.resetUserState());
    await appDispatch(coachActions.resetCoachState());
    await appDispatch(practitionerActions.resetPractitionerState());
    await appDispatch(practitionerForCoachActions.resetPractitionerState());
    await appDispatch(childrenActions.resetChildrenState());
    await appDispatch(caregiverActions.resetCaregiverState());
    await appDispatch(documentActions.resetDocumentsState());
    await appDispatch(attendanceActions.resetAttendanceState());
    await appDispatch(contentReportActions.resetContentReportState());
  };

  const initStoreSetup = async () => {
    if (isOnline) {
      setInitLoading(true);
      await initStaticStoreSetup();
      await initAdditionalStoreSetup();
      await appDispatch(settingActions.setLastDataSync());
      setInitLoading(false);
    }
  };

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
    // await appDispatch(coachThunkActions.getCoachByUserId({})).unwrap();
    await appDispatch(
      practitionerForCoachThunkActions.getPractitionersForCoach({})
    ).unwrap();
    await appDispatch(
      practitionerThunkActions.getAllPractitioners({})
    ).unwrap();
    await appDispatch(childrenThunkActions.getChildren({})).unwrap();
    await appDispatch(caregiverThunkActions.getCaregivers({})).unwrap();
    await appDispatch(documentThunkActions.getDocuments({})).unwrap();
    await appDispatch(
      contentReportThunkActions.getChildProgressReportSummary(10)
    ).unwrap();
    await appDispatch(
      attendanceThunkActions.getAttendance({
        year: getYear(new Date()),
        monthOfYear: getMonth(new Date()) + 1,
        weekOfYear: getWeek(new Date(), { weekStartsOn: 1 }) - 1,
      })
    ).unwrap();

    setOtherLoading(false);
  };

  const initStaticStoreSetup = async () => {
    const today = new Date();
    setStaticDataLoading(true);
    await appDispatch(
      contentConsentThunkActions.getConsent({ locale: 'en-za' })
    ).unwrap();
    await appDispatch(settingThunkActions.getSettings({})).unwrap();
    await appDispatch(staticDataThunkActions.getRelations({})).unwrap();
    await appDispatch(staticDataThunkActions.getProgrammeTypes({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getProgrammeAttendanceReasons({})
    ).unwrap();
    await appDispatch(staticDataThunkActions.getGenders({})).unwrap();
    await appDispatch(staticDataThunkActions.getRaces({})).unwrap();
    await appDispatch(staticDataThunkActions.getLanguages({})).unwrap();
    await appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getHolidays({ year: today.getFullYear() })
    ).unwrap();
    await appDispatch(staticDataThunkActions.getProvinces({})).unwrap();
    await appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap();
    await appDispatch(staticDataThunkActions.getGrants({})).unwrap();
    await appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap();

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

    await appDispatch(
      programmeRoutineThunkActions.getProgrammeRoutines({ locale: 'en-za' })
    ).unwrap();

    await appDispatch(
      activityThunkActions.getActivities({ locale: 'en-za' })
    ).unwrap();

    await appDispatch(
      storyBookThunkActions.getStoryBooks({ locale: 'en-za' })
    ).unwrap();

    await appDispatch(
      programmeThemeThunkActions.getProgrammeThemes({ locale: 'en-za' })
    ).unwrap();

    setStaticDataLoading(false);
  };

  const syncClassroom = async () => {
    await appDispatch(classroomsThunkActions.upsertClassroom({})).unwrap();
    await appDispatch(
      classroomsThunkActions.upsertClassroomGroups({})
    ).unwrap();
    await appDispatch(
      classroomsThunkActions.upsertClassroomGroupProgrammes({})
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
    resetAppStaticStores,
    resetAuth,
    getLoadingMessage,
    syncClassroom,
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
