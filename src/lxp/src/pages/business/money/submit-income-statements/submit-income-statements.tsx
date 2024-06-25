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
  Button,
  Card,
  FADButton,
  Alert,
  renderIcon,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import StatementsWrapper from './components/statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import PositiveBonusEmoticon from '../../../../assets/positive-bonus-emoticon.png';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { IncomeStatementDto, getPreviousMonth } from '@ecdlink/core';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import { InfoPage } from './components/info-page';
import { CoachInfo } from '../../components/coach-info';
import { newGuid } from '@/utils/common/uuid.utils';
import { useAppDispatch } from '@/store';

export const SubmitIncomeStatements: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isLearnMore, setIsLearnMore] = useState(false);

  const history = useHistory();
  const statements = useSelector(statementsSelectors.getIncomeStatements);

  // If no statement for current month
  // TODO if we ahven't fetched recently, do we need to force them to sync first? To ensure we don't create a statement for the month, if one exists on the server?
  useEffect(() => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    if (!statements.some((x) => x?.month === month && x.year === year)) {
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
  const previousMonthStatement = statements[statements.length - 2];

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

  const previousMonthBalance = useMemo(
    () => getStatementBalance(previousMonthStatement),
    [previousMonthStatement]
  );

  const lastMonthBalance = lastMonthIncomeTotal - lastMonthExpenseTotal;
  const currentMonthBalance =
    currentMonthIncomeTotal - currentMonthExpenseTotal;

  const hasIncomeStatements =
    !!lastMonthIncomeTotal ||
    !!lastMonthExpenseTotal ||
    !!currentMonthExpenseTotal ||
    !!currentMonthIncomeTotal;

  const lastMonth = getPreviousMonth(new Date());
  const previousMonth = getPreviousMonth(lastMonth);

  const hasLastTwoMonthsStatements =
    lastMonthStatement?.month === lastMonth.getMonth() &&
    lastMonthStatement?.year === lastMonth.getFullYear() &&
    previousMonthStatement?.month === previousMonth.getMonth() &&
    previousMonthStatement.year === previousMonth.getFullYear();

  const totalDownloadedStatements = statements.reduce(
    (total, statement) => (statement.downloaded ? total + 1 : total),
    0
  );

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
                        lastMonthBalance === 0
                          ? 'primary'
                          : lastMonthBalance >= 0
                          ? 'successMain'
                          : 'secondary'
                      }
                      align={'center'}
                    />
                  </td>
                  <td className="w-1/3">
                    <Typography
                      text={formatCurrentValue(currentMonthBalance)}
                      type="body"
                      color={
                        currentMonthBalance === 0
                          ? 'primary'
                          : currentMonthBalance > 0
                          ? 'successMain'
                          : 'secondary'
                      }
                      align={'center'}
                    />
                  </td>
                </tr>
              </tbody>
            </table>

            {hasLastTwoMonthsStatements &&
              lastMonthBalance < 0 &&
              previousMonthBalance < 0 && (
                <Alert
                  type="warning"
                  className="mt-4"
                  message="Over the past two months, you have made less money than you have earned. This means your business is running at a loss."
                  button={
                    <Button
                      text={`Learn more`}
                      type={'filled'}
                      color={'quatenary'}
                      textColor={'white'}
                      onClick={() => setIsLearnMore(true)}
                    />
                  }
                  customIcon={
                    <div className="rounded-full">
                      {renderIcon(
                        'ExclamationCircleIcon',
                        'text-alertMain w-5 h-5'
                      )}
                    </div>
                  }
                />
              )}

            {hasLastTwoMonthsStatements &&
              lastMonthBalance > 0 &&
              previousMonthBalance > 0 && (
                <Alert
                  type="success"
                  variant="outlined"
                  className="mt-4"
                  message="Great job! You have made a profit for 2 months in a row!"
                  listColor="white"
                  list={[
                    `You had R ${(
                      lastMonthBalance + previousMonthBalance
                    ).toFixed(2)} left over for 
                  ${getMonthName(lastMonthStatement.month - 1).substring(
                    0,
                    3
                  )} & 
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
              )}

            {totalDownloadedStatements > 0 && (
              <Alert
                type="success"
                variant="outlined"
                className="mt-4"
                message={`Well done! You have downloaded ${totalDownloadedStatements} statements this year. Keep going!`}
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
            )}

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
