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
  CelebrationCard,
} from '@ecdlink/ui';
import { differenceInDays, format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import StatementsWrapper from './components/statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import PositiveBonusEmoticon from '../../../../assets/positive-bonus-emoticon.png';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  LocalStorageKeys,
  SmartStartPointsLibrary,
  getNextMonth,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ReactComponent as EmojiYellowBigSmile } from '@/assets/ECD_Connect_emoji3.svg';
import { ReactComponent as EmojiGreenSmile } from '@/assets/ECD_Connect_emoji1.svg';
import { pointsSelectors } from '@/store/points';
import {
  getStorageItem,
  setStorageItem,
} from '@/utils/common/local-storage.utils';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';

export const SubmitIncomeStatements: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const statements = useSelector(statementsSelectors.getIncomeStatements);
  const unSubmittedIncomeItems = useSelector(
    statementsSelectors.getUnsubmittedIncomeItems
  );
  const unSubmittedExpenseItems = useSelector(
    statementsSelectors.getUnsubmittedExpenseItems
  );

  const { isLoading: isSubmittingStatement } = useThunkFetchCall(
    'statements',
    'submitIncomeStatement'
  );

  const hasIncomeStatements =
    unSubmittedIncomeItems.length > 0 ||
    unSubmittedExpenseItems.length > 0 ||
    statements.length > 0;

  const isThisMonthSubmitted = useMemo<boolean>(
    () => !!statements?.find((x) => x.month === new Date().getMonth() + 1),
    [statements]
  );

  const isLastMonthSubmitted = useMemo<boolean>(
    () => !!statements?.find((x) => x.month === new Date().getMonth()),
    [statements]
  );

  const [daysUntilFinalSubmission, setDaysUntilFinalSubmission] =
    useState<number>(0);

  const currentDate = new Date();
  const isSubmitWindowOpen =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay ||
    currentDate.getDate() <= IncomeStatementDates.SubmitEndDay;

  const isStatementSubmitted =
    new Date().getDate() <= IncomeStatementDates.SubmitEndDay
      ? isLastMonthSubmitted
      : isThisMonthSubmitted;

  useEffect(() => {
    const date = new Date();
    // Outside submit
    if (
      date.getDate() <= IncomeStatementDates.SubmitEndDay &&
      !isLastMonthSubmitted
    ) {
      const nextSubmit = new Date(date.getFullYear(), date.getMonth(), 7);
      setDaysUntilFinalSubmission(differenceInDays(nextSubmit, date));
    } else {
      const nextMonth = getNextMonth(date);
      const nextSubmit = new Date(
        nextMonth.getFullYear(),
        nextMonth.getMonth(),
        7
      );
      setDaysUntilFinalSubmission(differenceInDays(nextSubmit, date));
    }
  }, [statements, isSubmitWindowOpen, setDaysUntilFinalSubmission]);

  const balanceNotifications = useMemo(() => {
    const lastMonthStatement = statements[statements.length - 1];
    const previousMonthStatement = statements[statements.length - 2];

    // No data for last two months
    if (!lastMonthStatement || !previousMonthStatement) {
      return <></>;
    }

    const lastTwoStatementsBalance =
      lastMonthStatement.balance + previousMonthStatement.balance;

    if (lastTwoStatementsBalance < 0) {
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
    if (lastTwoStatementsBalance > 0) {
      return (
        <Alert
          type="success"
          className="mt-4"
          message="Great job! You have made a profit for 2 months in a row!"
          list={[
            `You had R ${lastTwoStatementsBalance.toFixed(2)} left over for 
            ${getMonthName(lastMonthStatement.month - 1).substring(0, 3)} & 
            ${getMonthName(previousMonthStatement.month - 1).substring(
              0,
              3
            )} combined.`,
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
  }, [statements]);

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
    ? format(getNextMonth(currentDate), 'MMM yyyy')
    : format(currentDate, 'MMM yyyy');

  const currentMonthTotalIncome = unSubmittedIncomeItems.reduce(
    (total, item) => {
      return total + item.amount;
    },
    0
  );

  const currentMonthTotalExpenses = unSubmittedExpenseItems.reduce(
    (total, item) => {
      return total + item.amount;
    },
    0
  );

  const currentMonthTotalBalance =
    currentMonthTotalIncome - currentMonthTotalExpenses;

  const formatCurrentValue = (value: number) => {
    if (value === 0) return `R ${numberWithSpaces(value.toFixed(2))}`;

    if (value > 0) return `+ R ${numberWithSpaces(value.toFixed(2))}`;

    if (value < 0) return `- R ${numberWithSpaces(Math.abs(value).toFixed(2))}`;
  };

  const {
    setState,
    state: { stepIndex, tourActive },
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

  // POINTS LOGIC
  const [
    pointsSubmitStatementsMessageDismissed,
    setPointsSubmitStatementsMessageDismissed,
  ] = useState<boolean>(false);
  const submitStatementConsecutivePointLibrary = useSelector(
    pointsSelectors.getPointsLibraryById(
      SmartStartPointsLibrary.SUBMIT_STATEMENTS_CONSECUTIVE
    )
  );

  const submitStatementPoints = useSelector(
    pointsSelectors.getPointsSummariesForActivity(
      SmartStartPointsLibrary.SUBMIT_STATEMENTS
    )
  );
  const submitPreschoolFeesPoints = useSelector(
    pointsSelectors.getPointsSummariesForActivity(
      SmartStartPointsLibrary.SUBMIT_STATEMENTS_PRESCHOOL_FEES_ADDED
    )
  );
  const submitStatementConsecutivePoints = useSelector(
    pointsSelectors.getPointsSummariesForActivity(
      SmartStartPointsLibrary.SUBMIT_STATEMENTS_CONSECUTIVE
    )
  );

  useEffect(() => {
    const storageItem = getStorageItem<number>(
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );

    if (!!storageItem && currentDate.getMonth() === storageItem) {
      setPointsSubmitStatementsMessageDismissed(true);
    } else {
      setPointsSubmitStatementsMessageDismissed(false);
    }
  }, []);

  const onDismissCelebration = useCallback(() => {
    setStorageItem(
      new Date().getMonth(),
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );
    setPointsSubmitStatementsMessageDismissed(true);
  }, []);

  const celebrationCard = useMemo<JSX.Element>(() => {
    if (!isThisMonthSubmitted || pointsSubmitStatementsMessageDismissed) {
      console.log('No message to display');
      return <></>;
    }

    let submittedMonthsInARow = 0;
    for (
      let i = 0;
      i < submitStatementPoints.length &&
      submitStatementPoints[i].pointsTotal !== 0;
      i++
    ) {
      submittedMonthsInARow++;
    }

    if (submittedMonthsInARow === 0) {
      return <></>;
    }

    let monthsSinceConsecutiveBonus = 0;
    for (
      let i = 0;
      i < submitStatementConsecutivePoints.length &&
      submitStatementConsecutivePoints[i].pointsTotal === 0;
      i++
    ) {
      monthsSinceConsecutiveBonus++;
    }

    const submittedPointsThisMonth = submitStatementPoints[0].pointsTotal;
    const submittedWithFeesPointsThisMonth =
      submitPreschoolFeesPoints[0].pointsTotal;
    const submitConsecutiveBonusPointsThisMonth =
      submitStatementConsecutivePoints[0].pointsTotal;
    const monthTotal =
      submittedPointsThisMonth +
      submittedWithFeesPointsThisMonth +
      submitConsecutiveBonusPointsThisMonth;

    const preschoolFeesMessage =
      ' & you added preschool fees for each child this month';
    const consecutiveBonusMessage = ' You earned 25 bonus points.';

    // Improved messaging and colours for 12+ months submitted in a row
    if (submittedMonthsInARow >= 12) {
      return (
        <CelebrationCard
          image={<EmojiYellowBigSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Amazing! You submitted statements for 12 months in a row${
            submittedWithFeesPointsThisMonth > 0 ? preschoolFeesMessage : ''
          }!`}
          scoreMessage={`${monthTotal} points earned`}
          scoreIcon="GiftIcon"
          primaryTextColour="uiBg"
          secondaryTextColour="uiBg"
          backgroundColour="successMain"
          onDismiss={onDismissCelebration}
          secondaryMessage=""
        />
      );
    }

    // Only the last month submitted
    if (submittedMonthsInARow === 1) {
      return (
        <CelebrationCard
          image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
          primaryMessage={`Great jobl! You have submitted your ${format(
            new Date(),
            'MMMM'
          )} statement${
            submittedWithFeesPointsThisMonth > 0 ? preschoolFeesMessage : ''
          }!`}
          scoreMessage={`${monthTotal} points earned`}
          scoreIcon="GiftIcon"
          primaryTextColour="successMain"
          backgroundColour="successBg"
          onDismiss={onDismissCelebration}
          secondaryMessage=""
          secondaryTextColour="black"
        />
      );
    }

    // Multiple months, but less than 12
    return (
      <CelebrationCard
        image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
        primaryMessage={`Wow you're on a roll! You submitted statements for ${submittedMonthsInARow} months in a row${
          submittedWithFeesPointsThisMonth > 0 ? preschoolFeesMessage : ''
        }! ${
          submitConsecutiveBonusPointsThisMonth > 0
            ? consecutiveBonusMessage
            : ''
        }`}
        scoreMessage={`${monthTotal} points earned`}
        scoreIcon="GiftIcon"
        primaryTextColour="successMain"
        backgroundColour="successBg"
        onDismiss={onDismissCelebration}
        secondaryMessage={
          monthsSinceConsecutiveBonus >= 2
            ? `Submit you next statement to earn ${submitStatementConsecutivePointLibrary?.points} bonus points.`
            : ''
        }
        secondaryTextColour="black"
      />
    );
  }, [
    pointsSubmitStatementsMessageDismissed,
    submitStatementPoints,
    submitPreschoolFeesPoints,
    submitStatementConsecutivePoints,
  ]);

  return (
    <>
      <StatementsWrapper />
      <div className="pb-180 flex flex-col justify-center p-4" id="lastStep">
        {!hasIncomeStatements && (
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
        )}
        {hasIncomeStatements && (
          <div id="statementsDashboard">
            {isOnline &&
              !isThisMonthSubmitted &&
              isSubmitWindowOpen &&
              !isSubmittingStatement && (
                <div className="flex items-center" id="howMayDaysToSubmit">
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

            {!!celebrationCard && celebrationCard}

            {((isOnline &&
              isSubmitWindowOpen &&
              !isStatementSubmitted &&
              !isSubmittingStatement) ||
              (tourActive && stepIndex === 9)) && (
              <Button
                shape="normal"
                color="primary"
                type="filled"
                icon="ArrowCircleRightIcon"
                onClick={() =>
                  history.push(ROUTES.BUSINESS_SUBMIT_INCOME_STATEMENTS_LIST)
                }
                className="mt-6 w-full rounded-2xl"
                id="submitIncomeButton"
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
                text={`${
                  isThisMonthSubmitted
                    ? format(getNextMonth(currentDate), 'MMMM')
                    : format(currentDate, 'MMMM')
                } balance`}
                type="h4"
                color={'white'}
                className="w-6/12"
              />
              <Typography
                text={`${formatCurrentValue(currentMonthTotalBalance)}`}
                color={'white'}
                type="h1"
                className="w-8/12 text-right"
              />
            </Card>
            <table className="mt-4 w-full">
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
                      text={`${formatCurrentValue(previousMonthTotalIncome)}`}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={`${formatCurrentValue(currentMonthTotalIncome)}`}
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
                      text={`${formatCurrentValue(previousMonthTotalExpenses)}`}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={`${formatCurrentValue(currentMonthTotalExpenses)}`}
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
                      text={formatCurrentValue(previousMonthTotalBalance)}
                      type="body"
                      color={
                        previousMonthTotalBalance >= 0
                          ? 'successMain'
                          : 'errorMain'
                      }
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthTotalBalance)}
                      type="body"
                      color={
                        currentMonthTotalBalance >= 0
                          ? 'successMain'
                          : 'errorMain'
                      }
                      align={'center'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {balanceNotifications}

            <Button
              shape="normal"
              color="primary"
              type="filled"
              icon="DocumentSearchIcon"
              onClick={() =>
                history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST)
              }
              className={`mt-6 mb-8 w-full rounded-2xl ${
                stepIndex === 7 || stepIndex === 8 ? 'pointer-events-none' : ''
              }`}
              id="seeAllStatements"
            >
              <Typography type="help" color="white" text="See all statements" />
            </Button>
          </div>
        )}

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
