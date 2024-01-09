import {
  Typography,
  LoadingSpinner,
  Dialog,
  DialogPosition,
  Button,
  renderIcon,
} from '@ecdlink/ui';
import React, { useCallback, useEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { SubmitIncomeStatements } from './submit-income-statements/submit-income-statements';
import { useSelector } from 'react-redux';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@/store';
import { statementsSelectors, statementsThunkActions } from '@store/statements';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import { LocalStorageKeys, SmartStartPointsLibrary } from '@ecdlink/core';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';
import { useAppContext } from '@/walkthrougContext';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const Money: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();

  const unsyncedIncome = useSelector(
    statementsSelectors.getUnsyncedIncomeItems
  );
  const unsyncedExpenses = useSelector(
    statementsSelectors.getUnsyncedExpenseItems
  );

  const { isLoading: isSubmittingStatement } = useThunkFetchCall(
    'statements',
    'submitIncomeStatement'
  );

  useEffect(() => {
    if (isOnline) {
      unsyncedIncome.forEach(async (item) => {
        appDispatch(
          statementsThunkActions.addIncomeItem({
            input: item,
            firstAttempt: false,
          })
        );
      });
    }
  }, [appDispatch, isOnline, unsyncedIncome]);

  useEffect(() => {
    if (isOnline) {
      unsyncedExpenses.forEach(async (item) => {
        appDispatch(
          statementsThunkActions.addExpenseItem({
            input: item,
            firstAttempt: false,
          })
        );
      });
    }
  }, [appDispatch, isOnline, unsyncedExpenses]);

  const fetchStatements = useCallback(async () => {
    if (userAuth?.auth_token && isOnline) {
      setIsLoading(true);
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      await appDispatch(
        statementsThunkActions.getIncomeStatements({
          startDate: startDate,
          endDate: undefined,
        })
      ).unwrap();

      await appDispatch(
        statementsThunkActions.getUnsubmittedIncomeItems({})
      ).unwrap();

      await appDispatch(
        statementsThunkActions.getUnsubmittedExpenseItems({})
      ).unwrap();

      setIsLoading(false);
    }
  }, [appDispatch, setIsLoading, userAuth, isOnline]);

  useEffect(() => {
    fetchStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchStatements]);

  // Display update fees logic
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const isPrincipalOrAdmin =
    practitioner?.isPrincipal || practitioner?.isFundaAppAdmin;

  const [showUpdatePreschoolFeeReminder, setShowUpdatePreschoolFeeReminder] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isPrincipalOrAdmin) {
      setShowUpdatePreschoolFeeReminder(false);
      return;
    }

    const storageItem = getStorageItem<number>(
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );

    if (!storageItem || new Date().getFullYear() > storageItem) {
      setShowUpdatePreschoolFeeReminder(true);
    } else {
      setShowUpdatePreschoolFeeReminder(false);
    }
  }, [isPrincipalOrAdmin]);

  const onDismissFeeReminder = useCallback(() => {
    setStorageItem(
      new Date().getFullYear(),
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );
    setShowUpdatePreschoolFeeReminder(false);
  }, [setShowUpdatePreschoolFeeReminder]);

  const updateFeesPointsLibrary = useSelector(
    pointsSelectors.getPointsLibraryById(
      SmartStartPointsLibrary.UPDATE_PRESCHOOL_FEE_FOR_YEAR
    )
  );

  const {
    state: { tourActive },
  } = useAppContext();

  return (
    <>
      {(isLoading || isSubmittingStatement) && (
        <LoadingSpinner
          size="big"
          spinnerColor="white"
          backgroundColor="secondary"
          className="mb-7"
        />
      )}
      {!isLoading && !isSubmittingStatement && (
        <>
          <SubmitIncomeStatements />
          <Dialog
            visible={showUpdatePreschoolFeeReminder && !tourActive}
            position={DialogPosition.Middle}
          >
            <div className={'flex flex-col items-center p-4'}>
              <EmojiYellowSmile className="mr-2 h-24 w-24" />
              <Typography
                className="mt-2 text-center"
                color="textMid"
                text={`Happy New Year! Update the monthly caregiver fee for ${new Date().getFullYear()}!`}
                type={'h1'}
              />
              <Typography
                className="mt-2 text-center"
                color="textMid"
                text={`Update the caregiver fee as soon as possible to reflect the ${new Date().getFullYear()} amount. You'll earn ${
                  updateFeesPointsLibrary?.points
                } points!`}
                type={'body'}
              />
              <Button
                type="filled"
                color="primary"
                className={'mx-auto mt-8 w-full rounded-2xl'}
                onClick={() => {
                  onDismissFeeReminder();
                  history.push(ROUTES.CLASSROOM.UPDATE_FEE, {
                    fromUpdateReminder: true,
                  });
                }}
              >
                {renderIcon(
                  'PencilIcon',
                  'h-4 w-4 text-white mr-2 bg-primary rounded-full'
                )}
                <Typography
                  type="help"
                  className="mr-2"
                  color="white"
                  text={'Update fee now'}
                />
              </Button>
              <Button
                type="outlined"
                color="primary"
                className={'mx-auto mt-4 w-full rounded-2xl'}
                onClick={onDismissFeeReminder}
              >
                {renderIcon(
                  'ClockIcon',
                  'h-4 w-4 text-white mr-2 bg-primary rounded-full'
                )}
                <Typography
                  type="help"
                  className="mr-2"
                  color="primary"
                  text={'Do this later'}
                />
              </Button>
            </div>
          </Dialog>
        </>
      )}
    </>
  );
};
