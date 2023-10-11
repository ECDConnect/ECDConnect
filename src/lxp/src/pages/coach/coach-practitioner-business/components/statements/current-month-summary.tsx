import ROUTES from '@/routes/routes';
import { BannerWrapper } from '@ecdlink/ui';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { MonthStatementsDetails } from '@/pages/business/components/month-statements-details';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { IncomeStatementDates } from '@/constants/Dates';
import { getPreviousMonth } from '@ecdlink/core';

export const PractitionerCurrentMonthSummary: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const { userId } = useParams<PractitionerBusinessParams>();

  const incomeItems = useSelector(
    practitionerForCoachSelectors.getUnsubmittedIncomeForUser(userId)
  );
  const expenseItems = useSelector(
    practitionerForCoachSelectors.getUnsubmittedExpensesForUser(userId)
  );

  const onBack = () => {
    history.push(
      ROUTES.COACH.PRACTITIONER_BUSINESS.LIST_STATEMENTS.replace(
        ':userId',
        userId
      )
    );
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
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={`View ${getMonthName(Number(summaryDate.getMonth()))} statement`}
        color={'primary'}
        onBack={onBack}
        displayOffline={!isOnline}
      >
        <MonthStatementsDetails
          incomeItems={incomeItems}
          expenseItems={expenseItems}
          month={summaryDate.getMonth()}
          year={summaryDate.getFullYear()}
        />
      </BannerWrapper>
    </>
  );
};
