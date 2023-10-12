import ROUTES from '@/routes/routes';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { PreviousStatementsList } from '../../components/previous-statements-list';

export const PreviousStatements: React.FC = () => {
  const history = useHistory();

  const statements = useSelector(statementsSelectors.getIncomeStatements);
  const unsubmittedIncome = useSelector(
    statementsSelectors.getUnsubmittedIncomeItems
  );
  const unsubmittedExpenses = useSelector(
    statementsSelectors.getUnsubmittedExpenseItems
  );

  return (
    <PreviousStatementsList
      statements={statements}
      unsubmittedIncome={unsubmittedIncome}
      unsubmittedExpenses={unsubmittedExpenses}
      onBack={() => history.push(ROUTES.BUSINESS)}
      onActionClick={(statementId: string | undefined) =>
        !!statementId
          ? history.push(ROUTES.BUSINESS_MONTH_STATEMENTS_DETAILS, {
              statementId: statementId,
            })
          : history.push(ROUTES.BUSINESS_CURRENT_MONTH_STATEMENTS_DETAILS)
      }
    />
  );
};
