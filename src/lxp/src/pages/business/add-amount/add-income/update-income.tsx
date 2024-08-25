import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAppDispatch } from '@store';
import * as styles from './add-income.styles';
import DonationsOrVouchers from './components/donations-or-vouchers/donations-or-vouchers';
import OtherIncome from './components/other-income/other-income';
import { statementsActions } from '@/store/statements';
import { IncomeItemDto, IncomeTypeIds } from '@ecdlink/core';
import DbeSubsidy from './components/dbe-subsidy/dbe-subsidy';
import EditPreschoolFees from './components/preschool-fees/edit-preschool-fees';
import ROUTES from '@/routes/routes';
import { BusinessTabItems } from '../../business.types';

export type UpdateIncomeState = {
  statementId: string;
  incomeItem: IncomeItemDto;
};

export const UpdateIncome: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();

  const location = useLocation<UpdateIncomeState>();
  const statementId = location.state.statementId;
  const incomeItem = location.state.incomeItem;

  const onSubmit = useCallback((updatedItem: IncomeItemDto) => {
    appDispatch(
      statementsActions.addOrUpdateIncomeItems({
        statementId,
        incomeItems: [updatedItem],
      })
    );
    history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.MONEY,
    });
  }, []);

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
      {incomeItem.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID && (
        <EditPreschoolFees
          onBack={() => history.goBack()}
          incomeItem={incomeItem}
        />
      )}
    </div>
  );
};
