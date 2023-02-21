import { Typography, FADButton } from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import * as styles from './money.styles';
import { useEffect, useLayoutEffect, useState } from 'react';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { SubmitIncomeStatements } from './submit-income-statements/submit-income-statements';
import { useSelector } from 'react-redux';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@/store';
import { statementsSelectors, statementsThunkActions } from '@store/statements';
import { getMonth, getYear } from 'date-fns';

export const Money = () => {
  const history = useHistory();
  const [hasIncomeStatements, setHasIncomeStatements] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const income = useSelector(statementsSelectors.getIncome);
  const expense = useSelector(statementsSelectors.getExpenses);
  const year = getYear(new Date());
  const month = getMonth(new Date()) + 1;

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
          month: month,
        })
      );
    }
  };

  useLayoutEffect(() => {
    updateStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((income && income?.length > 0) || (expense && expense?.length! > 0)) {
      setHasIncomeStatements(true);
    }
  }, [income, expense]);

  return (
    <>
      {hasIncomeStatements ? (
        <SubmitIncomeStatements />
      ) : (
        <div className="h-full pt-7">
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
