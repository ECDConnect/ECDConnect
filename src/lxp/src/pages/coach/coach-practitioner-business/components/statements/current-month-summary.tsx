import ROUTES from '@/routes/routes';
import { BannerWrapper } from '@ecdlink/ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { MonthStatementsDetails } from '@/pages/business/components/month-statements-details';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { IncomeStatementDates } from '@/constants/Dates';
import { getNextMonth, getPreviousMonth } from '@ecdlink/core';

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

  const statements = useSelector(
    practitionerForCoachSelectors.getStatementsForUser(userId)
  );
  const isThisMonthSubmitted = useMemo(
    () => !!statements?.find((x) => x.month === new Date().getMonth() + 1),
    [statements]
  );
  const isPreviousMonthSubmitted = useMemo(
    () => !!statements?.find((x) => x.month === new Date().getMonth()),
    [statements]
  );

  const summaryDate = isThisMonthSubmitted
    ? getNextMonth(currentDate)
    : !isPreviousMonthSubmitted &&
      currentDate.getDate() <= IncomeStatementDates.SubmitEndDay
    ? getPreviousMonth(currentDate)
    : currentDate;

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
