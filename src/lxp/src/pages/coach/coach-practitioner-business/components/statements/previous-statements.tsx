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
  const unsubmittedIncome = useSelector(
    practitionerForCoachSelectors.getUnsubmittedIncomeForUser(userId)
  );
  const unsubmittedExpenses = useSelector(
    practitionerForCoachSelectors.getUnsubmittedExpensesForUser(userId)
  );

  return (
    // TODO might need to add an offline display if no data for this practitioner, or if it is old
    <PreviousStatementsList
      statements={statements}
      unsubmittedIncome={unsubmittedIncome}
      unsubmittedExpenses={unsubmittedExpenses}
      onBack={() =>
        history.push(
          ROUTES.COACH.PRACTITIONER_BUSINESS.BUSINESS.replace(':userId', userId)
        )
      }
      onActionClick={(statementId: string | undefined) =>
        !!statementId
          ? history.push(
              ROUTES.COACH.PRACTITIONER_BUSINESS.STATEMENT_DETAILS.replace(
                ':userId',
                userId
              ),
              { statementId: statementId }
            )
          : history.push(
              ROUTES.COACH.PRACTITIONER_BUSINESS.CURRENT_MONTH_SUMMARY.replace(
                ':userId',
                userId
              )
            )
      }
    />
  );
};
