import { Typography, FADButton, LoadingSpinner } from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import * as styles from './money.styles';
import React, { useEffect, useLayoutEffect, useState } from 'react';
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
import { useAppContext } from '@/walkthrougContext';

interface MoneyProps {
  setHasIncomeStatements: (item: boolean) => void;
  hasIncomeStatements: boolean;
  setHandleAutoStartWalkthrough: (item: boolean) => void;
}

export const Money: React.FC<MoneyProps> = ({
  hasIncomeStatements,
  setHasIncomeStatements,
  setHandleAutoStartWalkthrough,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const [isLoading, setIsLoading] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const income = useSelector(statementsSelectors.getIncome);
  const expense = useSelector(statementsSelectors.getExpenses);
  const year = getYear(new Date());
  const month =
    balanceSheet?.[balanceSheet?.length - 1]?.submitted === false &&
    balanceSheet?.[balanceSheet?.length - 1]?.month! === new Date().getMonth()
      ? getMonth(new Date())
      : getMonth(new Date()) + 1;

  const updateStatements = async () => {
    if (userAuth?.auth_token) {
      await appDispatch(
        statementsThunkActions.getAllExpenses({ month: month, year: year })
      );
      await appDispatch(
        statementsThunkActions.getAllIncome({ month: month, year: year })
      );
      await appDispatch(
        statementsThunkActions.getAllStatementsBalanceSheet({
          // userId: userAuth?.id!,
          year: year,
          month: 0,
        })
      );
    }
    setHandleAutoStartWalkthrough(true);
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
    setIsLoading(true);
    updateStatements();
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (income && income?.length > 0) ||
      (expense && expense?.length! > 0) ||
      (balanceSheet &&
        balanceSheet?.length! > 0 &&
        balanceSheet?.[0]?.balance !== 0)
    ) {
      setHasIncomeStatements(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, expense, balanceSheet]);

  const { state } = useAppContext();

  return (
    <>
      {isLoading ? (
        <LoadingSpinner
          size="big"
          spinnerColor="white"
          backgroundColor="secondary"
          className="mb-7"
        />
      ) : hasIncomeStatements || state?.run ? (
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
    </>
  );
};
