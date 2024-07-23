import {
  ActionListDataItem,
  BannerWrapper,
  Divider,
  StackedList,
  Typography,
  Alert,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import * as styles from './add-expense.styles';
import ROUTES from '@routes/routes';
import Rent from './components/rent/rent';
import Utilities from './components/utilities/utilities';
import SalaryAndWages from './components/salary-and-wages/salaray-and-wages';
import Food from './components/food/food';
import LearningMaterials from './components/learning-materials/learning-materials';
import AnnualMaintenance from './components/annual-maintenance/annual-maintenance';
import OtherExpense from './components/other-expense/other';
import { statementsActions } from '@/store/statements';
import { authSelectors } from '@/store/auth';
import { ExpenseItemDto } from '@ecdlink/core';
import { BusinessTabItems } from '../../business.types';

export const AddExpense: React.FC = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Practitioner About',
        })
      );
    }
  }, [appDispatch, isOnline]);

  const user = useSelector(userSelectors.getUser);
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [type, setType] = useState('');

  useEffect(() => {
    if (user) {
      setNewStackListItems();
    }
  }, [user]);

  const onSubmit = useCallback(
    (expenseItem: ExpenseItemDto) => {
      appDispatch(statementsActions.addExpenseItem(expenseItem));
      history.push(ROUTES.BUSINESS, {
        activeTabIndex: BusinessTabItems.MONEY,
      });
    },
    [userAuth]
  );

  const incomeType = (type?: string) => {
    switch (type) {
      case 'Rent':
        return <Rent onBack={() => setType('')} onSubmit={onSubmit} />;
      case 'Utilities':
        return <Utilities onBack={() => setType('')} onSubmit={onSubmit} />;
      case 'SalaryAndWages':
        return (
          <SalaryAndWages onBack={() => setType('')} onSubmit={onSubmit} />
        );
      case 'Food':
        return <Food onBack={() => setType('')} onSubmit={onSubmit} />;
      case 'LearningMaterials':
        return (
          <LearningMaterials onBack={() => setType('')} onSubmit={onSubmit} />
        );
      case 'AnnualMaintenance':
        return (
          <AnnualMaintenance onBack={() => setType('')} onSubmit={onSubmit} />
        );
      case 'Other':
        return <OtherExpense onBack={() => setType('')} onSubmit={onSubmit} />;
      default:
        break;
    }
  };

  const setNewStackListItems = () => {
    const list: ActionListDataItem[] = [
      {
        title: 'Rent',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Cost for using programme venue',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('Rent'),
      },
      {
        title: 'Utilities (electricity, water...',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Incl. airtime, data, insurance',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('Utilities'),
      },
      {
        title: 'Salary & wages',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'For all staff, incl. your salary',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('SalaryAndWages'),
      },
      {
        title: 'Food',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Programme meals & snacks',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('Food'),
      },
      {
        title: 'Learning materials',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Books, toys, copying, etc.',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('LearningMaterials'),
      },
      {
        title: 'Annual maintenance & pu...',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Paint for building, new gate, etc.',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('AnnualMaintenance'),
      },
      {
        title: 'Other',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Add your own expense type',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        buttonColor: 'quatenary',
        textColor: 'white',
        onActionClick: () => setType('Other'),
      },
    ];

    setListItems(list);
  };

  return (
    <div className={styles.container}>
      {type ? (
        <div>{incomeType(type)}</div>
      ) : (
        <BannerWrapper
          showBackground={false}
          title={'Add expense (money out)'}
          color={'primary'}
          size="medium"
          renderBorder={true}
          onBack={() => history.push(ROUTES.BUSINESS_ADD_AMOUNT)}
          displayOffline={!isOnline}
          className="p-4"
        >
          <div>
            <Typography type="h3" color={'textDark'} text={'Add an expense'} />
            <Typography
              type="body"
              color={'textMid'}
              text={'What did you pay for?'}
            />
          </div>
          <Divider dividerType="dashed" className="mt-4" />
          <div>
            <StackedList
              className={'h-auto'}
              listItems={listItems}
              type={'ActionList'}
            ></StackedList>
          </div>
          <Alert
            type={'info'}
            title={
              "If you don't see the expense type you want to add above, use the “Other” type to add your own."
            }
            list={[
              'For example: cost of training for staff, transport, or other items.',
            ]}
            className="mt-6"
          />
        </BannerWrapper>
      )}
    </div>
  );
};
