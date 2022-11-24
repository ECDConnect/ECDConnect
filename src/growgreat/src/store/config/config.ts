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
} from '@/store/analytics/analytics';

import { authPersistConfig, authReducer } from '@/store/auth';
import {
  caregiverPersistConfig,
  caregiverReducer,
} from '@/store/caregiver/caregiver';
import { contentConsentReducer } from '@/store/content/consent/consent';
import {
  documentPersistConfig,
  documentReducer,
} from '@/store/document/document';
import { notesPersistConfig, notesReducer } from '@/store/notes/notes';
import {
  notificationPersistConfig,
  notificationReducer,
} from '@/store/notifications/notifications';
import { motherPersistConfig, motherReducer } from '@/store/mother/mother';
import {
  settingPersistConfig,
  settingReducer,
} from '@/store/settings/settings';
import {
  staticDataPersistConfig,
  staticDataReducer,
} from '@/store/static-data/static-data';
import { syncReducer } from '@/store/sync';
import { userPersistConfig, userReducer } from '@/store/user/user';
import type { RootState } from '@/store/types';
import { infantPersistConfig, infantReducer } from '@/store/infant/infant';
import {
  healthCareWorkerPersistConfig,
  healthCareWorkerReducer,
} from '@/store/healthCareWorker/healthCareWorker';
import {
  practitionerPersistConfig,
  practitionerReducer,
} from '@/store/practitioner/practitioner';

const persistedReducers = {
  analytics: persistReducer(analyticsPersistConfig, analyticsReducer),
  auth: persistReducer(authPersistConfig, authReducer),
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
  practitioner: persistReducer(practitionerPersistConfig, practitionerReducer),
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
