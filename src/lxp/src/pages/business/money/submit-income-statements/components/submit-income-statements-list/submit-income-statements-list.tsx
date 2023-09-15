import ROUTES from '@/routes/routes';
import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
  DialogPosition,
  Dialog,
  ActionModal,
} from '@ecdlink/ui';
import format from 'date-fns/format';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import {
  statementsSelectors,
  statementsThunkActions,
} from '@/store/statements';
import { authSelectors } from '@/store/auth';
import {
  incomesValueFunc,
  numberWithSpaces,
} from '@/utils/statements/statements-utils';
import { useAppDispatch } from '@/store';
import {
  ExpensesStatementsDto,
  IncomeStatementsDto,
  getPreviousMonth,
  useSnackbar,
} from '@ecdlink/core';
import { IncomeStatementDates } from '@/constants/Dates';

export const SubmitIncomeStatementsList: React.FC = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  const { showMessage } = useSnackbar();

  const date = format(new Date(), 'EEEE, d LLLL');
  const { isOnline } = useOnlineStatus();
  const [confimSubmitIncomeValues, setConfimSubmitIncomeValues] =
    useState(false);

  const goBack = () => {
    history.push(ROUTES.BUSINESS);
  };
  const income = useSelector(statementsSelectors.getIncome);
  const expenses = useSelector(statementsSelectors.getExpenses);

  const preschoolIncome = useSelector(
    statementsSelectors.getPreschoolFeeIncome
  );
  const startupIncome = useSelector(
    statementsSelectors.getStartupSupportIncome
  );
  const donationIncome = useSelector(statementsSelectors.getDonationIncome);
  const dbeSubsidyIncome = useSelector(statementsSelectors.getdbeSubsidyIncome);

  const rentExpense = useSelector(statementsSelectors.getRentExpense);
  const foodExpense = useSelector(statementsSelectors.getFoodExpense);
  const learningMaterialsExpense = useSelector(
    statementsSelectors.getLearingMaterialsExpense
  );
  const maintenanceExpense = useSelector(
    statementsSelectors.getMaintenanceExpense
  );
  const otherExpense = useSelector(statementsSelectors.getOtherExpense);
  const utilitiesExpense = useSelector(statementsSelectors.getUtilitiesExpense);
  const salaryExpense = useSelector(statementsSelectors.getSalaryExpense);

  const otherIncome = useSelector(statementsSelectors.getOtheryIncome);

  const totalIncome = income?.reduce(function (prev: any, current: any) {
    return prev + +current.amount;
  }, 0);

  const totalExpenses = expenses?.reduce(function (prev: any, current: any) {
    return prev + +current.amount;
  }, 0);

  const totalBalance = (totalIncome - totalExpenses).toFixed(2);
  const appDispatch = useAppDispatch();

  const currentDate = new Date();
  const submitMonth =
    currentDate.getDate() >= IncomeStatementDates.SubmitStartDay
      ? currentDate
      : getPreviousMonth(currentDate);

  // Income values
  const [preschoolFees, setPreschoolFees] = useState<any>([]);
  const [startupSupport, setStartupSupport] = useState<any>([]);
  const [donationsOrVouchers, setDonationsOrVouchers] = useState<any>([]);
  const [dbeSubsidy, setDbeSubsidy] = useState<any>([]);
  const [otherIncomeValues, setOtherIncomeValues] = useState<any>([]);

  const [rent, setRent] = useState<any>([]);
  const [food, setFood] = useState<any>([]);
  const [learningMaterials, setLearningMaterials] = useState<any>([]);
  const [maintenance, setMaintenance] = useState<any>([]);
  const [otherExpenseValues, setOtherExpenseValues] = useState<any>([]);
  const [utilities, setUtilities] = useState<any>([]);
  const [salary, setSalary] = useState<any>([]);

  useEffect(() => {
    const preschoolValue: IncomeStatementsDto[] = [];
    const startupValue: IncomeStatementsDto[] = [];
    const doantionValue: IncomeStatementsDto[] = [];
    const dbeSubsidyValue: IncomeStatementsDto[] = [];
    const otherValue: IncomeStatementsDto[] = [];

    income?.map((item: any) => {
      if (item?.incomeTypeId === preschoolIncome?.id) {
        preschoolValue.push(item);
        setPreschoolFees(preschoolValue);
      }
      if (item?.incomeTypeId === startupIncome?.id) {
        startupValue.push(item);
        setStartupSupport(startupValue);
      }
      if (item?.incomeTypeId === donationIncome?.id) {
        doantionValue.push(item);
        setDonationsOrVouchers(doantionValue);
      }
      if (item?.incomeTypeId === dbeSubsidyIncome?.id) {
        dbeSubsidyValue.push(item);
        setDbeSubsidy(dbeSubsidyValue);
      }
      if (item?.incomeTypeId === otherIncome?.id) {
        otherValue.push(item);
        setOtherIncomeValues(otherValue);
      }
      return null;
    });
  }, [
    dbeSubsidyIncome?.id,
    donationIncome?.id,
    income,
    otherIncome?.id,
    preschoolIncome?.id,
    startupIncome?.id,
  ]);

  useEffect(() => {
    const rentValue: ExpensesStatementsDto[] = [];
    const foodValue: ExpensesStatementsDto[] = [];
    const learningMaterialsValue: ExpensesStatementsDto[] = [];
    const maintenanceValue: ExpensesStatementsDto[] = [];
    const otherValue: ExpensesStatementsDto[] = [];
    const utilitiesValue: ExpensesStatementsDto[] = [];
    const salaryValue: ExpensesStatementsDto[] = [];

    expenses?.map((item: any) => {
      if (item?.expenseTypeId === rentExpense?.id) {
        rentValue.push(item);
        setRent(rentValue);
      }
      if (item?.expenseTypeId === foodExpense?.id) {
        foodValue.push(item);
        setFood(foodValue);
      }
      if (item?.expenseTypeId === learningMaterialsExpense?.id) {
        learningMaterialsValue.push(item);
        setLearningMaterials(learningMaterialsValue);
      }
      if (item?.expenseTypeId === maintenanceExpense?.id) {
        maintenanceValue.push(item);
        setMaintenance(maintenanceValue);
      }
      if (item?.expenseTypeId === otherExpense?.id) {
        otherValue.push(item);
        setOtherExpenseValues(otherValue);
      }
      if (item?.expenseTypeId === utilitiesExpense?.id) {
        utilitiesValue.push(item);
        setUtilities(utilitiesValue);
      }
      if (item?.expenseTypeId === salaryExpense?.id) {
        salaryValue.push(item);
        setSalary(salaryValue);
      }
      return null;
    });
  }, [
    dbeSubsidyIncome.id,
    donationIncome.id,
    expenses,
    food.id,
    foodExpense?.id,
    income,
    learningMaterials.id,
    learningMaterialsExpense?.id,
    maintenance.id,
    maintenanceExpense?.id,
    otherExpense?.id,
    otherIncome.id,
    preschoolIncome.id,
    rentExpense?.id,
    salary.id,
    salaryExpense?.id,
    startupIncome.id,
    utilities.id,
    utilitiesExpense?.id,
  ]);

  const updateStatements = async () => {
    if (userAuth?.auth_token) {
      appDispatch(
        statementsThunkActions.submitIncomeStatement({
          period: 'Monthly',
          userId: userAuth?.id!,
          month: submitMonth.getMonth() + 1, // +1 for 0 index
          year: submitMonth.getFullYear(),
        })
      ).then((result) => {
        if (result.meta.requestStatus === 'rejected') {
          showMessage({
            message: `Error submitting statement`,
            type: 'error',
          });
        } else {
          showMessage({
            message: `Statement submitted`,
          });
        }
      });
    }
  };

  const incomeItems = [
    {
      title: 'Preschool fees',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(preschoolFees)}`,
      notRounded: true,
    },
    {
      title: 'Start-up support',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(startupSupport)}`,
      notRounded: true,
    },
    {
      title: 'Donations or v..',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(donationsOrVouchers)}`,
      notRounded: true,
    },
    {
      title: 'DBE Subsidy',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(dbeSubsidy)}`,
      notRounded: true,
    },
    {
      title: 'Other',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(otherIncomeValues)}`,
      notRounded: true,
    },
  ];

  const expensesItems = [
    {
      title: 'Rent',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(rent)}`,
      notRounded: true,
    },
    {
      title: 'Salary & wages',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(salary)}`,
      notRounded: true,
    },
    {
      title: 'Food',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(food)}`,
      notRounded: true,
    },
    {
      title: 'Learning mater...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(learningMaterials)}`,
      notRounded: true,
    },
    {
      title: 'Annual Mainten...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(maintenance)}`,
      notRounded: true,
    },
    {
      title: 'Other',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(otherExpenseValues)}`,
      notRounded: true,
    },
    {
      title: 'Utilities',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => {},
      classNames: 'bg-uiBg',
      subItem: `R ${incomesValueFunc(utilities)}`,
      notRounded: true,
    },
  ];

  return (
    <BannerWrapper
      showBackground={false}
      size="medium"
      renderBorder={true}
      title={'Submit income statement'}
      subTitle={date}
      color={'primary'}
      onBack={goBack}
      displayOffline={!isOnline}
    >
      <div className="flex flex-col justify-center p-4">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textDark"
          text={`${format(submitMonth, 'LLLL')} balance`}
        />
        <StackedList
          className="mt-4 flex w-full flex-col"
          type="MenuList"
          listItems={incomeItems}
        />
        <Card
          className="bg-secondary flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total income'}
            type="body"
            color={'white'}
            className="w-8/12"
          />
          <Typography
            text={`R ${String(numberWithSpaces(totalIncome.toFixed(2)))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
        <StackedList
          className="mt-4 flex w-full flex-col"
          type="MenuList"
          listItems={expensesItems}
        />
        <Card
          className="bg-secondary flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total expenses'}
            type="body"
            color={'white'}
            className="w-9/12"
          />
          <Typography
            text={`R ${String(numberWithSpaces(totalExpenses.toFixed(2)))}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
        <Card
          className="bg-primaryAccent1 mt-4 flex items-center justify-around p-4"
          borderRaduis={'xl'}
          shadowSize={'md'}
        >
          <Typography
            text={'Balance'}
            type="h4"
            color={'white'}
            className="w-6/12"
          />
          <Typography
            text={`R ${String(totalBalance)}`}
            color={'white'}
            type="h1"
            className="w-8/12 text-right"
          />
        </Card>
        <Button
          shape="normal"
          color="primary"
          type="filled"
          icon="ArrowCircleRightIcon"
          onClick={() => setConfimSubmitIncomeValues(true)}
          className="mt-6 rounded-2xl"
        >
          <Typography
            type="help"
            color="white"
            text="Submit income statement"
          />
        </Button>
      </div>
      <Dialog
        className={'mb-16 px-4'}
        stretch
        visible={confimSubmitIncomeValues}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`Are you sure you want to submit your income statement?`}
          detailText={`Once you submit your ${format(
            new Date(),
            'LLLL'
          )} income statement, you will no longer be able to edit your income and expenses. Your signature will be added and your statement will be shared with SmartStart.`}
          actionButtons={[
            {
              text: 'Yes, submit',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => {
                updateStatements();
                setConfimSubmitIncomeValues(false);
                history.push(ROUTES.BUSINESS);
              },
              leadingIcon: 'ArrowCircleRightIcon',
            },
            {
              text: 'No, exit',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => {
                setConfimSubmitIncomeValues(false);
              },
              leadingIcon: 'ArrowLeftIcon',
            },
          ]}
        />
      </Dialog>
    </BannerWrapper>
  );
};
