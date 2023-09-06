import ROUTES from '@/routes/routes';
import { numberWithSpaces } from '@/utils/statements/statements-utils';
import { Typography, Button, Card } from '@ecdlink/ui';
import { differenceInDays, format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import { useAppContext } from '@/walkthrougContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  LocalStorageKeys,
  getNextMonth,
  getPreviousMonth,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';
import { practitionerSelectors } from '@/store/practitioner';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';

interface StatementProps {
  setIncomeStatementMonth: (item: string) => void;
  setIsLoss: (item: boolean) => void;
  setIsProfit: (item: boolean) => void;
  setLossProfitMonths: (item: string) => void;
  setIsIncomeStatementSubmitted: (item: boolean) => void;
}

export const IncomeStatements: React.FC<StatementProps> = ({
  setIncomeStatementMonth,
  setIsLoss,
  setIsProfit,
  setLossProfitMonths,
  setIsIncomeStatementSubmitted,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const balanceSheet = useSelector(
    practitionerSelectors.getPractitionerBalanceSheet
  );
  const offlineImg = window.localStorage.getItem(
    LocalStorageKeys.offlineStatments
  );

  const monthNames = balanceSheet?.map((item) => {
    return getMonthName(item?.month! - 1).substring(0, 3);
  });

  const { practitionerId } = useParams<PractitionerBusinessParams>();

  // const { isLoading: isSubmittingStatement } = useThunkFetchCall(
  //   'statements',
  //   'submitIncomeStatement'
  // );

  const [submitMonthAndYear, setSubmitMonthAndYear] = useState<Date>(
    new Date()
  );
  const [isThisMonthSubmitted, setIsThisMonthSubmitted] =
    useState<boolean>(false);
  const [daysUntilFinalSubmission, setDaysUntilFinalSubmission] =
    useState<number>(0);

  const currentDate = new Date();
  const isSubmitWindowOpen =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay ||
    currentDate.getDate() <= IncomeStatementDates.SubmitEndDay;

  useEffect(() => {
    // Outside submit
    if (!isSubmitWindowOpen) {
      setSubmitMonthAndYear(currentDate);

      setIsThisMonthSubmitted(
        balanceSheet?.find((x) => x.month === currentDate.getMonth() + 1)
          ?.submitted || false
      );
      // setIsIncomeStatementSubmitted(isThisMonthSubmitted);

      const nextMonth = getNextMonth(currentDate);
      const nextSubmit = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        7
      );
      setDaysUntilFinalSubmission(differenceInDays(nextSubmit, currentDate));
    } else {
      // In window and current month
      if (currentDate.getDate() >= IncomeStatementDates.SubmitStartDay) {
        setSubmitMonthAndYear(currentDate);

        setIsThisMonthSubmitted(
          balanceSheet?.find((x) => x.month === currentDate.getMonth() + 1)
            ?.submitted || false
        );
        // setIsIncomeStatementSubmitted(isThisMonthSubmitted);

        const nextMonth = getNextMonth(currentDate);
        const nextSubmit = new Date(
          nextMonth.getFullYear(),
          nextMonth.getMonth(),
          7
        );
        setDaysUntilFinalSubmission(differenceInDays(nextSubmit, currentDate));
      } else {
        // In window but next month
        setSubmitMonthAndYear(getPreviousMonth(currentDate));

        setIsThisMonthSubmitted(
          balanceSheet?.find((x) => x.month === currentDate.getMonth())
            ?.submitted || false
        );
        // setIsIncomeStatementSubmitted(isThisMonthSubmitted);

        const nextSubmit = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          7
        );
        setDaysUntilFinalSubmission(differenceInDays(nextSubmit, currentDate));
      }
    }
  }, []);

  const previousMonthRecord =
    monthNames?.length! > 1 && balanceSheet?.length! > 1
      ? `${monthNames?.[balanceSheet?.length! - 2]} ${
          balanceSheet?.[balanceSheet?.length! - 2]?.year
        }`
      : `-`;

  const currentMonthRecord =
    monthNames && balanceSheet?.length! > 0
      ? `${monthNames?.[balanceSheet?.length! - 1]} ${
          balanceSheet?.[balanceSheet?.length! - 1]?.year
        }`
      : `-`;

  const currentMonthTotalIncome =
    balanceSheet?.length! > 0
      ? `+ R ${balanceSheet?.[balanceSheet?.length! - 1]?.incomeTotal?.toFixed(
          2
        )}`
      : '-';
  const currentMonthTotalExpenses =
    balanceSheet?.length! > 0
      ? `- R ${balanceSheet?.[balanceSheet?.length! - 1]?.expenseTotal?.toFixed(
          2
        )}`
      : '-';

  const previousMonthTotalIncome =
    balanceSheet?.length! > 1
      ? `+ R ${balanceSheet?.[balanceSheet?.length! - 2].incomeTotal?.toFixed(
          2
        )}`
      : '-';
  const previousMonthTotalExpenses =
    balanceSheet?.length! > 1
      ? `- R ${balanceSheet?.[balanceSheet?.length! - 2].expenseTotal?.toFixed(
          2
        )}`
      : '-';

  const currentMonthTotalBalance =
    balanceSheet?.length! > 0
      ? balanceSheet?.[balanceSheet?.length! - 1].balance?.toFixed(2)
      : 0;

  const previousMonthTotalBalance =
    balanceSheet?.length! > 1
      ? balanceSheet?.[balanceSheet?.length! - 2].balance?.toFixed(2)
      : 0;

  const formatCurrentValue = (value: number) => {
    if (value === 0) return `R ${numberWithSpaces(String(value.toFixed(2)))}`;

    if (value > 0) return `+ R ${numberWithSpaces(String(value.toFixed(2)))}`;

    if (value < 0)
      return `- R ${numberWithSpaces(String(Math.abs(value).toFixed(2)))}`;
  };

  const {
    setState,
    state: { stepIndex },
  } = useAppContext();

  const nextStep = () => {
    setState({ stepIndex: 1 });
  };

  useEffect(() => {
    if (stepIndex === 7) {
      const el = document.getElementById('seeAllStatements');

      el?.scrollIntoView();
      return;
    }

    if (stepIndex === 8) {
      const el = document.getElementById('howMayDaysToSubmit');

      el?.scrollIntoView();
      return;
    }
  }, [stepIndex]);

  useEffect(() => {
    // Loss check
    if (
      balanceSheet?.[balanceSheet?.length! - 2]?.balance! < 0 &&
      balanceSheet?.[balanceSheet?.length! - 3]?.balance! < 0
    ) {
      // setIsLoss(true);
      // setIsProfit(false);
    }

    // Profit check
    if (
      balanceSheet?.[balanceSheet?.length! - 2]?.balance! > 0 &&
      balanceSheet?.[balanceSheet?.length! - 3]?.balance! > 0
    ) {
      // setIsProfit(true);
      // setIsLoss(false);
    }
    // set months for parent
    setLossProfitMonths(previousMonthRecord + ' to ' + currentMonthRecord);
    // set month for parent
    setIncomeStatementMonth(previousMonthRecord);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceSheet, previousMonthRecord, currentMonthRecord]);

  const renderData = useMemo(() => {
    return (
      <>
        {isOnline && (
          <>
            <Card
              className="bg-primaryAccent1 mt-4 flex items-center justify-around p-4"
              borderRaduis={'xl'}
              shadowSize={'md'}
            >
              <Typography
                text={`${format(submitMonthAndYear, 'LLLL')} balance`}
                type="h4"
                color={'white'}
                className="w-6/12"
              />
              <Typography
                text={`${formatCurrentValue(Number(currentMonthTotalBalance))}`}
                color={'white'}
                type="h1"
                className="w-8/12 text-right"
              />
            </Card>
            <table className="mt-4">
              <tbody>
                <tr className="bg-uiBg text-textDark font-body border-secondary h-12 w-1/3 border-b px-6 py-3">
                  <th className="w-1/3"></th>
                  <th className="text-textDark font-body">
                    <Typography
                      text={previousMonthRecord}
                      type="body"
                      color={'textDark'}
                    />
                  </th>
                  <th className="w-1/3">
                    <Typography
                      text={currentMonthRecord}
                      type="body"
                      color={'textDark'}
                    />
                  </th>
                </tr>
                <tr className="h-14">
                  <td className="w-1/3">
                    <Typography
                      text={`Income`}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={previousMonthTotalIncome}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={currentMonthTotalIncome}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                </tr>
                <tr className="bg-uiBg h-14">
                  <td className="w-1/3">
                    <Typography
                      text={`Expenses`}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={previousMonthTotalExpenses}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={currentMonthTotalExpenses}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                </tr>
                <tr className=" h-14">
                  <td className="w-1/3">
                    <Typography
                      text={`Balance`}
                      weight="bold"
                      type="body"
                      color={'textDark'}
                      align={'center'}
                      className="font-bold"
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(
                        Number(previousMonthTotalBalance)
                      )}
                      type="body"
                      color={'successMain'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(
                        Number(currentMonthTotalBalance)
                      )}
                      type="body"
                      color={
                        Number(currentMonthTotalBalance!) >= 0
                          ? 'successMain'
                          : 'errorMain'
                      }
                      align={'center'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </>
    );
  }, [
    currentMonthRecord,
    currentMonthTotalBalance,
    currentMonthTotalExpenses,
    currentMonthTotalIncome,
    history,
    isOnline,
    previousMonthRecord,
    previousMonthTotalBalance,
    previousMonthTotalExpenses,
    previousMonthTotalIncome,
    isThisMonthSubmitted,
    isSubmitWindowOpen,
  ]);

  return (
    <>
      <div className="pb-180 flex flex-col justify-center p-4">
        {!isOnline && <img src={offlineImg!} alt="offline img" />}
        {renderData}

        <Button
          shape="normal"
          color="primary"
          type="filled"
          icon="DocumentSearchIcon"
          onClick={() =>
            history.push(
              ROUTES.COACH.PRACTITIONER_BUSINESS.LIST_STATEMENTS.replace(
                ':practitionerId',
                practitionerId
              )
            )
          }
          className={`mt-6 mb-8 rounded-2xl ${
            stepIndex === 7 || stepIndex === 8 ? 'pointer-events-none' : ''
          }`}
          id="seeAllStatements"
        >
          <Typography type="help" color="white" text="See all statements" />
        </Button>
      </div>
    </>
  );
};
