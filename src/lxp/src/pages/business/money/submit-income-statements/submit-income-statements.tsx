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
import { format, sub } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getMonthName } from '@utils/classroom/attendance/track-attendance-utils';
import StatementsWrapper from './components/walkthrough-statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import PositiveBonusEmoticon from '../../../../assets/positive-bonus-emoticon.png';
import {
  IncomeStatementDto,
  LocalStorageKeys,
  MoreInformationTypeEnum,
  getPreviousMonth,
} from '@ecdlink/core';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import { InfoPage } from './components/info-page';
import { getStorageItem } from '@/utils/common/local-storage.utils';
import { StatementsWalkthroughStart } from './components/walkthrough-statements-wrapper/walkthrough-start';
import { practitionerSelectors } from '@/store/practitioner';
import { useAppDispatch } from '@/store';

export const SubmitIncomeStatements: React.FC = () => {
  const [showInitialWalkthrough, setShowInitialWalkthrough] = useState(false);
  const appDispatch = useAppDispatch();

  const [isLearnMore, setIsLearnMore] = useState(false);

  const history = useHistory();
  const statements = useSelector(statementsSelectors.getIncomeStatements);
  const practitioner = useSelector(practitionerSelectors.getPractitioner);

  const downloadsMessageDismissed = useSelector(
    statementsSelectors.getDownloadsMessageDismissed
  );
  const balanceMessageDismissed = useSelector(
    statementsSelectors.getBalanceMessageDismissed
  );

  const {
    setState,
    state: { stepIndex, run: isWalkthrough },
  } = useAppContext();

  const currentMonth = new Date();
  const lastMonth = getPreviousMonth(new Date());
  const previousMonth = getPreviousMonth(lastMonth);

  const currentMonthStatement = statements.find(
    (x) =>
      x.month === currentMonth.getMonth() + 1 &&
      x.year === currentMonth.getFullYear()
  );
  const lastMonthStatement = statements.find(
    (x) =>
      x.month === lastMonth.getMonth() + 1 && x.year === lastMonth.getFullYear()
  );
  const previousMonthStatement = statements.find(
    (x) =>
      x.month === previousMonth.getMonth() + 1 &&
      x.year === previousMonth.getFullYear()
  );

  const getStatementTitle = (statement: IncomeStatementDto | undefined) =>
    !!statement
      ? `${getMonthName(statement.month! - 1).substring(0, 3)} ${
          statement.year
        }`
      : `-`;

  const formatCurrentValue = (value: number, showSymbol: boolean = false) => {
    if (value === 0) return `R ${numberWithSpaces(value.toFixed(2))}`;

    if (value > 0)
      return `${showSymbol ? '+ ' : ''}R ${numberWithSpaces(value.toFixed(2))}`;

    if (value < 0)
      return `${showSymbol ? '- ' : ''}R ${numberWithSpaces(
        Math.abs(value).toFixed(2)
      )}`;
  };

  const nextStep = () => {
    setState({ stepIndex: 1 });
  };

  useEffect(() => {
    if (stepIndex === 7) {
      const el = document.getElementById('seeAllStatements');

      el?.scrollIntoView();
      return;
    }
  }, [stepIndex]);

  const lastMonthIncomeTotal = useMemo(
    () => (isWalkthrough ? 2000 : getStatementIncomeTotal(lastMonthStatement)),
    [lastMonthStatement, isWalkthrough]
  );

  const currentMonthIncomeTotal = useMemo(
    () =>
      isWalkthrough ? 1800 : getStatementIncomeTotal(currentMonthStatement),
    [currentMonthStatement, isWalkthrough]
  );

  const lastMonthExpenseTotal = useMemo(
    () =>
      isWalkthrough ? -2700 : getStatementExpenseTotal(lastMonthStatement),
    [lastMonthStatement, isWalkthrough]
  );

  const currentMonthExpenseTotal = useMemo(
    () =>
      isWalkthrough ? -700 : getStatementExpenseTotal(currentMonthStatement),
    [currentMonthStatement, isWalkthrough]
  );

  const previousMonthBalance = useMemo(
    () => (isWalkthrough ? -700 : getStatementBalance(previousMonthStatement)),
    [previousMonthStatement, isWalkthrough]
  );

  const lastMonthBalance = isWalkthrough
    ? -700
    : lastMonthIncomeTotal - lastMonthExpenseTotal;
  const currentMonthBalance = isWalkthrough
    ? 1100
    : currentMonthIncomeTotal - currentMonthExpenseTotal;

  const hasIncomeStatements =
    !!lastMonthIncomeTotal ||
    !!lastMonthExpenseTotal ||
    !!currentMonthExpenseTotal ||
    !!currentMonthIncomeTotal;

  const hasLastTwoMonthsStatements =
    (lastMonthStatement?.month || 0) - 1 === lastMonth.getMonth() &&
    lastMonthStatement?.year === lastMonth.getFullYear() &&
    (previousMonthStatement?.month || 0) - 1 === previousMonth.getMonth() &&
    previousMonthStatement?.year === previousMonth.getFullYear();

  const totalDownloadedStatements = statements.reduce(
    (total, statement) => (statement.downloaded ? total + 1 : total),
    0
  );

  const checkIfToShowInitialWalkthrough = useCallback(() => {
    if (
      !getStorageItem(LocalStorageKeys.incomeStatementsWalkthroughComplete) &&
      !practitioner?.isCompletedBusinessWalkThrough
    ) {
      setShowInitialWalkthrough(true);
    }
  }, [practitioner?.isCompletedBusinessWalkThrough]);

  useEffect(() => {
    checkIfToShowInitialWalkthrough();
  }, [checkIfToShowInitialWalkthrough]);

  return (
    <>
      <StatementsWrapper />
      <div className="pb-180 flex flex-col justify-center p-4">
        {!hasIncomeStatements && (
          <div className="mt-2 flex flex-col justify-center p-8">
            <div className="flex w-full justify-center">
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
          <>
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
                        text={
                          isWalkthrough
                            ? format(sub(new Date(), { months: 1 }), 'MMM yyyy')
                            : getStatementTitle(lastMonthStatement)
                        }
                        type="body"
                        color={'textDark'}
                      />
                    </th>
                    <th className="w-1/3">
                      <Typography
                        text={`${getMonthName(
                          currentMonth.getMonth()
                        ).substring(0, 3)} ${currentMonth.getFullYear()}`}
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
                        text={formatCurrentValue(lastMonthBalance, true)}
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
                        text={formatCurrentValue(currentMonthBalance, true)}
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

              {!balanceMessageDismissed &&
                hasLastTwoMonthsStatements &&
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
                    onDismiss={() =>
                      appDispatch(statementsActions.dismissBalanceMessage())
                    }
                  />
                )}

              {!balanceMessageDismissed &&
                hasLastTwoMonthsStatements &&
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
                    onDismiss={() =>
                      appDispatch(statementsActions.dismissBalanceMessage())
                    }
                  />
                )}

              {!downloadsMessageDismissed && totalDownloadedStatements > 0 && (
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
                  onDismiss={() =>
                    appDispatch(statementsActions.dismissDownloadsMessage())
                  }
                />
              )}
            </div>

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
          </>
        )}
        <FADButton
          title={'Add income or expense'}
          icon={'PlusIcon'}
          iconDirection={'left'}
          textToggle={true}
          type={'filled'}
          color={'quatenary'}
          shape={'round'}
          className={`absolute bottom-10 right-0 z-10 m-3 px-3.5 py-2.5 ${
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
          section={MoreInformationTypeEnum.IdeasForMakingAProfit}
          childrenPosition="bottom"
          onClose={() => setIsLearnMore(false)}
        />
      </Dialog>
      <div id="lastStep" />
      {showInitialWalkthrough && (
        <StatementsWalkthroughStart
          onClose={() => setShowInitialWalkthrough(false)}
        />
      )}
    </>
  );
};
