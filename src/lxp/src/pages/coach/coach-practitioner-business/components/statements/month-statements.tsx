import ROUTES from '@/routes/routes';
import { Typography, BannerWrapper } from '@ecdlink/ui';
import React from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { MonthStatementsDetailsState } from '@/pages/business/money/monthly-statements/month-statements';
import { MonthStatementsDetails } from '@/pages/business/components/month-statements-details';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';

export const PractitionerMonthStatements: React.FC = () => {
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<MonthStatementsDetailsState>();
  const statementId = location.state.statementId;

  const { userId } = useParams<PractitionerBusinessParams>();
  const statement = useSelector(
    practitionerForCoachSelectors.getUserStatementById(userId, statementId)
  );

  const onBack = () => {
    history.push(
      ROUTES.COACH.PRACTITIONER_BUSINESS.LIST_STATEMENTS.replace(
        ':userId',
        userId
      )
    );
  };

  return (
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={`View ${getMonthName(Number(statement?.month) - 1)} statement`}
        color={'primary'}
        onBack={onBack}
        displayOffline={!isOnline}
      >
        {!!statement ? (
          <MonthStatementsDetails statement={statement} />
        ) : (
          <Typography
            type="h1"
            weight="bold"
            color="textDark"
            text={'Statement not found'}
          />
        )}
      </BannerWrapper>
    </>
  );
};
