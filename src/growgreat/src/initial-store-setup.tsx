// import { getYear, getMonth, getWeek } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/loader/loader';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useAppDispatch } from './store';
import { authActions } from './store/auth';
import { caregiverActions, caregiverThunkActions } from './store/caregiver';
import { motherActions, motherThunkActions } from './store/mother';
import {
  contentConsentActions,
  contentConsentThunkActions,
} from './store/content/consent';
import { documentActions, documentThunkActions } from './store/document';
import { notesActions, notesThunkActions } from './store/notes';
import { notificationActions } from './store/notifications';
import { settingActions, settingThunkActions } from './store/settings';
import { staticDataActions, staticDataThunkActions } from './store/static-data';
import { userActions, userThunkActions } from './store/user';
import { analyticsActions } from './store/analytics';
import { infantThunkActions } from './store/infant';

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

  const [otherLoading, setOtherLoading] = useState(false);

  const resetAuth = async () => {
    await appDispatch(authActions.resetAuthState());
  };

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
    await appDispatch(contentConsentActions.resetContentConsentState());
    await appDispatch(notificationActions.resetNotificationState());
    await appDispatch(settingActions.resetSettingsState());
    await appDispatch(analyticsActions.resetAnalyticsState());
  };

  const resetAdditionalStoreSetup = async () => {
    await appDispatch(notesActions.resetNotesState());
    await appDispatch(userActions.resetUserState());
    await appDispatch(caregiverActions.resetCaregiverState());
    await appDispatch(documentActions.resetDocumentsState());
    await appDispatch(motherActions.resetMotherState());
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
    await appDispatch(motherThunkActions.getMothers({}));
    await appDispatch(infantThunkActions.getInfants({}));
    await appDispatch(userThunkActions.getUser({})).unwrap();
    await appDispatch(userThunkActions.getUserConsents({})).unwrap();
    await appDispatch(caregiverThunkActions.getCaregivers({})).unwrap();
    await appDispatch(documentThunkActions.getDocuments({})).unwrap();

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
    await appDispatch(staticDataThunkActions.getGenders({})).unwrap();
    await appDispatch(staticDataThunkActions.getRaces({})).unwrap();
    await appDispatch(staticDataThunkActions.getLanguages({})).unwrap();
    await appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap();
    await appDispatch(
      staticDataThunkActions.getHolidays({ year: today.getFullYear() })
    ).unwrap();
    await appDispatch(staticDataThunkActions.getProvinces({})).unwrap();
    await appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap();
    await appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap();
    await appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap();

    setStaticDataLoading(false);
  };

  const syncClassroom = async () => {};

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
