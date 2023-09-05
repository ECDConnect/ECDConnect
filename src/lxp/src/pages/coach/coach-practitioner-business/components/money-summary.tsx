import { Typography, LoadingSpinner, Alert, Button } from '@ecdlink/ui';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
// import * as styles from './money.styles';
import React, { useEffect, useLayoutEffect, useState } from 'react';
// import ROUTES from '@/routes/routes';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store';
import { getMonth, getYear } from 'date-fns';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

import { useAppContext } from '@/walkthrougContext';
import { PractitionerBusinessParams } from '../coach-practitioner-business.types';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  practitionerSelectors,
  practitionerThunkActions,
} from '@/store/practitioner';
import { LogoSvgs, getLogo } from '@/utils/common/svg.utils';
import { IncomeStatements } from './income-statements';

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
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const [isLoading, setIsLoading] = useState(false);
  const appDispatch = useAppDispatch();

  const currentDate = new Date();
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const practitionerFirstName = practitioner?.user?.firstName;

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

  // useEffect(() => {
  //   if (isOnline) {
  //     income
  //       ?.filter((item) => item?.isOffline === true)
  //       .map(async (item) => {
  //         let { id, isOffline, ...input } = item;
  //         await new IncomeStatementsService(
  //           userAuth?.auth_token!
  //         ).UpdateStatementsIncome(item?.id!, input! as StatementsIncomeInput);
  //       });

  //     if (income?.filter((e) => e?.isOffline === true).length! > 0) {
  //       updateStatements();
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOnline, userAuth?.auth_token]);

  // useEffect(() => {
  //   if (isOnline) {
  //     expense
  //       ?.filter((item) => item?.isOffline === true)
  //       .map(async (item) => {
  //         let { id, isOffline, ...input } = item;
  //         await new ExpensesStatementsService(
  //           userAuth?.auth_token!
  //         ).UpdateStatementsExpense(
  //           item?.id!,
  //           input! as StatementsExpensesInput
  //         );
  //       });
  //     if (expense?.filter((e) => e?.isOffline === true).length! > 0) {
  //       updateStatements();
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOnline, userAuth?.auth_token]);

  useLayoutEffect(() => {
    updateStatements();
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

  const callForHelp = () => {
    window.open('tel:' + practitioner?.user?.phoneNumber);
  };

  const whatsapp = () => {
    window.open(`https://wa.me/${practitioner?.user?.phoneNumber}`);
  };

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
          <div className="mt-14">
            <Typography
              type="h4"
              weight="bold"
              lineHeight="snug"
              text={'Contact ' + practitionerFirstName}
            />
            <Typography
              type="h5"
              weight="bold"
              lineHeight="snug"
              color="secondary"
              text={`${
                practitioner?.user?.phoneNumber == null
                  ? 'Number not available'
                  : practitioner?.user?.phoneNumber
              }`}
            />
            <Button
              color={'primary'}
              type={'outlined'}
              className={'mr-4 mt-2'}
              size={'small'}
              onClick={whatsapp}
            >
              <img
                src={getLogo(LogoSvgs.whatsapp)}
                alt="whatsapp"
                className="text-primary mr-1 h-5 w-5"
              />
              <Typography
                color={'primary'}
                type={'small'}
                weight="bold"
                text={`WhatsApp client`}
              />
            </Button>
            <Button
              text="Call client"
              icon="PhoneIcon"
              type="outlined"
              size="small"
              color="primary"
              textColor="primary"
              iconPosition="start"
              onClick={callForHelp}
              className="mt-2"
            />
          </div>
          <div>
            <Alert
              type={'info'}
              className="items-left justify-left mt-4 flex"
              title={`WhatsApp and phone calls will be charged at your standard carrier rates.`}
            />
          </div>
        </div>
      )}
    </>
  );
};
