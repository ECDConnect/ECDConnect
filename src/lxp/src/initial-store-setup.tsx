import { getYear, getMonth, getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
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
import localforage from 'localforage';
import hash from 'object-hash';
import { userSelectors } from '@store/user';
import { useSelector } from 'react-redux';
import {
  childrenForPractitionerActions,
  childrenForPractitionerThunkActions,
} from './store/childrenForPractitioner';
import { PractitionerDto } from '@ecdlink/core';

type IntialStoreSetupContextValues = {
  initloading: boolean;
  initStoreSetup: () => Promise<void>;
  resetAppStore: (showLoading?: boolean) => Promise<void>;
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
  const practitioners = useSelector(practitionerSelectors?.getPractitioners);
  const practitioner = useSelector(practitionerSelectors?.getPractitioner);
  const isPrincipal = practitioner?.isPrincipal;

  const [otherLoading, setOtherLoading] = useState(false);

  const [shouldSaveStateHash, setShouldSaveStateHash] = useState(false);

  const { sync, analytics, settings, notifications, ...state } = useAppSelector(
    (state) => state
  );

  const resetAuth = async () => {
    await appDispatch(authActions.resetAuthState());
  };

  useEffect(() => {
    if (userData) {
      if (isCoach) {
        (async () =>
          await appDispatch(
            coachThunkActions.getCoachByCoachId({})
          ).unwrap())();
      }
    }
  }, [appDispatch, isCoach, userData]);

  useEffect(() => {
    if (userData) {
      if (practitioners && practitioners?.length > 0) {
        const currentPractitioner = practitioners.find(
          (item) => item?.userId === userData?.id!
        ) as PractitionerDto;
        (async () =>
          await appDispatch(
            practitionerThunkActions.getPractitionerById({
              id: currentPractitioner?.id!,
            })
          ).unwrap())();
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
      setShouldSaveStateHash(true);
    }
  };

  useEffect(() => {
    if (shouldSaveStateHash) {
      localforage.setItem('state:hash', hash(state));
      setShouldSaveStateHash(false);
    }
  }, [state, shouldSaveStateHash]);

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
    // await appDispatch(coachThunkActions.getCoachByCoachId({})).unwrap();
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
    resetAppStore,
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
