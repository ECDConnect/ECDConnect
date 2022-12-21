import { combineReducers, configureStore } from '@reduxjs/toolkit';
import localForage from 'localforage';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import {
  analyticsPersistConfig,
  analyticsReducer,
} from '../analytics/analytics';
import {
  attendancePersistConfig,
  attendanceReducer,
} from '../attendance/attendance';
import { authPersistConfig, authReducer } from '../auth';
import {
  caregiverPersistConfig,
  caregiverReducer,
} from '../caregiver/caregiver';
import { childrenPersistConfig, childrenReducer } from '../children/children';
import {
  classroomsPersistConfig,
  classroomsReducer,
} from '../classroom/classroom';
import {
  classroomsForCoachPersistConfig,
  classroomsForCoachReducer,
} from '../classroomForCoach/classroomForCoach';
import { activityReducer } from '../content/activity';
import { activityPersistConfig } from '../content/activity/activity';
import { contentConsentReducer } from '../content/consent/consent';
import {
  programmeRoutinePersistConfig,
  programmeRoutineReducer,
} from '../content/programme-routine/programme-routine';
import { programmeThemeReducer } from '../content/programme-theme/programme-theme';
import { contentReportReducer } from '../content/report';
import { contentReportPersistConfig } from '../content/report/report';
import {
  storyBookPersistConfig,
  storyBookReducer,
} from '../content/story-book/story-book';
import { documentPersistConfig, documentReducer } from '../document/document';
import { notesPersistConfig, notesReducer } from '../notes/notes';
import {
  notificationPersistConfig,
  notificationReducer,
} from '../notifications/notifications';
import {
  practitionerPersistConfig,
  practitionerReducer,
} from '../practitioner/practitioner';
import {
  practitionerForCoachPersistConfig,
  practitionerForCoachReducer,
} from '../practitionerForCoach/practitionerForCoach';
import { coachPersistConfig, coachReducer } from '../coach/coach';
import {
  programmePersistConfig,
  programmeReducer,
} from '../programme/programme';
import {
  progressTrackingPersistConfig,
  progressTrackingReducer,
} from '../progress-tracking/progress-tracking';
import { settingPersistConfig, settingReducer } from '../settings/settings';
import {
  staticDataPersistConfig,
  staticDataReducer,
} from '../static-data/static-data';
import { syncReducer } from '../sync';
import { userPersistConfig, userReducer } from '../user/user';
import type { RootState } from './types';
import {
  childrenForPractitionerPersistConfig,
  childrenForPractitionerReducer,
} from '../childrenForPractitioner/childrenForPractitioner';

const persistedReducers = {
  activityData: persistReducer(activityPersistConfig, activityReducer),
  analytics: persistReducer(analyticsPersistConfig, analyticsReducer),
  attendanceData: persistReducer(attendancePersistConfig, attendanceReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  caregivers: persistReducer(caregiverPersistConfig, caregiverReducer),
  children: persistReducer(childrenPersistConfig, childrenReducer),
  childrenForPractitioner: persistReducer(
    childrenForPractitionerPersistConfig,
    childrenForPractitionerReducer
  ),
  classroomData: persistReducer(classroomsPersistConfig, classroomsReducer),
  classroomForCoachData: persistReducer(
    classroomsForCoachPersistConfig,
    classroomsForCoachReducer
  ),
  coach: persistReducer(coachPersistConfig, coachReducer),
  contentConsentData: contentConsentReducer,
  contentReportData: persistReducer(
    contentReportPersistConfig,
    contentReportReducer
  ),
  documents: persistReducer(documentPersistConfig, documentReducer),
  notesData: persistReducer(notesPersistConfig, notesReducer),
  notifications: persistReducer(notificationPersistConfig, notificationReducer),
  practitioner: persistReducer(practitionerPersistConfig, practitionerReducer),
  practitionerForCoach: persistReducer(
    practitionerForCoachPersistConfig,
    practitionerForCoachReducer
  ),
  programmeData: persistReducer(programmePersistConfig, programmeReducer),
  programmeRoutineData: persistReducer(
    programmeRoutinePersistConfig,
    programmeRoutineReducer
  ),
  programmeThemeData: programmeThemeReducer,
  progressTracking: persistReducer(
    progressTrackingPersistConfig,
    progressTrackingReducer
  ),
  settings: persistReducer(settingPersistConfig, settingReducer),
  staticData: persistReducer(staticDataPersistConfig, staticDataReducer),
  storyBookData: persistReducer(storyBookPersistConfig, storyBookReducer),
  sync: syncReducer,
  user: persistReducer(userPersistConfig, userReducer),
};

const rootReducer = combineReducers(persistedReducers);

const rootPersistConfig = {
  key: 'root',
  storage: localForage,
  blacklist: Object.keys(persistedReducers),
};

const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedRootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor, useAppDispatch, useAppSelector };
