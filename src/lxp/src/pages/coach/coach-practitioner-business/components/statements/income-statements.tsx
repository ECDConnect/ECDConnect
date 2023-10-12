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
  ExpenseItemDto,
  IncomeItemDto,
  IncomeStatementDto,
  LocalStorageKeys,
  getNextMonth,
  getPreviousMonth,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import {
  practitionerForCoachActions,
  practitionerForCoachSelectors,
} from '@/store/practitionerForCoach';

interface IncomeStatementProps {
  statements: IncomeStatementDto[];
  unsubmittedIncome: IncomeItemDto[];
  unsubmittedExpenses: ExpenseItemDto[];
  isSubmitWindowOpen: boolean;
  isThisMonthSubmitted: boolean;
}

export const IncomeStatements: React.FC<IncomeStatementProps> = ({
  statements,
  unsubmittedIncome,
  unsubmittedExpenses,
  isSubmitWindowOpen,
  isThisMonthSubmitted,
}) => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const offlineImg = window.localStorage.getItem(
    LocalStorageKeys.offlineStatments
  );
  const { userId } = useParams<PractitionerBusinessParams>();

  const lastMonthStatement = statements[statements.length - 1];

  const previousMonthRecord = !!lastMonthStatement
    ? `${getMonthName(lastMonthStatement.month! - 1).substring(0, 3)} ${
        lastMonthStatement.year
      }`
    : `-`;

  const previousMonthTotalIncome = !!lastMonthStatement
    ? lastMonthStatement.incomeTotal
    : 0;

  const previousMonthTotalExpenses = !!lastMonthStatement
    ? lastMonthStatement.expenseTotal
    : 0;

  const previousMonthTotalBalance = !!lastMonthStatement
    ? lastMonthStatement.balance
    : 0;

  const currentMonthRecord = isThisMonthSubmitted
    ? format(getNextMonth(new Date()), 'MMM yyyy')
    : format(new Date(), 'MMM yyyy');

  const currentMonthTotalIncome = unsubmittedIncome.reduce((total, item) => {
    return total + item.amount;
  }, 0);

  const currentMonthTotalExpenses = unsubmittedExpenses.reduce(
    (total, item) => {
      return total + item.amount;
    },
    0
  );

  const currentMonthTotalBalance =
    currentMonthTotalIncome - currentMonthTotalExpenses;

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
                text={`${format(new Date(), 'LLLL')} balance`}
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
                      text={formatCurrentValue(previousMonthTotalIncome)}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthTotalIncome)}
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
                      text={formatCurrentValue(previousMonthTotalExpenses)}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthTotalExpenses)}
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
                ':userId',
                userId
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
