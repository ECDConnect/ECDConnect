import ROUTES from '@/routes/routes';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { MonthStatementsDetails } from '../../components/month-statements-details';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { BannerWrapper } from '@ecdlink/ui';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { IncomeStatementDates } from '@/constants/Dates';
import { getPreviousMonth } from '@ecdlink/core';

export const CurrentMonthSummary: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();

  const income = useSelector(statementsSelectors.getUnsubmittedIncomeItems);
  const expenses = useSelector(statementsSelectors.getUnsubmittedExpenseItems);

  const onBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  const currentDate = new Date();
  const isSubmitWindowOpen =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay ||
    currentDate.getDate() <= IncomeStatementDates.SubmitEndDay;

  const summaryDate =
    !isSubmitWindowOpen ||
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay
      ? currentDate
      : getPreviousMonth(currentDate);

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
