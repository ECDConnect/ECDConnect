import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@store';
import * as styles from './add-income.styles';
import DonationsOrVouchers from './components/donations-or-vouchers/donations-or-vouchers';
import OtherIncome from './components/other-income/other-income';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { statementsActions } from '@/store/statements';
import { IncomeItemDto, IncomeTypeIds } from '@ecdlink/core';
import DbeSubsidy from './components/dbe-subsidy/dbe-subsidy';

export type UpdateIncomeState = {
  statementId: string;
  incomeItem: IncomeItemDto;
};

export const UpdateIncome: React.FC = () => {
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();

  const location = useLocation<UpdateIncomeState>();
  const statementId = location.state.statementId;
  const incomeItem = location.state.incomeItem;

  const onSubmit = useCallback(
    (updatedItem: IncomeItemDto) => {
      appDispatch(
        statementsActions.updateIncomeItem({
          statementId,
          incomeItem: updatedItem,
        })
      );
    },
    [userAuth]
  );

  return (
    <div className={styles.container}>
      {incomeItem.incomeTypeId === IncomeTypeIds.DBE_SUBSIDY_ID && (
        <DbeSubsidy
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          incomeItem={incomeItem}
        />
      )}
      {incomeItem.incomeTypeId === IncomeTypeIds.DONATION_ID && (
        <DonationsOrVouchers
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          incomeItem={incomeItem}
        />
      )}
      {incomeItem.incomeTypeId === IncomeTypeIds.OTHER_INCOME_ID && (
        <OtherIncome
          onBack={() => history.goBack()}
          onSubmit={onSubmit}
          incomeItem={incomeItem}
        />
      )}
      {/* Preschool fees have a combined edit component */}
    </div>
  );
};
