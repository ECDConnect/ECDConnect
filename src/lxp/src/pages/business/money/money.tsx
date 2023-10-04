import {
  Typography,
  FADButton,
  LoadingSpinner,
  Dialog,
  DialogPosition,
  Button,
  renderIcon,
} from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import * as styles from './money.styles';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { SubmitIncomeStatements } from './submit-income-statements/submit-income-statements';
import { useSelector } from 'react-redux';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@/store';
import { statementsSelectors, statementsThunkActions } from '@store/statements';
import { getMonth, getYear } from 'date-fns';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import {
  StatementsExpensesInput,
  StatementsIncomeInput,
} from '@/../../../packages/graphql/lib';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import { LocalStorageKeys, SmartStartPointsLibrary } from '@ecdlink/core';
import { ReactComponent as EmojiYellowSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { pointsSelectors } from '@/store/points';
import { practitionerSelectors } from '@/store/practitioner';

interface MoneyProps {
  setHasIncomeStatements: (item: boolean) => void;
  hasIncomeStatements: boolean;
}

export const Money: React.FC<MoneyProps> = ({
  hasIncomeStatements,
  setHasIncomeStatements,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const [isLoading, setIsLoading] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const income = useSelector(statementsSelectors.getIncome);
  const expense = useSelector(statementsSelectors.getExpenses);
  const currentDate = new Date();

  const updateStatements = async () => {
    if (userAuth?.auth_token) {
      setIsLoading(true);
      await appDispatch(
        statementsThunkActions.getAllStatementsBalanceSheet({
          // userId: userAuth?.id!,
          year: getYear(currentDate),
          month: undefined,
        })
      ).unwrap();

      const month =
        balanceSheet?.[balanceSheet?.length - 1]?.submitted === false &&
        balanceSheet?.[balanceSheet?.length - 1]?.month! ===
          new Date().getMonth()
          ? getMonth(currentDate)
          : getMonth(currentDate) + 1;

      await appDispatch(
        statementsThunkActions.getAllExpenses({
          month: month,
          year: getYear(currentDate),
        })
      );
      await appDispatch(
        statementsThunkActions.getAllIncome({
          month: month,
          year: getYear(currentDate),
        })
      );
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOnline) {
      income
        ?.filter((item) => item?.isOffline === true)
        .map(async (item) => {
          let { id, isOffline, ...input } = item;
          await new IncomeStatementsService(
            userAuth?.auth_token!
          ).UpdateStatementsIncome(item?.id!, input! as StatementsIncomeInput);
        });

      if (income?.filter((e) => e?.isOffline === true).length! > 0) {
        updateStatements();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, userAuth?.auth_token]);

  useEffect(() => {
    if (isOnline) {
      expense
        ?.filter((item) => item?.isOffline === true)
        .map(async (item) => {
          let { id, isOffline, ...input } = item;
          await new ExpensesStatementsService(
            userAuth?.auth_token!
          ).UpdateStatementsExpense(
            item?.id!,
            input! as StatementsExpensesInput
          );
        });
      if (expense?.filter((e) => e?.isOffline === true).length! > 0) {
        updateStatements();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, userAuth?.auth_token]);

  useLayoutEffect(() => {
    updateStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (income && income?.length > 0) ||
      (expense && expense?.length! > 0) ||
      (balanceSheet && balanceSheet?.length! > 0) //&&
      // balanceSheet?.[0]?.balance !== 0
    ) {
      setHasIncomeStatements(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, expense, balanceSheet]);

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

    if (!storageItem || currentDate.getFullYear() > storageItem) {
      setShowUpdatePreschoolFeeReminder(true);
    } else {
      setShowUpdatePreschoolFeeReminder(false);
    }
  }, []);

  const onDismissFeeReminder = useCallback(() => {
    setStorageItem(
      new Date().getFullYear(),
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );
    setShowUpdatePreschoolFeeReminder(false);
  }, []);

  const pointsLibraries = useSelector(
    pointsSelectors.getPointsLibraryById(
      SmartStartPointsLibrary.UPDATE_PRESCHOOL_FEE_FOR_YEAR
    )
  );

  return (
    <>
      {isLoading && (
        <LoadingSpinner
          size="big"
          spinnerColor="white"
          backgroundColor="secondary"
          className="mb-7"
        />
      )}
      {!isLoading && (
        <>
          {hasIncomeStatements ? (
            <SubmitIncomeStatements />
          ) : (
            <div className="h-full px-4 py-2 pt-7">
              <div className="mt-2 flex flex-wrap justify-center p-8">
                <div className="">
                  <MoneyIcon />
                </div>
                <div>
                  <Typography
                    className="mt-4 text-center"
                    color="textDark"
                    text="You don't have any income statements yet!"
                    type={'h3'}
                  />
                </div>
                <div>
                  <Typography
                    className="mt-2 text-center"
                    color="textMid"
                    text="Tap “Add income or expense” to get started"
                    type={'body'}
                  />
                </div>
              </div>

              <FADButton
                title={'Add income or expense'}
                icon={'PlusIcon'}
                iconDirection={'left'}
                textToggle={true}
                type={'filled'}
                color={'primary'}
                shape={'round'}
                className={styles.fadButton}
                click={() => history.push(ROUTES.BUSINESS_ADD_AMOUNT)}
              />
            </div>
          )}
          <Dialog
            visible={showUpdatePreschoolFeeReminder}
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
                  pointsLibraries?.points
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
