import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { Alert, BannerWrapper, Typography } from '@ecdlink/ui';
import { useHistory, useLocation, useParams } from 'react-router';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { useSelector } from 'react-redux';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { practitionerSelectors } from '@/store/practitioner';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { useEffect, useState } from 'react';
import { IncomeStatementDates } from '@/constants/Dates';
import { getPreviousMonth } from '@ecdlink/core';
import { numberWithSpaces } from '@/utils/statements/statements-utils';
import { WhatsappCall } from '../contact/whatsapp-call';

export const MonthsProfit = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const location = useLocation<PractitionerBusinessParams>();
  const lossProfitMonths = location.state.lossProfitMonths;
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const practitionerFirstName = practitioner?.user?.firstName;

  // statement data and calculations
  const balanceSheet = useSelector(
    practitionerSelectors.getPractitionerBalanceSheet
  );
  const monthNames = balanceSheet?.map((item) => {
    return getMonthName(item?.month! - 1);
  });
  const [submitMonthAndYear, setSubmitMonthAndYear] = useState<Date>(
    new Date()
  );
  const [isThisMonthSubmitted, setIsThisMonthSubmitted] =
    useState<boolean>(false);

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
    } else {
      // In window and current month
      if (currentDate.getDate() >= IncomeStatementDates.SubmitStartDay) {
        setSubmitMonthAndYear(currentDate);

        setIsThisMonthSubmitted(
          balanceSheet?.find((x) => x.month === currentDate.getMonth() + 1)
            ?.submitted || false
        );
      } else {
        // In window but next month
        setSubmitMonthAndYear(getPreviousMonth(currentDate));

        setIsThisMonthSubmitted(
          balanceSheet?.find((x) => x.month === currentDate.getMonth())
            ?.submitted || false
        );
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

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="Business Balance"
        onBack={() => history.goBack()}
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">
            <div className="flex items-center gap-2">
              <span
                className={`text-l p-3 font-semibold text-white bg-${'successMain'} rounded-full`}
              >
                &nbsp;2&nbsp;
              </span>
              <Typography type="h3" text={' Months of making profit'} />
            </div>

            <div>
              <Typography
                className="mt-2 text-left"
                color="textMid"
                text={lossProfitMonths}
                type={'body'}
              />
            </div>

            <div>
              <Alert
                type={'info'}
                className="items-left justify-left mt-4 flex"
                title={
                  `Over the past two months ` +
                  practitionerFirstName +
                  ` has made more money than they have spent.`
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
                      text={previousMonthRecord}
                      type="body"
                      className="px-6 py-3"
                      color={'textDark'}
                      align={'left'}
                    />
                  </td>
                  <td width={`60%`}>
                    <Typography
                      text={formatCurrentValue(
                        Number(previousMonthTotalBalance)
                      )}
                      type="body"
                      color={'successMain'}
                      align={'left'}
                    />
                  </td>
                </tr>
                <tr className="h-14">
                  <td width={`60%`}>
                    <Typography
                      text={currentMonthRecord}
                      type="body"
                      className="px-6 py-3"
                      color={'textDark'}
                      align={'left'}
                    />
                  </td>
                  <td width={`60%`}>
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
                      align={'left'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            <WhatsappCall />
          </div>
        </div>
      </BannerWrapper>
    </>
  );
};
