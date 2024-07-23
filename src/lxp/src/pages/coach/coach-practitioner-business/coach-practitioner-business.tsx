import ROUTES from '@/routes/routes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import {
  BannerWrapper,
  Dialog,
  DialogPosition,
  LoadingSpinner,
  StackedList,
} from '@ecdlink/ui';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { PractitionerBusinessParams } from './coach-practitioner-business.types';
import { IncomeStatements } from './components/statements/income-statements';
import {
  practitionerForCoachSelectors,
  practitionerForCoachThunkActions,
} from '@/store/practitionerForCoach';
import { useAppDispatch } from '@/store';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { ProfitLossDetails } from './components/statements/profit-loss-details';
import { StatementNotSubmitted } from './components/statements/not-submitted';
import { getStatementBalance } from '@/utils/statements/statements-utils';

export const CoachPractitionerBusiness = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { userId } = useParams<PractitionerBusinessParams>();
  const appDispatch = useAppDispatch();

  const practitioner = useSelector(getPractitionerByUserId(userId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const practitionerFullname = `${practitioner?.user?.firstName} ${practitioner?.user?.surname}`;
  const statements = useSelector(
    practitionerForCoachSelectors.getStatementsForUser(userId)
  );

  const currentDate = useMemo(() => new Date(), []);

  const [isLoading, setIsLoading] = useState(false);
  const [hasIncomeStatements, setHasIncomeStatements] = useState(false);
  const [currentSubmitMonth, setCurrentSubmitMonth] = useState('');
  const [lossProfitMonths, setLossProfitMonths] = useState('');
  const [isThisMonthSubmitted, setIsThisMonthSubmitted] =
    useState<boolean>(false);

  const [showProfitDialog, setShowProfitDialog] = useState(false);
  const [showNotSubmittedDialog, setShowNotSubmittedDialog] = useState(false);

  var lastMonthStatementsBalance = useMemo(
    () => getStatementBalance(statements[statements.length - 1]),
    [statements]
  );

  var lastTwoMonthStatementsBalance = useMemo(
    () => getStatementBalance(statements[statements.length - 2]),
    [statements]
  );

  const hasProfit =
    lastMonthStatementsBalance > 0 && lastTwoMonthStatementsBalance > 0;

  const hasTwoMonthsLoss =
    lastMonthStatementsBalance < 0 && lastTwoMonthStatementsBalance < 0;

  var lastStatementContactByCoach = useMemo(
    () =>
      statements.length === 0
        ? false
        : statements[statements.length - 1]?.contactedByCoach,
    [statements]
  );

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
    setIsLoading(false);
  }, [setIsLoading, appDispatch, userId]);

  useEffect(() => {
    updateStatements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (statements.length > 0) {
      setHasIncomeStatements(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statements]);

  useEffect(() => {
    setIsThisMonthSubmitted(
      !!statements?.find((x) => x.month === currentDate.getMonth() + 1)
    );
    setCurrentSubmitMonth(
      `${getMonthName(currentDate.getMonth()).substring(
        0,
        3
      )} ${currentDate.getFullYear()}`
    );
  }, [currentDate, statements]);

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

  const renderData = useMemo(() => {
    const listItems = [];

    if (!isThisMonthSubmitted) {
      listItems.push({
        title: 'No income or expenses added',
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

    if (statements.length >= 2 && hasProfit) {
      listItems.push({
        title: `${practitionerFirstName} made a profit for 2 months in a row!`,
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: lossProfitMonths,
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        menuIcon: 'SparklesIcon',
        menuIconClassName: 'text-white',
        showIcon: true,
        onActionClick: () => setShowProfitDialog(true),
        iconBackgroundColor: 'successMain',
        chipConfig: {
          colorPalette: {
            backgroundColour: 'white',
            borderColour: 'successMain',
            textColour: 'white',
          },
        },
        text: '1',
        classNames: 'bg-uiBg',
      });
    }

    if (
      statements.length >= 2 &&
      hasTwoMonthsLoss &&
      !lastStatementContactByCoach
    ) {
      listItems.push({
        title: `Programme running at a loss`,
        titleStyle: 'text-textDark font-semibold text-base leading-snug',
        subTitle: lossProfitMonths,
        subTitleStyle:
          'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
        menuIcon: 'ExclamationIcon',
        menuIconClassName: 'text-white',
        showIcon: true,
        onActionClick: () => setShowProfitDialog(true),
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

    return (
      <StackedList
        className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
        type="MenuList"
        listItems={listItems}
      />
    );
  }, [
    currentSubmitMonth,
    isThisMonthSubmitted,
    lastStatementContactByCoach,
    lossProfitMonths,
    practitionerFirstName,
    statements.length,
  ]);

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="Finances"
        subTitle={`${practitionerFullname}`}
        onBack={() =>
          history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, {
            practitionerId: userId,
          })
        }
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
            isThisMonthSubmitted={isThisMonthSubmitted}
            isLastMonthSubmitted={isLastMonthSubmitted}
          />
        ) : (
          <div></div>
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
    </>
  );
};
