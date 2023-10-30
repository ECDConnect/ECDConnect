import ROUTES from '@/routes/routes';
import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { MonthStatementsDetails } from '../../components/month-statements-details';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper } from '@ecdlink/ui';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { IncomeStatementDates } from '@/constants/Dates';
import { getNextMonth, getPreviousMonth } from '@ecdlink/core';

export const CurrentMonthSummary: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const income = useSelector(statementsSelectors.getUnsubmittedIncomeItems);
  const expenses = useSelector(statementsSelectors.getUnsubmittedExpenseItems);
  const statements = useSelector(statementsSelectors.getIncomeStatements);

  const onBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  const currentDate = new Date();

  const isThisMonthSubmitted = useMemo(
    () => !!statements?.find((x) => x.month === new Date().getMonth() + 1),
    [statements]
  );
  const isPreviousMonthSubmitted = useMemo(
    () => !!statements?.find((x) => x.month === new Date().getMonth()),
    [statements]
  );

  // submit window open And last statement not submitted -> previous month
  // submitted this month -> next month
  // otherwise current month
  const summaryDate = isThisMonthSubmitted
    ? getNextMonth(currentDate)
    : !isPreviousMonthSubmitted &&
      currentDate.getDate() <= IncomeStatementDates.SubmitEndDay
    ? getPreviousMonth(currentDate)
    : currentDate;

  console.log('Summary Date', summaryDate);

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={`View ${getMonthName(summaryDate.getMonth())} statement`}
      color={'primary'}
      onBack={onBack}
      displayOffline={!isOnline}
    >
      <MonthStatementsDetails
        incomeItems={income}
        expenseItems={expenses}
        month={summaryDate.getMonth()}
        year={summaryDate.getFullYear()}
      />
    </BannerWrapper>
  );
};
