import {
  formatCurrentValue,
  getStatementExpenseTotal,
  getStatementIncomeTotal,
} from '@/utils/statements/statements-utils';
import { Typography, Card } from '@ecdlink/ui';
import { format } from 'date-fns';
import React, { useEffect, useMemo } from 'react';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import { useAppContext } from '@/walkthrougContext';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { IncomeStatementDto, LocalStorageKeys } from '@ecdlink/core';

interface IncomeStatementProps {
  statements: IncomeStatementDto[];
  isThisMonthSubmitted: boolean;
  isLastMonthSubmitted: boolean;
}

export const IncomeStatements: React.FC<IncomeStatementProps> = ({
  statements,
}) => {
  const { isOnline } = useOnlineStatus();
  const offlineImg = window.localStorage.getItem(
    LocalStorageKeys.offlineStatments
  );
  const {
    state: { stepIndex },
  } = useAppContext();

  useEffect(() => {
    if (stepIndex === 7) {
      const el = document.getElementById('seeAllStatements');

      el?.scrollIntoView();
      return;
    }
  }, [stepIndex]);

  const currentMonthStatement = statements[statements.length - 1];
  const lastMonthStatement = statements[statements.length - 2];

  const lastMonthIncomeTotal = useMemo(
    () => getStatementIncomeTotal(lastMonthStatement),
    [lastMonthStatement]
  );

  const currentMonthIncomeTotal = useMemo(
    () => getStatementIncomeTotal(currentMonthStatement),
    [currentMonthStatement]
  );

  const lastMonthExpenseTotal = useMemo(
    () => getStatementExpenseTotal(lastMonthStatement),
    [lastMonthStatement]
  );

  const currentMonthExpenseTotal = useMemo(
    () => getStatementExpenseTotal(currentMonthStatement),
    [currentMonthStatement]
  );

  const renderData = useMemo(() => {
    const getStatementTitle = (statement: IncomeStatementDto | undefined) =>
      !!statement
        ? `${getMonthName(statement.month! - 1).substring(0, 3)} ${
            statement.year
          }`
        : `-`;

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
                text={`${getMonthName(
                  currentMonthStatement?.month! - 1
                )} balance`}
                type="h4"
                color={'white'}
                className="w-6/12"
              />
              <Typography
                text={`${formatCurrentValue(
                  currentMonthIncomeTotal - currentMonthExpenseTotal
                )}`}
                color={'white'}
                type="h1"
                className="w-8/12 text-right"
              />
            </Card>
            <table className="mt-4">
              <tbody>
                <tr className="bg-uiBg text-textDark font-body border-quatenary h-12 w-1/3 border-b px-6 py-3">
                  <th className="w-1/3"></th>
                  <th className="text-textDark font-body">
                    <Typography
                      text={getStatementTitle(lastMonthStatement)}
                      type="body"
                      color={'textDark'}
                    />
                  </th>
                  <th className="w-1/3">
                    <Typography
                      text={getStatementTitle(currentMonthStatement)}
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
                      text={formatCurrentValue(lastMonthIncomeTotal)}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthIncomeTotal)}
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
                      text={formatCurrentValue(lastMonthExpenseTotal)}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthExpenseTotal)}
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
                        lastMonthIncomeTotal - lastMonthExpenseTotal
                      )}
                      type="body"
                      color={
                        lastMonthIncomeTotal - lastMonthExpenseTotal >= 0
                          ? 'successMain'
                          : 'errorMain'
                      }
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(
                        currentMonthIncomeTotal - currentMonthExpenseTotal
                      )}
                      type="body"
                      color={
                        currentMonthIncomeTotal - currentMonthExpenseTotal >= 0
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
  }, [isOnline]);

  return (
    <>
      <div className="pb-180 flex flex-col justify-center p-4">
        {!isOnline && <img src={offlineImg!} alt="offline img" />}
        {renderData}
      </div>
    </>
  );
};
