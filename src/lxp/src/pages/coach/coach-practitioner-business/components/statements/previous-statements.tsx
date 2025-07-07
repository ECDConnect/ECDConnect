import ROUTES from '@/routes/routes';
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PractitionerBusinessParams } from '../../coach-practitioner-business.types';
import { practitionerForCoachSelectors } from '@/store/practitionerForCoach';
import { PreviousStatementsList } from '@/pages/business/components/previous-statements-list';

export const PractitionerPreviousStatements: React.FC = () => {
  const history = useHistory();
  const { userId } = useParams<PractitionerBusinessParams>();

  const statements = useSelector(
    practitionerForCoachSelectors.getStatementsForUser(userId)
  );

  return (
    // TODO might need to add an offline display if no data for this practitioner, or if it is old
    <PreviousStatementsList
      statements={statements}
      onBack={() =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.BUSINESS.replace(':userId', userId)
        )
      }
      onActionClick={(statementId: string) =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.STATEMENT_DETAILS.replace(
            ':userId',
            userId
          ),
          { statementId: statementId }
        )
      }
      fetchStatementsForYear={(year) => {}} // TODO - trigger fetch for more statments
    />
  );
};
