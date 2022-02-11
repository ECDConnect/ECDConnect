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
import { analyticsPersistConfig, analyticsReducer } from '../analytics/analytics';
import { attendancePersistConfig, attendanceReducer } from '../attendance/attendance';
import { authPersistConfig, authReducer } from '../auth';
import { caregiverPersistConfig, caregiverReducer } from '../caregiver/caregiver';
import { childrenPersistConfig, childrenReducer } from '../children/children';
import { classroomsPersistConfig, classroomsReducer } from '../classroom/classroom';
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
import { storyBookPersistConfig, storyBookReducer } from '../content/story-book/story-book';
import { documentPersistConfig, documentReducer } from '../document/document';
import { notesPersistConfig, notesReducer } from '../notes/notes';
import { notificationPersistConfig, notificationReducer } from '../notifications/notifications';
import { practitionerPersistConfig, practitionerReducer } from '../practitioner/practitioner';
import { programmePersistConfig, programmeReducer } from '../programme/programme';
import {
  progressTrackingPersistConfig,
  progressTrackingReducer,
} from '../progress-tracking/progress-tracking';
import { settingPersistConfig, settingReducer } from '../settings/settings';
import { staticDataPersistConfig, staticDataReducer } from '../static-data/static-data';
import { syncReducer } from '../sync';
import { userPersistConfig, userReducer } from '../user/user';
import type { RootState } from './types';

const persistedReducers = {
  auth: persistReducer(authPersistConfig, authReducer),
  settings: persistReducer(settingPersistConfig, settingReducer),
  staticData: persistReducer(staticDataPersistConfig, staticDataReducer),
  classroomData: persistReducer(classroomsPersistConfig, classroomsReducer),
  user: persistReducer(userPersistConfig, userReducer),
  children: persistReducer(childrenPersistConfig, childrenReducer),
  caregivers: persistReducer(caregiverPersistConfig, caregiverReducer),
  attendanceData: persistReducer(attendancePersistConfig, attendanceReducer),
  contentConsentData: contentConsentReducer,
  documents: persistReducer(documentPersistConfig, documentReducer),
  progressTracking: persistReducer(progressTrackingPersistConfig, progressTrackingReducer),
  contentReportData: persistReducer(contentReportPersistConfig, contentReportReducer),
  notesData: persistReducer(notesPersistConfig, notesReducer),
  practitioner: persistReducer(practitionerPersistConfig, practitionerReducer),
  activityData: persistReducer(activityPersistConfig, activityReducer),
  programmeThemeData: programmeThemeReducer,
  storyBookData: persistReducer(storyBookPersistConfig, storyBookReducer),
  programmeRoutineData: persistReducer(programmeRoutinePersistConfig, programmeRoutineReducer),
  programmeData: persistReducer(programmePersistConfig, programmeReducer),
  notifications: persistReducer(notificationPersistConfig, notificationReducer),
  analytics: persistReducer(analyticsPersistConfig, analyticsReducer),
  sync: syncReducer,
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
// persistor.purge();

export type AppDispatch = typeof store.dispatch;
const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor, useAppDispatch, useAppSelector };
