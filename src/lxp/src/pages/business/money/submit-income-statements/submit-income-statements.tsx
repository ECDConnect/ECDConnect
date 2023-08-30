import ROUTES from '@/routes/routes';
import { statementsSelectors } from '@/store/statements';
import { numberWithSpaces } from '@/utils/statements/statements-utils';
import {
  Typography,
  StatusChip,
  Button,
  Card,
  FADButton,
  Alert,
  renderIcon,
} from '@ecdlink/ui';
import { differenceInDays, format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import StatementsWrapper from './components/statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import PositiveBonusEmoticon from '../../../../assets/positive-bonus-emoticon.png';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  LocalStorageKeys,
  getNextMonth,
  getPreviousMonth,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const SubmitIncomeStatements: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const offlineImg = window.localStorage.getItem(
    LocalStorageKeys.offlineStatments
  );

  const monthNames = balanceSheet?.map((item) => {
    return getMonthName(item?.month! - 1).substring(0, 3);
  });

  const { isLoading: isSubmittingStatement } = useThunkFetchCall(
    'statements',
    'submitIncomeStatement'
  );
  console.log('isSubmittingStatement', isSubmittingStatement);

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

        const nextSubmit = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          7
        );
        setDaysUntilFinalSubmission(differenceInDays(nextSubmit, currentDate));
      }
    }
  }, []);

  const balanceNotifications = useMemo(() => {
    if (
      balanceSheet?.[balanceSheet?.length! - 2]?.balance! < 0 &&
      balanceSheet?.[balanceSheet?.length! - 3]?.balance! < 0
    ) {
      return (
        <Alert
          type="warning"
          className="mt-4"
          message="Over the past two months, you have made less money than you have earned. This means your business is running at a loss."
          button={
            <Button
              text={`Learn more`}
              type={'filled'}
              color={'primary'}
              textColor={'white'}
              onClick={() => {}}
            />
          }
          customIcon={
            <div className="rounded-full">
              {renderIcon('ExclamationCircleIcon', 'text-alertMain w-5 h-5')}
            </div>
          }
        />
      );
    }
    if (
      balanceSheet?.[balanceSheet?.length! - 2]?.balance! > 0 &&
      balanceSheet?.[balanceSheet?.length! - 3]?.balance! > 0
    ) {
      return (
        <Alert
          type="success"
          className="mt-4"
          message="Great job! You have made a profit for 2 months in a row!"
          list={[
            `You had R ${(
              balanceSheet?.[balanceSheet?.length! - 3]?.balance! +
              balanceSheet?.[balanceSheet?.length! - 2]?.balance!
            ).toFixed(2)} left over for ${
              monthNames?.[balanceSheet?.length! - 2]
            } & ${monthNames?.[balanceSheet?.length! - 3]} combined.`,
          ]}
          customIcon={
            <div className="rounded-full">
              <img
                src={PositiveBonusEmoticon}
                alt="positive emoticon"
                className="h-6 w-6"
              />
            </div>
          }
        />
      );
    }
    return null;
  }, [balanceSheet, monthNames]);

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

  const walkthroughSteps = useMemo(() => {
    return (
      stepIndex === 7 || stepIndex === 8 || stepIndex === 9 || stepIndex === 10
    );
  }, [stepIndex]);

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

  const renderAccordinglyWalkthroughOrNot = useMemo(() => {
    if (!walkthroughSteps) {
      return (
        <>
          {isOnline && (
            <>
              {isSubmitWindowOpen &&
                !isThisMonthSubmitted &&
                !isSubmittingStatement && (
                  <Button
                    shape="normal"
                    color="primary"
                    type="filled"
                    icon="ArrowCircleRightIcon"
                    onClick={() =>
                      history.push(
                        ROUTES.BUSINESS_SUBMIT_INCOME_STATEMENTS_LIST
                      )
                    }
                    className="mt-6 rounded-2xl"
                  >
                    <Typography
                      type="help"
                      color="white"
                      text="Submit income statement"
                    />
                  </Button>
                )}
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
                  text={`${formatCurrentValue(
                    Number(currentMonthTotalBalance)
                  )}`}
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
    } else {
      return (
        <>
          <div id="submitIncomeButton" className="w-full">
            <Button
              shape="normal"
              color="primary"
              type="filled"
              icon="ArrowCircleRightIcon"
              onClick={() => {}}
              className="mt-6 w-full rounded-2xl"
            >
              <Typography
                type="help"
                color="white"
                text="Submit income statement"
              />
            </Button>
          </div>
          <div
            id="statementsDashboard"
            className="flex flex-col justify-center p-4"
          >
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
                text={`${formatCurrentValue(100.25)}`}
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
                      text={`+ R 100.25`}
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
            <div id="lastStep"></div>
          </div>
        </>
      );
    }
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
    walkthroughSteps,
    isThisMonthSubmitted,
    isSubmitWindowOpen,
  ]);

  return (
    <>
      <StatementsWrapper />
      <div className="pb-180 flex flex-col justify-center p-4">
        {isOnline &&
          !isThisMonthSubmitted &&
          isSubmitWindowOpen &&
          !isSubmittingStatement && (
            <div
              className={
                walkthroughSteps
                  ? 'mt-2 flex items-center pt-4'
                  : 'flex items-center'
              }
              id="howMayDaysToSubmit"
            >
              <StatusChip
                backgroundColour={
                  daysUntilFinalSubmission > 8 ? 'successMain' : 'alertMain'
                }
                borderColour={
                  daysUntilFinalSubmission > 8 ? 'successMain' : 'alertMain'
                }
                text={`${daysUntilFinalSubmission} days`}
                textColour={'white'}
                className={'mr-2'}
              />
              <Typography
                className="truncate"
                type="h4"
                weight="bold"
                color="textDark"
                text={'To submit next income statement'}
              />
            </div>
          )}
        {!isOnline && <img src={offlineImg!} alt="offline img" />}
        {renderAccordinglyWalkthroughOrNot}
        {balanceNotifications}

        <Button
          shape="normal"
          color="primary"
          type="filled"
          icon="DocumentSearchIcon"
          onClick={() => history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST)}
          className={`mt-6 mb-8 rounded-2xl ${
            stepIndex === 7 || stepIndex === 8 ? 'pointer-events-none' : ''
          }`}
          id="seeAllStatements"
        >
          <Typography type="help" color="white" text="See all statements" />
        </Button>

        <FADButton
          title={'Add income or expense'}
          icon={'PlusIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'filled'}
          color={'primary'}
          shape={'round'}
          className={`absolute bottom-14 right-0 z-10 m-3 px-3.5 py-2.5 ${
            stepIndex === 7 || stepIndex === 8 ? 'pointer-events-none' : ''
          }`}
          click={() => {
            history.push(ROUTES.BUSINESS_ADD_AMOUNT);
            nextStep();
          }}
          id="startStatements"
        />
      </div>
    </>
  );
};
