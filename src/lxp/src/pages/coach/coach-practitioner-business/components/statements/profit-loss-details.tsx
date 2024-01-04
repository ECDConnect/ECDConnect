import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Alert, BannerWrapper, Button, Typography } from '@ecdlink/ui';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { IncomeStatementDto } from '@ecdlink/core';
import { formatCurrentValue } from '@/utils/statements/statements-utils';
import { WhatsappCall } from '../contact/whatsapp-call';

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
              <span
                className={`text-l p-3 font-semibold text-white bg-${
                  balance > 0 ? 'successMain' : 'alertMain'
                } rounded-full`}
              >
                &nbsp;2&nbsp;
              </span>
              <Typography
                type="h3"
                text={` Months of making a ${balance > 0 ? 'profit' : 'loss'}`}
              />
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
              <Alert
                type={balance > 0 ? 'info' : 'warning'}
                className="items-left justify-left mt-4 flex"
                title={
                  balance > 0
                    ? `Over the past two months ${practitionerFirstName} has made more money than they have spent.`
                    : `Over the past two months ${practitionerFirstName} has made less money than they have earned.`
                }
              />
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
            {balance < 0 && (
              <div className="flex flex-col justify-center">
                <Button
                  shape="normal"
                  color="primary"
                  type="filled"
                  icon="CheckCircleIcon"
                  onClick={onBack}
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
