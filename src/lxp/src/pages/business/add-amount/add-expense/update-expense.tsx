import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@store';
import * as styles from './add-expense.styles';
import Rent from './components/rent/rent';
import Utilities from './components/utilities/utilities';
import SalaryAndWages from './components/salary-and-wages/salaray-and-wages';
import Food from './components/food/food';
import LearningMaterials from './components/learning-materials/learning-materials';
import AnnualMaintenance from './components/annual-maintenance/annual-maintenance';
import OtherExpense from './components/other-expense/other';
import { statementsActions } from '@/store/statements';
import { ExpenseItemDto, ExpenseTypeIds } from '@ecdlink/core';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '../../business.types';

export type UpdateExpenseState = {
  statementId: string;
  expenseItem: ExpenseItemDto;
};

export const UpdateExpense: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const location = useLocation<UpdateExpenseState>();
  const statementId = location.state.statementId;
  const expenseItem = location.state.expenseItem;

  const onSubmit = useCallback(
    (updatedExpenseItem: ExpenseItemDto) => {
      appDispatch(
        statementsActions.updateExpenseItem({
          statementId,
          expenseItem: updatedExpenseItem,
        })
      );
      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.MONEY,
      });
    },
    [statementId]
  );

  return (
    <div className={styles.container}>
      {expenseItem.expenseTypeId === ExpenseTypeIds.RENT_EXPENSE_ID && (
        <Rent
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
      {expenseItem.expenseTypeId === ExpenseTypeIds.UTILITIES_EXPENSE_ID && (
        <Utilities
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
      {expenseItem.expenseTypeId === ExpenseTypeIds.SALARY_EXPENSE_ID && (
        <SalaryAndWages
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
      {expenseItem.expenseTypeId === ExpenseTypeIds.FOOD_EXPENSE_ID && (
        <Food
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
      {expenseItem.expenseTypeId === ExpenseTypeIds.LEARNING_MATERIALS_ID && (
        <LearningMaterials
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
      {expenseItem.expenseTypeId === ExpenseTypeIds.MAINTENANCE_ID && (
        <AnnualMaintenance
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
      {expenseItem.expenseTypeId === ExpenseTypeIds.OTHER_EXPENSE_ID && (
        <OtherExpense
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          expenseItem={expenseItem}
        />
      )}
    </div>
  );
};
