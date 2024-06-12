import ROUTES from '@/routes/routes';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import { PreviousStatementsList } from '../../components/previous-statements-list';
import { BusinessTabItems } from '../../business.types';

export const PreviousStatements: React.FC = () => {
  const history = useHistory();

  const statements = useSelector(statementsSelectors.getIncomeStatements);

  return (
    <PreviousStatementsList
      statements={statements}
      onBack={() =>
        history.push(ROUTES.BUSINESS, {
          activeTabIndex: BusinessTabItems.MONEY,
        })
      }
      onActionClick={(statementId: string) =>
        history.push(ROUTES.BUSINESS_MONTH_STATEMENTS_DETAILS, {
          statementId: statementId,
        })
      }
    />
  );
};
