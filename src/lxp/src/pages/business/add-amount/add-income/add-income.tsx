import {
  ActionListDataItem,
  BannerWrapper,
  Divider,
  StackedList,
  Typography,
  Alert,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useAppDispatch } from '@store';
import * as styles from './add-income.styles';
import ROUTES from '@routes/routes';
import AddPreschoolFees from './components/preschool-fees/add-preschool-fees';
import DonationsOrVouchers from './components/donations-or-vouchers/donations-or-vouchers';
import OtherIncome from './components/other-income/other-income';
import StatementsWrapper from '../../money/submit-income-statements/components/walkthrough-statements-wrapper/StatementsWrapper';
import { useAppContext } from '@/walkthrougContext';
import { statementsActions } from '@/store/statements';
import { IncomeItemDto } from '@ecdlink/core';
import DbeSubsidy from './components/dbe-subsidy/dbe-subsidy';
import { BusinessTabItems } from '../../business.types';

export const AddIncome: React.FC = () => {
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  // useEffect(() => {
  //   if (!isOnline) {
  //     appDispatch(
  //       analyticsActions.createViewTracking({
  //         pageView: window.location.pathname,
  //         title: 'Practitioner About',
  //       })
  //     );
  //   }
  // }, [appDispatch, isOnline]);

  const [type, setType] = useState('');

  const onSubmit = useCallback((incomeItem: IncomeItemDto) => {
    appDispatch(
      statementsActions.addOrUpdateIncomeItems({ incomeItems: [incomeItem] })
    );
    history.push(ROUTES.BUSINESS, {
      activeTabIndex: BusinessTabItems.MONEY,
    });
  }, []);

  const incomeType = (type?: string) => {
    switch (type) {
      case 'PreschoolFees':
        return <AddPreschoolFees onBack={() => setType('')} />;
      case 'DsdSubsidy':
        return <DbeSubsidy onBack={() => setType('')} onSubmit={onSubmit} />;
      case 'DonationsOrvouchers':
        return (
          <DonationsOrVouchers onBack={() => setType('')} onSubmit={onSubmit} />
        );
      case 'OtherIncome':
        return <OtherIncome onBack={() => setType('')} onSubmit={onSubmit} />;
      default:
        break;
    }
  };

  const statementsListItems: ActionListDataItem[] = [
    {
      title: 'Preschool fees',
      titleStyle: 'text-textDark font-semibold',
      subTitle: 'Caregiver contributions',
      subTitleStyle: 'text-textMid',
      actionName: 'Add',
      actionIcon: 'PlusIcon',
      buttonType: 'filled',
      buttonColor: 'quatenary',
      textColor: 'white',
      onActionClick: () => {
        return state?.stepIndex === 4 ? null : setType('PreschoolFees');
      },
    },
    {
      title: 'Donations or vouchers',
      titleStyle: 'text-textDark font-semibold',
      subTitle: 'Fundraising contributions',
      subTitleStyle: 'text-textMid',
      actionName: 'Add',
      actionIcon: 'PlusIcon',
      buttonType: 'filled',
      buttonColor: 'quatenary',
      textColor: 'white',
      onActionClick: () => {
        nextStep();
        setType('DonationsOrvouchers');
      },
    },
    {
      title: 'DBE subsidy',
      titleStyle: 'text-textDark font-semibold',
      subTitle: 'Department of Basic Education',
      subTitleStyle: 'text-textMid',
      actionName: 'Add',
      actionIcon: 'PlusIcon',
      buttonType: 'filled',
      buttonColor: 'quatenary',
      textColor: 'white',
      onActionClick: () =>
        state?.stepIndex === 4 ? null : setType('DsdSubsidy'),
    },
    {
      title: 'Other',
      titleStyle: 'text-textDark font-semibold',
      subTitle: 'Add your own income type',
      subTitleStyle: 'text-textMid',
      actionName: 'Add',
      actionIcon: 'PlusIcon',
      buttonType: 'filled',
      buttonColor: 'quatenary',
      textColor: 'white',
      onActionClick: () =>
        state?.stepIndex === 4 ? null : setType('OtherIncome'),
    },
  ];

  const { setState, state } = useAppContext();

  const nextStep = () => {
    setState({ stepIndex: 5 });
  };

  return (
    <div className={styles.container}>
      {type ? (
        <>{incomeType(type)}</>
      ) : (
        <BannerWrapper
          showBackground={false}
          title={'Add income (money in)'}
          color={'primary'}
          size="medium"
          renderBorder={true}
          onBack={() => history.push(ROUTES.BUSINESS_ADD_AMOUNT)}
          displayOffline={!isOnline}
          className="p-4"
        >
          <StatementsWrapper />
          <>
            <div>
              <Typography
                type="h2"
                color={'textDark'}
                text={'Add your income'}
              />
              <Typography
                type="h3"
                className={'mt-6'}
                color={'textDark'}
                text={'What type of money came in?'}
              />
            </div>
            <Divider dividerType="dashed" className="mt-4" />
            <div
              id="incomeList"
              className={`${
                state?.stepIndex === 3 && state?.run === true
                  ? 'pointer-events-none'
                  : ''
              }`}
            >
              <StackedList
                className={'h-auto'}
                listItems={statementsListItems}
                type={'ActionList'}
              ></StackedList>
            </div>
            <Alert
              type={'info'}
              title={
                "If you don't see the income type you want to add above, use the “Other” type to add your own."
              }
              list={['For example: business grants.']}
              className="mt-4 mb-4"
            />
          </>
        </BannerWrapper>
      )}
    </div>
  );
};
