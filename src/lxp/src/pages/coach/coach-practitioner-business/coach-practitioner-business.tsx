import ROUTES from '@/routes/routes';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { BannerWrapper, StackedList } from '@ecdlink/ui';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { PractitionerBusinessParams } from './coach-practitioner-business.types';
import { MoneySummary } from './components/statements/money-summary';
import { traineeSelectors } from '@/store/trainee';
import { differenceInMonths, format } from 'date-fns';
import { IncomeStatementDates } from '@/constants/Dates';

export const CoachPractitionerBusiness = () => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const { practitionerId } = useParams<PractitionerBusinessParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const practitionerFirstName = practitioner?.user?.firstName;
  const practitionerFullname = practitioner?.user?.fullName;
  const timeline = useSelector(traineeSelectors.getTraineeOnboardTimeline);

  const currentDate = new Date();
  const hasStartUpSupport =
    timeline?.startUpSupportStartDate !== null &&
    timeline?.startUpSupportEndDate !== null;
  const startUpSupportEndDate = new Date(timeline?.startUpSupportEndDate);
  const monthDifference = differenceInMonths(
    currentDate,
    startUpSupportEndDate
  );

  const isSubmitWindowOpen =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay ||
    currentDate.getDate() <= IncomeStatementDates.SubmitEndDay;

  const isStartUpSupportEnding =
    hasStartUpSupport && monthDifference >= -3 && monthDifference <= 0;
  const [hasIncomeStatements, setHasIncomeStatements] = useState(false);
  const [incomeStatementMonth, setIncomeStatementMonth] = useState('');
  const [lossProfitMonths, setLossProfitMonths] = useState('');

  const [isLoss, setIsLoss] = useState(false);
  const [isProfit, setIsProfit] = useState(false);
  const [isIncomeStatementSubmitted, setIsIncomeStatementSubmitted] =
    useState(false);

  const listItems = [];

  if (isIncomeStatementSubmitted && isSubmitWindowOpen) {
    listItems.push({
      title: 'Income Statement not submitted',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: incomeStatementMonth,
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      onActionClick: () =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.NOT_SUBMITTED.replace(
            ':practitionerId',
            practitionerId
          ),
          { incomeStatementMonth: incomeStatementMonth }
        ),
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
      onActionClick: () =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.STARTUP_SUPPORT_ENDING.replace(
            ':practitionerId',
            practitionerId
          )
        ),
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

  if (isProfit) {
    listItems.push({
      title: `${practitionerFirstName} made a profit for 2 months in a row!`,
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: lossProfitMonths,
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'SparklesIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      onActionClick: () =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.PROFIT.replace(
            ':practitionerId',
            practitionerId
          ),
          { lossProfitMonths: lossProfitMonths }
        ),
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

  if (isLoss) {
    listItems.push({
      title: `Programme running at a loss`,
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitle: lossProfitMonths,
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      menuIcon: 'ExclamationIcon',
      menuIconClassName: 'text-white',
      showIcon: true,
      onActionClick: () =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.LOSS.replace(
            ':practitionerId',
            practitionerId
          ),
          { lossProfitMonths: lossProfitMonths }
        ),
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

  const goBack = () => {
    history.push(ROUTES.COACH.PRACTITIONER_PROFILE_INFO, { practitionerId });
  };

  return (
    <>
      <BannerWrapper
        size="small"
        renderOverflow
        displayOffline={!isOnline}
        title="SmartStarter business"
        subTitle={`${practitionerFullname}`}
        onBack={() => goBack()}
        className="p-4"
      >
        <div className="mt-4 flex justify-center">
          <div className="w-11/12">
            <StackedList
              className="-mt-0.5 flex w-full flex-col gap-1 rounded-2xl"
              type="MenuList"
              listItems={listItems}
            />
          </div>
        </div>

        <MoneySummary
          hasIncomeStatements={hasIncomeStatements}
          setHasIncomeStatements={setHasIncomeStatements}
          setIncomeStatementMonth={setIncomeStatementMonth}
          setIsLoss={setIsLoss}
          setIsProfit={setIsProfit}
          setLossProfitMonths={setLossProfitMonths}
          setIsIncomeStatementSubmitted={setIsIncomeStatementSubmitted}
        />
      </BannerWrapper>
    </>
  );
};
