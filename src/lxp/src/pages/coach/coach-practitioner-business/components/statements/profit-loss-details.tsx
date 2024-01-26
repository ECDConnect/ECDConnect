import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Alert, BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { IncomeStatementDto } from '@ecdlink/core';
import { formatCurrentValue } from '@/utils/statements/statements-utils';
import { WhatsappCall } from '../contact/whatsapp-call';
import { useCallback, useEffect } from 'react';
import { differenceInBusinessDays } from 'date-fns';
import { useAppDispatch } from '@/store';
import {
  practitionerForCoachActions,
  practitionerForCoachThunkActions,
} from '@/store/practitionerForCoach';
import { useParams } from 'react-router';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';

export type MonthsProfitProps = {
  statements: IncomeStatementDto[];
  practitionerFirstName: string;
  onBack: () => void;
};

export const ProfitLossDetails: React.FC<MonthsProfitProps> = ({
  statements,
  practitionerFirstName,
  onBack,
}) => {
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const { userId } = useParams<PractitionerBusinessParams>();
  const lastStatement = statements[statements.length - 1];
  const previousStatement = statements[statements.length - 2];

  const lastMonth = !!lastStatement
    ? `${getMonthName(lastStatement.month! - 1).substring(0, 3)} ${
        lastStatement.year
      }`
    : `-`;

  const previousMonth = !!previousStatement
    ? `${getMonthName(previousStatement.month! - 1).substring(0, 3)} ${
        previousStatement.year
      }`
    : `-`;

  const lastStatementBalance = lastStatement.balance || 0;
  const previousStatementBalance = previousStatement.balance || 0;
  const balance = lastStatementBalance + previousStatementBalance;
  const totalDiffDays = !!lastStatement
    ? differenceInBusinessDays(
        new Date(),
        new Date(lastStatement.year, lastStatement.month, 1)
      )
    : 0;

  useEffect(() => {
    // Dismiss the alert after 21 days.
    if (totalDiffDays >= 21 && balance < 0 && !lastStatement.contactedByCoach) {
      appDispatch(
        practitionerForCoachThunkActions.updateUserContactStatusForStatement({
          statementId: lastStatement.id,
        })
      )
        .unwrap()
        .then((result) =>
          appDispatch(
            practitionerForCoachActions.updateStatementForPractitioner({
              userId: userId,
              statementId: result.id,
            })
          )
        );
    }
  }, [totalDiffDays, balance, appDispatch, lastStatement, userId]);

  const onDismiss = useCallback(() => {
    // Dismiss the alert when the user taps "I have contacted ....."
    if (balance < 0 && !lastStatement.contactedByCoach) {
      appDispatch(
        practitionerForCoachThunkActions.updateUserContactStatusForStatement({
          statementId: lastStatement.id,
        })
      )
        .unwrap()
        .then((result) =>
          appDispatch(
            practitionerForCoachActions.updateStatementForPractitioner({
              userId: userId,
              statementId: result.id,
            })
          )
        );
    }
    onBack();
  }, [appDispatch, balance, lastStatement, onBack, userId]);

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="Business Balance"
        onBack={onBack}
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">
            <div className="flex items-center gap-2">
              {balance > 0 ? (
                <>
                  <span
                    className={`text-l bg-successMain rounded-full p-3 font-semibold text-white`}
                  >
                    &nbsp;2&nbsp;
                  </span>
                  <Typography type="h3" text={` Months of making a profit}`} />
                </>
              ) : !lastStatement.contactedByCoach ? (
                <>
                  <span
                    className={`text-l bg-alertMain rounded-full p-3 font-semibold text-white`}
                  >
                    &nbsp;2&nbsp;
                  </span>
                  <Typography type="h3" text={` Months of making a loss`} />
                </>
              ) : (
                <div />
              )}
            </div>

            <div>
              <Typography
                className="mt-2 text-left"
                color="textMid"
                text={`${previousMonth} to ${lastMonth}`}
                type={'body'}
              />
            </div>

            <div>
              {balance > 0 ? (
                <Alert
                  type={'info'}
                  className="items-left justify-left mt-4 flex"
                  title={`Over the past two months ${practitionerFirstName} has made more money than they have spent.`}
                />
              ) : !lastStatement.contactedByCoach ? (
                <Alert
                  type={'warning'}
                  className="items-left justify-left mt-4 flex"
                  title={`Over the past two months ${practitionerFirstName} has made less money than they have earned.`}
                />
              ) : (
                <div />
              )}
            </div>

            <table className="mt-4" width={`100%`}>
              <tbody>
                <tr className="bg-uiBg text-textDark font-body border-secondary border-b px-6 py-3">
                  <th className="text-textDark font-body">
                    <Typography
                      text="MONTH"
                      type="body"
                      className="px-6 py-3"
                      color={'textDark'}
                      align={'left'}
                    />
                  </th>
                  <th className="w-12">
                    <Typography
                      text="AMOUNT"
                      type="body"
                      color={'textDark'}
                      align={'left'}
                    />
                  </th>
                </tr>
                <tr className="h-14">
                  <td width={`60%`}>
                    <Typography
                      text={previousMonth}
                      type="body"
                      className="px-6 py-3"
                      color={'textDark'}
                      align={'left'}
                    />
                  </td>
                  <td width={`60%`}>
                    <Typography
                      text={formatCurrentValue(previousStatementBalance)}
                      type="body"
                      color={
                        previousStatementBalance >= 0
                          ? 'successMain'
                          : 'errorMain'
                      }
                      align={'left'}
                    />
                  </td>
                </tr>
                <tr className="h-14">
                  <td width={`60%`}>
                    <Typography
                      text={lastMonth}
                      type="body"
                      className="px-6 py-3"
                      color={'textDark'}
                      align={'left'}
                    />
                  </td>
                  <td width={`60%`}>
                    <Typography
                      text={formatCurrentValue(lastStatementBalance)}
                      type="body"
                      color={
                        lastStatementBalance >= 0 ? 'successMain' : 'errorMain'
                      }
                      align={'left'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <WhatsappCall />
            {balance < 0 && !lastStatement.contactedByCoach && (
              <div className="flex flex-col justify-center">
                <Button
                  shape="normal"
                  color="primary"
                  type="filled"
                  icon="CheckCircleIcon"
                  onClick={onDismiss}
                  className="mt-6 rounded-2xl"
                >
                  <Typography
                    type="help"
                    color="white"
                    text={`I have contacted ${practitionerFirstName}`}
                  />
                </Button>
              </div>
            )}
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
