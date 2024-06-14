import ROUTES from '@/routes/routes';
import { statementsActions, statementsSelectors } from '@/store/statements';
import {
  getStatementBalance,
  getStatementExpenseTotal,
  getStatementIncomeTotal,
  numberWithSpaces,
} from '@/utils/statements/statements-utils';
import {
  Typography,
  StatusChip,
  Button,
  Card,
  FADButton,
  Alert,
  renderIcon,
  CelebrationCard,
  Dialog,
  DialogPosition,
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
  IncomeStatementDto,
  LocalStorageKeys,
  SmartStartPointsLibrary,
  getNextMonth,
  getPreviousMonth,
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
import { InfoPage } from './components/info-page';
import { CoachInfo } from '../../components/coach-info';
import { newGuid } from '@/utils/common/uuid.utils';
import { useAppDispatch } from '@/store';

export const SubmitIncomeStatements: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLearnMore, setIsLearnMore] = useState(false);

  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const statements = useSelector(statementsSelectors.getIncomeStatements);

  const { isLoading: isSubmittingStatement } = useThunkFetchCall(
    'statements',
    'submitIncomeStatement'
  );

  // If no statement for current month
  // TODO if we ahven't fetched recently, do we need to force them to sync first? To ensure we don't create a statement for the month, if one exists on the server?
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    if (!statements.some((x) => x.month === month && x.year === year)) {
      dispatch(
        statementsActions.createStatement({
          id: newGuid(),
          month: month,
          year: year,
          incomeItems: [],
          expenseItems: [],
          contactedByCoach: false,
          downloaded: false,
        })
      );
    }
  }, []);

  const currentMonthStatement = statements[statements.length - 1];
  const lastMonthStatement = statements[statements.length - 2];

  const getStatementTitle = (statement: IncomeStatementDto | undefined) =>
    !!statement
      ? `${getMonthName(statement.month! - 1).substring(0, 3)} ${
          statement.year
        }`
      : `-`;

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
  const [pointsMessageDismissedDate, setPointsMessageDismissedDate] = useState<
    string | undefined
  >(undefined);

  const submitStatementConsecutivePointLibrary = useSelector(
    pointsSelectors.getPointsLibraryById(
      SmartStartPointsLibrary.SUBMIT_STATEMENTS_CONSECUTIVE
    )
  );

  const submitStatementPoints = useSelector(
    pointsSelectors.getPointsSummariesForActivity(
      SmartStartPointsLibrary.SUBMIT_STATEMENTS,
      13 // Need to get last 13 months, in case we are in the next month but still the submit window
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
    const storageItem = getStorageItem<string>(
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );

    if (storageItem) {
      setPointsMessageDismissedDate(new Date(storageItem).toDateString());
    }
  }, []);

  const onDismissCelebration = useCallback(() => {
    const dismissedDate = new Date();
    setStorageItem(
      JSON.stringify(dismissedDate),
      LocalStorageKeys.pointsSubmitStatementsMessageDismissed
    );
    setPointsMessageDismissedDate(dismissedDate.toDateString());
  }, []);

  // Points celebration card, not sure if still need any of this, but it's likely to change a lot with no submit at least
  // const celebrationCard = useMemo<JSX.Element>(() => {
  //   const messageDismissedDate = !!pointsMessageDismissedDate
  //     ? new Date(pointsMessageDismissedDate)
  //     : undefined;

  //   if (
  //     currentDate.getDate() < IncomeStatementDates.SubmitStartDay &&
  //     currentDate.getDate() > IncomeStatementDates.SubmitEndDay
  //   ) {
  //     return <></>;
  //   }

  //   if (
  //     currentDate.getDate() >= IncomeStatementDates.SubmitStartDay &&
  //     !isThisMonthSubmitted
  //   ) {
  //     return <></>;
  //   }

  //   if (
  //     currentDate.getDate() >= IncomeStatementDates.SubmitStartDay &&
  //     isThisMonthSubmitted &&
  //     !!messageDismissedDate &&
  //     messageDismissedDate.getMonth() === currentDate.getMonth() &&
  //     messageDismissedDate.getDate() >= IncomeStatementDates.SubmitStartDay
  //   ) {
  //     return <></>;
  //   }

  //   if (
  //     currentDate.getDate() <= IncomeStatementDates.SubmitEndDay &&
  //     !isLastMonthSubmitted
  //   ) {
  //     return <></>;
  //   }

  //   if (
  //     currentDate.getDate() < IncomeStatementDates.SubmitEndDay &&
  //     isLastMonthSubmitted &&
  //     !!messageDismissedDate &&
  //     ((messageDismissedDate.getMonth() ===
  //       getPreviousMonth(currentDate).getMonth() &&
  //       messageDismissedDate.getDate() > IncomeStatementDates.SubmitStartDay) ||
  //       (messageDismissedDate.getMonth() === currentDate.getMonth() &&
  //         messageDismissedDate.getDate() <= IncomeStatementDates.SubmitEndDay))
  //   ) {
  //     return <></>;
  //   }

  //   // Check depending on window if we need to try display last months message
  //   // We can just add an offset of 1 to the logic below to ignore this months points if we want to show for last month
  //   var offset =
  //     currentDate.getDate() <= IncomeStatementDates.SubmitEndDay
  //       ? 1 // Last month
  //       : 0; // Current month

  //   let submittedMonthsInARow = 0;
  //   for (
  //     let i = offset;
  //     i < submitStatementPoints.length &&
  //     submitStatementPoints[i].pointsTotal !== 0;
  //     i++
  //   ) {
  //     submittedMonthsInARow++;
  //   }

  //   if (submittedMonthsInARow === 0) {
  //     return <></>;
  //   }

  //   let monthsSinceConsecutiveBonus = 0;
  //   for (
  //     let i = offset;
  //     i < submitStatementConsecutivePoints.length &&
  //     submitStatementConsecutivePoints[i].pointsTotal === 0;
  //     i++
  //   ) {
  //     monthsSinceConsecutiveBonus++;
  //   }

  //   const submittedPointsThisMonth = submitStatementPoints[offset].pointsTotal;
  //   const submittedWithFeesPointsThisMonth =
  //     submitPreschoolFeesPoints[offset].pointsTotal;
  //   const submitConsecutiveBonusPointsThisMonth =
  //     submitStatementConsecutivePoints[offset]?.pointsTotal;
  //   const monthTotal =
  //     submittedPointsThisMonth +
  //     submittedWithFeesPointsThisMonth +
  //     submitConsecutiveBonusPointsThisMonth;

  //   const preschoolFeesMessage =
  //     ' & you added preschool fees for each child this month';
  //   const consecutiveBonusMessage = ' You earned 25 bonus points.';

  //   // Improved messaging and colours for 12+ months submitted in a row
  //   if (submittedMonthsInARow === 12) {
  //     return (
  //       <CelebrationCard
  //         image={<EmojiYellowBigSmile className="mr-2 h-16 w-16" />}
  //         primaryMessage={`Amazing! You submitted statements for 12 months in a row${
  //           submittedWithFeesPointsThisMonth > 0 ? preschoolFeesMessage : ''
  //         }!`}
  //         scoreMessage={`${monthTotal} points earned`}
  //         scoreIcon="GiftIcon"
  //         primaryTextColour="uiBg"
  //         secondaryTextColour="uiBg"
  //         backgroundColour="successMain"
  //         onDismiss={onDismissCelebration}
  //         secondaryMessage=""
  //       />
  //     );
  //   }

  //   // Only the last month submitted
  //   if (submittedMonthsInARow === 1) {
  //     return (
  //       <CelebrationCard
  //         image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
  //         primaryMessage={`Great jobl! You have submitted your ${format(
  //           offset === 0 ? new Date() : getPreviousMonth(new Date()),
  //           'MMMM'
  //         )} statement${
  //           submittedWithFeesPointsThisMonth > 0 ? preschoolFeesMessage : ''
  //         }!`}
  //         //scoreMessage={`${monthTotal} points earned`}
  //         scoreIcon="GiftIcon"
  //         primaryTextColour="successMain"
  //         backgroundColour="successBg"
  //         onDismiss={onDismissCelebration}
  //         secondaryMessage=""
  //         secondaryTextColour="black"
  //       />
  //     );
  //   }

  //   // Multiple months, but less than 12
  //   return (
  //     <CelebrationCard
  //       image={<EmojiGreenSmile className="mr-2 h-16 w-16" />}
  //       primaryMessage={`Wow you're on a roll! You submitted statements for ${submittedMonthsInARow} months in a row${
  //         submittedWithFeesPointsThisMonth > 0 ? preschoolFeesMessage : ''
  //       }! ${
  //         submitConsecutiveBonusPointsThisMonth > 0
  //           ? consecutiveBonusMessage
  //           : ''
  //       }`}
  //       // scoreMessage={`${monthTotal} points earned`}
  //       scoreIcon="GiftIcon"
  //       primaryTextColour="successMain"
  //       backgroundColour="successBg"
  //       onDismiss={onDismissCelebration}
  //       secondaryMessage={
  //         monthsSinceConsecutiveBonus === 2
  //           ? `Submit you next statement to earn ${submitStatementConsecutivePointLibrary?.points} bonus points.`
  //           : ''
  //       }
  //       secondaryTextColour="black"
  //     />
  //   );
  // }, [
  //   pointsMessageDismissedDate,
  //   submitStatementPoints,
  //   submitPreschoolFeesPoints,
  //   submitStatementConsecutivePoints,
  // ]);

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

  const lastMonthBalance = lastMonthIncomeTotal - lastMonthExpenseTotal;
  const currentMonthBalance =
    currentMonthIncomeTotal - currentMonthExpenseTotal;

  const hasIncomeStatements =
    !!lastMonthIncomeTotal ||
    !!lastMonthExpenseTotal ||
    currentMonthExpenseTotal ||
    currentMonthIncomeTotal;

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
            {/* {!!celebrationCard && celebrationCard} */}

            <Card
              className="bg-primaryAccent1 mt-4 flex items-center justify-around p-4"
              borderRaduis={'xl'}
              shadowSize={'md'}
            >
              <Typography
                text={`${format(new Date(), 'MMMM')} balance`}
                type="h4"
                color={'white'}
                className="w-6/12"
              />
              <Typography
                text={`${formatCurrentValue(currentMonthBalance)}`}
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
                      text={`${formatCurrentValue(lastMonthIncomeTotal)}`}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={`${formatCurrentValue(currentMonthIncomeTotal)}`}
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
                      text={`${formatCurrentValue(lastMonthExpenseTotal)}`}
                      type="body"
                      color={'textDark'}
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={`${formatCurrentValue(currentMonthExpenseTotal)}`}
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
                      text={formatCurrentValue(lastMonthBalance)}
                      type="body"
                      color={
                        lastMonthBalance >= 0 ? 'successMain' : 'secondary'
                      }
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthBalance)}
                      type="body"
                      color={
                        currentMonthBalance >= 0 ? 'successMain' : 'secondary'
                      }
                      align={'center'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            {/* 
              {balanceNotifications} */}

            <Button
              shape="normal"
              color="quatenary"
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
          color={'quatenary'}
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
      <Dialog fullScreen visible={isLearnMore} position={DialogPosition.Full}>
        <InfoPage
          title="Ideas for making a profit"
          section="Business - Money tab, Learn more"
          childrenPosition="bottom"
          onClose={() => setIsLearnMore(false)}
        >
          <CoachInfo />
        </InfoPage>
      </Dialog>
    </>
  );
};
