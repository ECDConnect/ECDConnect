import { Typography, LoadingSpinner } from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { getMonth, getYear } from 'date-fns';
import { useAppContext } from '@/walkthrougContext';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { IncomeStatements } from './income-statements';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { WhatsappCall } from '../contact/whatsapp-call';

interface MoneyProps {
  setHasIncomeStatements: (item: boolean) => void;
  hasIncomeStatements: boolean;
  setIncomeStatementMonth: (item: string) => void;
  setIsLoss: (item: boolean) => void;
  setIsProfit: (item: boolean) => void;
  setLossProfitMonths: (item: string) => void;
  setIsIncomeStatementSubmitted: (item: boolean) => void;
}

export const MoneySummary: React.FC<MoneyProps> = ({
  hasIncomeStatements,
  setHasIncomeStatements,
  setIncomeStatementMonth,
  setIsLoss,
  setIsProfit,
  setLossProfitMonths,
  setIsIncomeStatementSubmitted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const appDispatch = useAppDispatch();

  const currentDate = new Date();
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const { state } = useAppContext();

  const balanceSheet = useSelector(
    practitionerSelectors.getPractitionerBalanceSheet
  );
  const income = useSelector(practitionerSelectors.getPractitionerIncome);
  const expense = useSelector(practitionerSelectors.getPractitionerExpenses);

  const updateStatements = async () => {
    setIsLoading(true);
    const statementResults = await appDispatch(
      practitionerThunkActions.getAllStatementsBalanceSheetForPractitioner({
        userId: practitioner?.user?.id!,
        year: getYear(currentDate),
        month: undefined,
      })
    ).unwrap();

    const month =
      balanceSheet?.[balanceSheet?.length - 1]?.submitted === false &&
      balanceSheet?.[balanceSheet?.length - 1]?.month! === new Date().getMonth()
        ? getMonth(currentDate)
        : getMonth(currentDate) - 1;

    await appDispatch(
      practitionerThunkActions.getAllExpensesForPractitioner({
        userId: practitioner?.user?.id!,
        month: month,
        year: getYear(currentDate),
      })
    );
    await appDispatch(
      practitionerThunkActions.getAllIncomeForPractitioner({
        userId: practitioner?.user?.id!,
        month: month,
        year: getYear(currentDate),
      })
    );
    setIsLoading(false);
  };

  useLayoutEffect(() => {
    updateStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      (income && income?.length > 0) ||
      (expense && expense?.length! > 0) ||
      (balanceSheet && balanceSheet?.length! > 0) //&&
      //balanceSheet?.[0]?.balance !== 0
    ) {
      setHasIncomeStatements(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [income, expense, balanceSheet]);

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
        <IncomeStatements
          setIncomeStatementMonth={setIncomeStatementMonth}
          setIsLoss={setIsLoss}
          setIsProfit={setIsProfit}
          setLossProfitMonths={setLossProfitMonths}
          setIsIncomeStatementSubmitted={setIsIncomeStatementSubmitted}
        />
      ) : (
        <div className="h-full px-4 py-2 pt-7">
          <div className="mt-2 flex flex-wrap justify-center p-8">
            <div className="">
              <MoneyIcon />
            </div>
          </div>
          <div>
            <Typography
              className="mt-4 text-center"
              color="textDark"
              text={
                practitionerFirstName +
                ' has not added any income or expenses yet!'
              }
              type={'h3'}
            />
          </div>
          <div>
            <Typography
              className="mt-2 text-center"
              color="textMid"
              text={
                'You can contact ' +
                practitionerFirstName +
                ' to see if they need support.'
              }
              type={'body'}
            />
          </div>
          <WhatsappCall />
        </div>
      )}
    </>
  );
};
