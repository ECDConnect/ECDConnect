import { Typography, FADButton, Dialog, DialogPosition } from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import * as styles from './money.styles';
import { useEffect, useState } from 'react';
import AddAmount from '../add-amount/add-amount';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router-dom';
import { SubmitIncomeStatements } from './submit-income-statements/submit-income-statements';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@store/auth';
import { useAppDispatch } from '@/store';
import {
  statementsActions,
  statementsSelectors,
  statementsThunkActions,
} from '@store/statements';

export const Money = () => {
  const history = useHistory();
  const [addIncome, setAddIncome] = useState(false);
  const [hasIncomeStatements, setHasIncomeStatements] = useState(false);
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const expensesTypes = useSelector(statementsSelectors.getExpensesTypes);
  const incomeTypes = useSelector(statementsSelectors.getIncomeTypes);
  const feeTypes = useSelector(statementsSelectors.getFeeTypes);
  const contributionTypes = useSelector(
    statementsSelectors.getContributionTypes
  );
  const payTypes = useSelector(statementsSelectors.getPayTypes);

  const updateExpenses = async () => {
    if (userAuth?.auth_token) {
      await appDispatch(
        statementsThunkActions.getAllExpenses(userAuth?.auth_token)
      );
      await appDispatch(
        statementsThunkActions.getAllIncome(userAuth?.auth_token)
      );
    }
  };

  useEffect(() => {
    updateExpenses();
  });

  console.log({ expensesTypes });
  console.log({ incomeTypes });
  console.log({ feeTypes });
  console.log({ contributionTypes });
  console.log({ payTypes });

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
