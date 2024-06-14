import ROUTES from '@/routes/routes';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  statementsSelectors,
  statementsThunkActions,
} from '@/store/statements';
import { PreviousStatementsList } from '../../components/previous-statements-list';
import { BusinessTabItems } from '../../business.types';
import { useAppDispatch } from '@/store';

export const PreviousStatements: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const statements = useSelector(statementsSelectors.getIncomeStatements);

  const fetchStatementsForYear = useCallback((year: number) => {
    appDispatch(
      statementsThunkActions.getIncomeStatements({
        startDate: new Date(year, 0, 1, 12, 0, 0),
        endDate: new Date(year, 11, 31, 12, 0, 0),
      })
    ).unwrap();
  }, []);

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
      fetchStatementsForYear={fetchStatementsForYear}
    />
  );
};
