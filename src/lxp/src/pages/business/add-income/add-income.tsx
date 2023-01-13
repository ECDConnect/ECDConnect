import { UserDto } from '@ecdlink/core';
import {
  ActionListDataItem,
  BannerWrapper,
  Divider,
  StackedList,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import {
  initialPractitionerAboutValues,
  PractitionerAboutModel,
  practitionerAboutModelSchema,
} from '@schemas/practitioner/practitioner-about';
import { useAppDispatch } from '@store';
import { userSelectors } from '@store/user';
import { analyticsActions } from '@store/analytics';
import * as styles from './add-income.styles';
import ROUTES from '@routes/routes';
import PreschoolFees from './components/preschool-fees/preschool-fees';
import StartupSupport from './components/startup-support/startup-support';
import DonationsOrVouchers from './components/donations-or-vouchers/donations-or-vouchers';
import DsdSubsidy from './components/dsd-subsidy/dsd-subsidy';
import OtherIncome from './components/other-income/other-income';

export const AddIncome: React.FC = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  const user = useSelector(userSelectors.getUser);
  const [listItems, setListItems] = useState<ActionListDataItem[]>([]);
  const [type, setType] = useState('');

  useEffect(() => {
    if (user) {
      setNewStackListItems(user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getDefaultFormvalues = () => {
    if (user) {
      const tempPractitioner: PractitionerAboutModel = {
        name: user.firstName || '',
        surname: user.surname || '',
        cellphone: user.phoneNumber || '',
        email: user?.email! || '',
      };
      return tempPractitioner;
    } else {
      return initialPractitionerAboutValues;
    }
  };

  const {
    register: practitionerAboutRegister,
    formState: practitionerAboutFormState,
    getValues: practitionerAboutFormGetValues,
  } = useForm({
    resolver: yupResolver(practitionerAboutModelSchema),
    defaultValues: getDefaultFormvalues(),
    mode: 'onChange',
  });

  const incomeType = (type?: string) => {
    switch (type) {
      case 'PreschoolFees':
        return <PreschoolFees setType={setType} />;
      case 'StartupSupport':
        return <StartupSupport setType={setType} />;
      case 'DonationsOrvouchers':
        return <DonationsOrVouchers setType={setType} />;
      case 'DsdSubsidy':
        return <DsdSubsidy setType={setType} />;
      case 'OtherIncome':
        return <OtherIncome setType={setType} />;
      default:
        break;
    }
  };

  const setNewStackListItems = (currentUser: UserDto) => {
    const list: ActionListDataItem[] = [
      {
        title: 'Preschool fees',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Caregiver contributions',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => setType('PreschoolFees'),
      },
      {
        title: 'Start-up support',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'R 1,000, Community Works Pr...',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => setType('StartupSupport'),
      },
      {
        title: 'Donations or vouchers',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Fundraising contributions',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => setType('DonationsOrvouchers'),
      },
      {
        title: 'DBE subsidy',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Department of Basic Education',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => setType('DsdSubsidy'),
      },
      {
        title: 'Other',
        titleStyle: 'text-textDark font-semibold',
        subTitle: 'Add your own income type',
        subTitleStyle: 'text-textMid',
        actionName: 'Add',
        actionIcon: 'PlusIcon',
        buttonType: 'filled',
        onActionClick: () => setType('OtherIncome'),
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
          title={'Add income (money in)'}
          color={'primary'}
          size="medium"
          renderBorder={true}
          renderOverflow={false}
          onBack={() => history.push(ROUTES.BUSINESS_ADD_AMOUNT)}
          displayOffline={!isOnline}
          className="p-4"
        >
          <div>
            <Typography type="h3" color={'textDark'} text={'Add your income'} />
            <Typography
              type="body"
              color={'textMid'}
              text={'What type of money came in'}
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
        </BannerWrapper>
      )}
    </div>
  );
};
