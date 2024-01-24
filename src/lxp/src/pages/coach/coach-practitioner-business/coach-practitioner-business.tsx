import ROUTES from '@/routes/routes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  BannerWrapper,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { PractitionerBusinessParams } from './coach-practitioner-business.types';
import { traineeSelectors } from '@/store/trainee';
import { differenceInMonths, format } from 'date-fns';
import { IncomeStatementDates } from '@/constants/Dates';
import { IncomeStatements } from './components/statements/income-statements';
import {
  practitionerForCoachSelectors,
  practitionerForCoachThunkActions,
} from '@/store/practitionerForCoach';
import { useAppDispatch } from '@/store';
import { WhatsappCall } from './components/contact/whatsapp-call';
import { ReactComponent as MoneyIcon } from '@/assets/moneyIcon.svg';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { ProfitLossDetails } from './components/statements/profit-loss-details';
import { StatementNotSubmitted } from './components/statements/not-submitted';
import { StartupSupportEnding } from './components/support/startup-support-ending';

export const CoachPractitionerBusiness = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { userId } = useParams<PractitionerBusinessParams>();
  const appDispatch = useAppDispatch();

  const practitioner = useSelector(getPractitionerByUserId(userId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const practitionerFullname = `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`;

  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);
  const statements = useSelector(
    practitionerForCoachSelectors.getStatementsForUser(userId)
  );
  const unsubmittedIncome = useSelector(
    practitionerForCoachSelectors.getUnsubmittedIncomeForUser(userId)
  );
  const unsubmittedExpenses = useSelector(
    practitionerForCoachSelectors.getUnsubmittedExpensesForUser(userId)
  );

  const currentDate = useMemo(() => new Date(), []);

  const hasStartUpSupport =
    timeline?.startUpSupportStartDate !== null &&
    timeline?.startUpSupportEndDate !== null;

  const startUpSupportEndDate = useMemo(
    () => new Date(timeline?.startUpSupportEndDate),
    [timeline?.startUpSupportEndDate]
  );

  const monthDifference = differenceInMonths(
    currentDate,
    startUpSupportEndDate
  );

  const isStartUpSupportEnding =
    hasStartUpSupport && monthDifference >= -3 && monthDifference <= 0;

  const isSubmitWindowOpen =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay ||
    currentDate.getDate() <= IncomeStatementDates.SubmitEndDay;

  const [isLoading, setIsLoading] = useState(false);
  const [hasIncomeStatements, setHasIncomeStatements] = useState(false);
  const [currentSubmitMonth, setCurrentSubmitMonth] = useState('');
  const [lossProfitMonths, setLossProfitMonths] = useState('');
  const [isThisMonthSubmitted, setIsThisMonthSubmitted] =
    useState<boolean>(false);

  const [showProfitDialog, setShowProfitDialog] = useState(false);
  const [showNotSubmittedDialog, setShowNotSubmittedDialog] = useState(false);
  const [showStartupSupportDialog, setShowStartupSupportDialog] =
    useState(false);

  var lastStatementsBalance = useMemo(
    () =>
      statements[statements.length - 1]?.balance +
      statements[statements.length - 2]?.balance,
    [statements]
  );

  var lastStatementContactByCoach = useMemo(
    () =>
      statements.length === 0
        ? false
        : statements[statements.length - 1]?.contactedByCoach,
    [statements]
  );

  const renderData = useMemo(() => {
    const listItems = [];

    if (isThisMonthSubmitted && isSubmitWindowOpen) {
      listItems.push({
        title: 'Income Statement not submitted',
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: currentSubmitMonth,
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        menuIcon: 'ExclamationIcon',
        menuIconClassName: 'text-white',
        showIcon: true,
        onActionClick: () => setShowNotSubmittedDialog(true),
        iconBackgroundColor: 'alertMain',
        chipConfig: {
          colorPalette: {
            backgroundColour: 'white',
            borderColour: 'alertMain',
            textColour: 'white',
          },
        },
        text: '1',
        classNames: 'bg-uiBg',
      });
    }

    if (isStartUpSupportEnding) {
      listItems.push({
        title: 'Start-up support ending soon',
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: format(startUpSupportEndDate, 'LLL yyyy'),
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        menuIcon: 'ExclamationIcon',
        menuIconClassName: 'text-white',
        showIcon: true,
        onActionClick: () => setShowStartupSupportDialog(true),
        iconBackgroundColor: 'alertMain',
        chipConfig: {
          colorPalette: {
            backgroundColour: 'white',
            borderColour: 'alertMain',
            textColour: 'white',
          },
        },
        text: '1',
        classNames: 'bg-uiBg',
      });
    }
    if (
      statements.length >= 2 &&
      lastStatementsBalance !== 0 &&
      !lastStatementContactByCoach
    ) {
      listItems.push({
        title:
          lastStatementsBalance > 0
            ? `${practitionerFirstName} made a profit for 2 months in a row!`
            : `Programme running at a loss`,
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: lossProfitMonths,
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        menuIcon:
          lastStatementsBalance > 0 ? 'SparklesIcon' : 'ExclamationIcon',
        menuIconClassName: 'text-white',
        showIcon: true,
        onActionClick: () => setShowProfitDialog(true),
        iconBackgroundColor:
          lastStatementsBalance > 0 ? 'successMain' : 'alertMain',
        chipConfig: {
          colorPalette: {
            backgroundColour: 'white',
            borderColour:
              lastStatementsBalance > 0 ? 'successMain' : 'alertMain',
            textColour: 'white',
          },
        },
        text: '1',
        classNames: 'bg-uiBg',
      });
    }

    return (
      <StackedList
        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
        type="MenuList"
        listItems={listItems}
      />
    );
  }, [
    currentSubmitMonth,
    isStartUpSupportEnding,
    isSubmitWindowOpen,
    isThisMonthSubmitted,
    lastStatementsBalance,
    lossProfitMonths,
    practitionerFirstName,
    startUpSupportEndDate,
    statements.length,
  ]);

  const updateStatements = useCallback(async () => {
    setIsLoading(true);
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    await appDispatch(
      practitionerForCoachThunkActions.getUserStatementsForCoach({
        userId: userId,
        startDate: startDate,
        endDate: undefined,
      })
    );
    await appDispatch(
      practitionerForCoachThunkActions.getUserExpensesForCoach({
        userId: userId,
      })
    );
    await appDispatch(
      practitionerForCoachThunkActions.getUserIncomeForCoach({
        userId: userId,
      })
    );
    setIsLoading(false);
  }, [setIsLoading, appDispatch, userId]);

  useEffect(() => {
    updateStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      unsubmittedIncome.length > 0 ||
      unsubmittedExpenses.length > 0 ||
      statements.length > 0
    ) {
      setHasIncomeStatements(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statements, unsubmittedIncome, unsubmittedExpenses]);

  useEffect(() => {
    // Outside submit
    if (!isSubmitWindowOpen) {
      setIsThisMonthSubmitted(
        !!statements?.find((x) => x.month === currentDate.getMonth() + 1)
      );
      setCurrentSubmitMonth(
        `${getMonthName(currentDate.getMonth()).substring(
          0,
          3
        )} ${currentDate.getFullYear()}`
      );
    } else {
      // In window and current month
      if (currentDate.getDate() >= IncomeStatementDates.SubmitStartDay) {
        setIsThisMonthSubmitted(
          !!statements?.find((x) => x.month === currentDate.getMonth() + 1)
        );
        setCurrentSubmitMonth(
          `${getMonthName(currentDate.getMonth()).substring(
            0,
            3
          )} ${currentDate.getFullYear()}`
        );
      } else {
        // In window but next month
        setIsThisMonthSubmitted(
          !!statements?.find((x) => x.month === currentDate.getMonth())
        );
        setCurrentSubmitMonth(
          `${getMonthName(currentDate.getMonth() - 1).substring(
            0,
            3
          )} ${currentDate.getFullYear()}`
        );
      }
    }
  }, [currentDate, isSubmitWindowOpen, statements]);

  useEffect(() => {
    const secondLastStatementMonth = !!statements[statements.length - 2]
      ? `${getMonthName(statements[statements.length - 2].month! - 1).substring(
          0,
          3
        )} ${statements[statements.length - 2].year}`
      : `-`;
    const previousStatementMonth = !!statements[statements.length - 1]
      ? `${getMonthName(statements[statements.length - 1].month! - 1).substring(
          0,
          3
        )} ${statements[statements.length - 1].year}`
      : `-`;

    setLossProfitMonths(
      secondLastStatementMonth + ' to ' + previousStatementMonth
    );
  }, [statements, setLossProfitMonths, setCurrentSubmitMonth]);

  const isLastMonthSubmitted = useMemo(() => {
    var currentMonth = new Date().getMonth();

    if (currentMonth === 0) {
      return !!statements?.find(
        (x) => x.month === 12 && x.year === new Date().getFullYear() - 1
      );
    }

    return !!statements?.find((x) => x.month === currentMonth);
  }, [statements]);

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="SmartStarter business"
        subTitle={`${practitionerFullname}`}
        onBack={() =>
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId: userId,
          })
        }
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">{renderData}</div>
        </div>

        {isLoading ? (
          <LoadingSpinner
            size="big"
            spinnerColor="white"
            backgroundColor="secondary"
            className="mb-7"
          />
        ) : hasIncomeStatements ? (
          <IncomeStatements
            statements={statements}
            unsubmittedIncome={unsubmittedIncome}
            unsubmittedExpenses={unsubmittedExpenses}
            isSubmitWindowOpen={isSubmitWindowOpen}
            isThisMonthSubmitted={isThisMonthSubmitted}
            isLastMonthSubmitted={isLastMonthSubmitted}
          />
        ) : (
          <div className="h-full px-4 py-2 pt-7">
            <div className="mt-2 flex flex-wrap justify-center p-8">
              <div className="">
                <MoneyIcon />
              </div>
            </div>
            <div>
              <Typography
                className="mt-4 text-center"
                color="textDark"
                text={`${practitionerFirstName} has not added any income or expenses yet!`}
                type={'h3'}
              />
            </div>
            <div>
              <Typography
                className="mt-2 text-center"
                color="textMid"
                text={`You can contact ${practitionerFirstName} to see if they need support.`}
                type={'body'}
              />
            </div>
            <WhatsappCall />
          </div>
        )}
      </BannerWrapper>
      <Dialog
        stretch={true}
        visible={showProfitDialog}
        position={DialogPosition.Full}
      >
        <ProfitLossDetails
          onBack={() => setShowProfitDialog(false)}
          statements={statements}
          practitionerFirstName={practitionerFirstName || ''}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showNotSubmittedDialog}
        position={DialogPosition.Full}
      >
        <StatementNotSubmitted
          onBack={() => setShowNotSubmittedDialog(false)}
          month={currentSubmitMonth}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showStartupSupportDialog}
        position={DialogPosition.Full}
      >
        <StartupSupportEnding
          onBack={() => setShowStartupSupportDialog(false)}
        />
      </Dialog>
    </>
  );
};
