import { ReactNode, useEffect, useState, createContext } from 'react';
import Loader from '@/components/loader/loader';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useAppDispatch } from '@/store';
import { authActions } from '@/store/auth';
import { caregiverActions, caregiverThunkActions } from '@/store/caregiver';
import { motherActions, motherThunkActions } from '@/store/mother';
import {
  contentConsentActions,
  contentConsentThunkActions,
} from '@/store/content/consent';
import { documentActions, documentThunkActions } from '@/store/document';
import { notesActions, notesThunkActions } from '@/store/notes';
import { notificationActions } from '@/store/notifications';
import { settingActions, settingThunkActions } from '@/store/settings';
import { staticDataActions, staticDataThunkActions } from '@/store/static-data';
import { userActions, userSelectors, userThunkActions } from '@/store/user';
import { analyticsActions } from '@/store/analytics';
import { infantActions, infantThunkActions } from '@/store/infant';
import { useSelector } from 'react-redux';
import {
  healthCareWorkerSelectors,
  healthCareWorkerThunkActions,
} from './store/healthCareWorker';
import useClearSiteData from '@ecdlink/core/lib/hooks/useClearSiteData';
import { calendarActions, calendarThunkActions } from './store/calendar';
import { subMonths } from 'date-fns';
import { communityThunkActions } from './store/community';

type IntialStoreSetupContextValues = {
  initloading: boolean;
  resetAuth: () => Promise<void>;
  getLoadingMessage: () => string;
  initStoreSetup: () => Promise<void>;
  resetAppStore: (showLoading?: boolean) => Promise<void>;
};

type Props = {
  children?: ReactNode;
};

export const IntialStoreSetupContext =
  createContext<IntialStoreSetupContextValues>(
    {} as IntialStoreSetupContextValues
  );

function InitialStoreSetup(props: Props) {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();
  const [initloading, setInitLoading] = useState(false);
  const userData = useSelector(userSelectors?.getUser);
  const [staticDataLoading, setStaticDataLoading] = useState(false);
  const [otherLoading, setOtherLoading] = useState(false);
  const healthCareWorker = useSelector(
    healthCareWorkerSelectors.getHealthCareWorker
  );

  const clearSiteData = useClearSiteData();

  useEffect(() => {
    setInitLoading(true);
    if (userData) {
      (async () =>
        await appDispatch(
          healthCareWorkerThunkActions.getHealthCareWorkerByUserId({
            userId: userData?.id!,
          })
        ).unwrap())();
      (async () =>
        await appDispatch(
          caregiverThunkActions.getAllCaregiverClients({ userId: userData.id! })
        ))();
    }
    setInitLoading(false);
  }, [appDispatch, userData]);

  useEffect(() => {
    if (healthCareWorker) {
      (async () => {
        const promises = [
          appDispatch(
            communityThunkActions.getClinicById({
              clinicId: healthCareWorker?.clinicId || '',
            })
          ).unwrap(),
          appDispatch(
            caregiverThunkActions.getCaregiversForHealthCareWorker({
              id: healthCareWorker?.id || '',
            })
          ).unwrap(),
        ];

        await Promise.all(promises);
      })();
    }
  }, [appDispatch, healthCareWorker]);

  const values = {
    initloading,
    resetAuth,
    resetAppStore,
    initStoreSetup,
    getLoadingMessage,
  };

  async function resetAuth() {
    await appDispatch(authActions.resetAuthState());
  }

  async function resetAppStore(showLoading = true) {
    if (showLoading) {
      setInitLoading(true);
    }

    await resetStaticStoreSetup();
    await resetAdditionalStoreSetup();

    clearSiteData();
    setInitLoading(false);
  }

  async function resetStaticStoreSetup() {
    await appDispatch(staticDataActions.resetStaticDataState());
    await appDispatch(contentConsentActions.resetContentConsentState());
    await appDispatch(notificationActions.resetNotificationState());
    await appDispatch(settingActions.resetSettingsState());
    await appDispatch(analyticsActions.resetAnalyticsState());
  }

  const resetAdditionalStoreSetup = async () => {
    await appDispatch(notesActions.resetNotesState());
    await appDispatch(userActions.resetUserState());
    await appDispatch(caregiverActions.resetCaregiverState());
    await appDispatch(documentActions.resetDocumentsState());
    await appDispatch(motherActions.resetMotherState());
    await appDispatch(infantActions.resetInfantState());
    await appDispatch(calendarActions.resetCalendarState());
  };

  async function initStoreSetup() {
    if (isOnline) {
      setInitLoading(true);

      await initStaticStoreSetup();
      await initAdditionalStoreSetup();
      await appDispatch(settingActions.setLastDataSync());

      setInitLoading(false);
    }
  }

  async function initAdditionalStoreSetup() {
    const promises = [
      appDispatch(notesThunkActions.getNotes({})).unwrap(),
      appDispatch(motherThunkActions.getMothers({})),
      appDispatch(infantThunkActions.getInfants({})),
      appDispatch(userThunkActions.getUser({})).unwrap(),
      appDispatch(userThunkActions.getUserConsents({})).unwrap(),
      appDispatch(documentThunkActions.getDocumentsForHCW()).unwrap(),
      appDispatch(
        calendarThunkActions.getCalendarEvents({
          start: subMonths(
            new Date(new Date().getFullYear(), new Date().getMonth(), 0),
            1
          ),
        })
      ),
    ];
    // SPECIFIC DATA
    setOtherLoading(true);
    await Promise.all(promises);
    setOtherLoading(false);
  }

  async function initStaticStoreSetup() {
    const today = new Date();

    const promises = [
      appDispatch(
        contentConsentThunkActions.getConsent({ locale: 'en-za' })
      ).unwrap(),
      appDispatch(settingThunkActions.getSettings({})).unwrap(),
      appDispatch(staticDataThunkActions.getRelations({})).unwrap(),
      appDispatch(staticDataThunkActions.getGenders({})).unwrap(),
      appDispatch(staticDataThunkActions.getRaces({})).unwrap(),
      appDispatch(staticDataThunkActions.getLanguages({})).unwrap(),
      appDispatch(staticDataThunkActions.getEducationLevels({})).unwrap(),
      appDispatch(
        staticDataThunkActions.getHolidays({ year: today.getFullYear() })
      ).unwrap(),
      appDispatch(staticDataThunkActions.getProvinces({})).unwrap(),
      appDispatch(staticDataThunkActions.getReasonsForLeaving({})).unwrap(),
      appDispatch(staticDataThunkActions.getDocumentTypes({})).unwrap(),
      appDispatch(staticDataThunkActions.getNoteTypes({})).unwrap(),
      appDispatch(staticDataThunkActions.getWorkflowStatuses({})).unwrap(),
      appDispatch(
        calendarThunkActions.getCalendarEventTypes({ locale: 'en-za' })
      ).unwrap(),
    ];

    setStaticDataLoading(true);
    await Promise.all(promises);
    setStaticDataLoading(false);
  }

  function getLoadingMessage() {
    let message = 'Loading . . .';

    if (staticDataLoading) {
      message = 'Loading static data . . .';
    }

    if (otherLoading) {
      message = 'Loading other data . . .';
    }

    return message;
  }

  async function init() {
    try {
      return await initStoreSetup();
    } catch (error: unknown) {
      console.error(error);
    }
  }

  useEffect(() => {
    init();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IntialStoreSetupContext.Provider value={values}>
      {initloading && <Loader loadingMessage={getLoadingMessage()} />}
      {!initloading && props.children}
    </IntialStoreSetupContext.Provider>
  );
}

export default InitialStoreSetup;
