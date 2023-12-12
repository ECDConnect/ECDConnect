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

import { authPersistConfig, authReducer } from '../auth';
import { calendarPersistConfig, calendarReducer } from '../calendar/calendar';
import {
  caregiverPersistConfig,
  caregiverReducer,
} from '../caregiver/caregiver';
import { contentConsentReducer } from '../content/consent/consent';
import { documentPersistConfig, documentReducer } from '../document/document';
import { notesPersistConfig, notesReducer } from '../notes/notes';
import {
  notificationPersistConfig,
  notificationReducer,
} from '../notifications/notifications';
import { motherPersistConfig, motherReducer } from '../mother/mother';
import { settingPersistConfig, settingReducer } from '../settings/settings';
import {
  staticDataPersistConfig,
  staticDataReducer,
} from '../static-data/static-data';
import { syncReducer } from '../sync';
import { userPersistConfig, userReducer } from '../user/user';
import type { RootState } from './types';
import { infantPersistConfig, infantReducer } from '../infant/infant';
import {
  healthCareWorkerPersistConfig,
  healthCareWorkerReducer,
} from '../healthCareWorker/healthCareWorker';
import {
  eventRecordPersistConfig,
  eventRecordReducer,
} from '../eventRecord/eventRecord';
import { visitPersistConfig, visitReducer } from '../visit/visit';
import { referralPersistConfig, referralReducer } from '../referral/referral';
import {
  communityPersistConfig,
  communityReducer,
} from '../community/community';

const persistedReducers = {
  analytics: persistReducer(analyticsPersistConfig, analyticsReducer),
  auth: persistReducer(authPersistConfig, authReducer),
  calendar: persistReducer(calendarPersistConfig, calendarReducer),
  caregivers: persistReducer(caregiverPersistConfig, caregiverReducer),
  contentConsentData: contentConsentReducer,
  healthCareWorker: persistReducer(
    healthCareWorkerPersistConfig,
    healthCareWorkerReducer
  ),
  mothers: persistReducer(motherPersistConfig, motherReducer),
  infants: persistReducer(infantPersistConfig, infantReducer),
  documents: persistReducer(documentPersistConfig, documentReducer),
  notesData: persistReducer(notesPersistConfig, notesReducer),
  notifications: persistReducer(notificationPersistConfig, notificationReducer),
  settings: persistReducer(settingPersistConfig, settingReducer),
  staticData: persistReducer(staticDataPersistConfig, staticDataReducer),
  sync: syncReducer,
  user: persistReducer(userPersistConfig, userReducer),
  eventRecord: persistReducer(eventRecordPersistConfig, eventRecordReducer),
  visits: persistReducer(visitPersistConfig, visitReducer),
  referrals: persistReducer(referralPersistConfig, referralReducer),
  community: persistReducer(communityPersistConfig, communityReducer),
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
