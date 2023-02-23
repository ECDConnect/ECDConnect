import ROUTES from '@/routes/routes';
import {
  Typography,
  Button,
  Card,
  StackedList,
  BannerWrapper,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import {
  ExpensesStatementsDto,
  IncomeStatementsDto,
} from '@/../../../packages/core/lib';
import { authSelectors } from '@/store/auth';
import { IncomeStatementsService } from '@/services/IncomeStatementsService';
import {
  incomesValueFunc,
  numberWithSpaces,
} from '@/utils/statements/statements-utils';
import { MonthStatementsDetailsState } from './month-statements-details.types';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import ExpensesStatementsService from '@/services/ExpensesStatementsService/ExpensesStatementsService';
import { PreschoolsFeesChildList } from './preschool-fees-details/preschool-fees-child-list';

export const MonthStatementsDetails: React.FC = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  const location = useLocation<MonthStatementsDetailsState>();
  const statementMonth = Number(location?.state?.month) || 0;
  const statementYear = Number(location?.state?.year) || 0;
  const statementTitle = `${getMonthName(
    Number(statementMonth) - 1
  )} ${statementYear}`;
  const { isOnline } = useOnlineStatus();

  const goBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  const [showPreschoolDetails, setShowPreschoolDetails] = useState(false);
  // const income = useSelector(statementsSelectors.getIncome);
  // const expenses = useSelector(statementsSelectors.getExpenses);
  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const [income, setIncome] = useState<IncomeStatementsDto[]>([]);
  const [expenses, setExpenses] = useState<ExpensesStatementsDto[]>([]);
  const submittedIncome = useMemo(
    () => income?.filter((item) => item?.submitted === true),
    [income]
  );
  const today = new Date();

  const isSameMonth =
    today.getMonth() + 1 === balanceSheet?.[balanceSheet?.length - 1]?.month!;

  const submittedExpenses = useMemo(
    () => expenses?.filter((item) => item?.submitted === true),
    [expenses]
  );

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
  const filteredIncome = isSameMonth ? income : submittedIncome;
  const filteredExpenses = isSameMonth ? expenses : submittedExpenses;

  const totalIncome = isSameMonth
    ? income?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0)
    : submittedIncome?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0);

  const totalExpenses = isSameMonth
    ? expenses?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0)
    : submittedExpenses?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0);

  const totalBalance = (totalIncome - totalExpenses)?.toFixed(2);

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

  useLayoutEffect(() => {
    const preschoolValue: IncomeStatementsDto[] = [];
    const startupValue: IncomeStatementsDto[] = [];
    const doantionValue: IncomeStatementsDto[] = [];
    const dbeSubsidyValue: IncomeStatementsDto[] = [];
    const otherValue: IncomeStatementsDto[] = [];

    filteredIncome?.map((item: any) => {
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
    filteredIncome,
    income,
    isSameMonth,
    otherIncome?.id,
    preschoolIncome?.id,
    startupIncome?.id,
    submittedIncome,
  ]);

  useEffect(() => {
    const rentValue: ExpensesStatementsDto[] = [];
    const foodValue: ExpensesStatementsDto[] = [];
    const learningMaterialsValue: ExpensesStatementsDto[] = [];
    const maintenanceValue: ExpensesStatementsDto[] = [];
    const otherValue: ExpensesStatementsDto[] = [];
    const utilitiesValue: ExpensesStatementsDto[] = [];
    const salaryValue: ExpensesStatementsDto[] = [];

    const expensesFiltered = isSameMonth ? expenses : submittedExpenses;

    expensesFiltered?.map((item: any) => {
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
    filteredExpenses,
    food.id,
    foodExpense?.id,
    isSameMonth,
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
    submittedExpenses,
    utilities.id,
    utilitiesExpense?.id,
  ]);

  useEffect(() => {
    const monthlyDetailsdata = async () => {
      const incomeData = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).allStatementsIncome(userAuth?.id!, statementMonth, statementYear);

      const expensesData = await new ExpensesStatementsService(
        userAuth?.auth_token!
      ).allStatementsExpenses(userAuth?.id!, statementMonth, statementYear);

      setIncome(incomeData);
      setExpenses(expensesData);
    };

    monthlyDetailsdata();
  }, [statementMonth, statementYear, userAuth?.auth_token, userAuth?.id]);

  const incomeItems = [
    {
      title: 'Preschool fees',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowPreschoolDetails(true),
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
    <>
      <BannerWrapper
        showBackground={false}
        size="medium"
        renderBorder={true}
        title={`View ${getMonthName(Number(statementMonth) - 1)} statement`}
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
            text={statementTitle}
          />
          <StackedList
            className="mt-4 flex w-full flex-col"
            type="MenuList"
            listItems={incomeItems}
          />
          <Card
            className="bg-successMain flex items-center justify-between p-4"
            shadowSize={'md'}
          >
            <Typography
              text={'Total income'}
              type="body"
              color={'white'}
              className="w-8/12"
            />
            <Typography
              text={`R ${String(numberWithSpaces(totalIncome?.toFixed(2)))}`}
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
            className="bg-tertiary flex items-center justify-between p-4"
            shadowSize={'md'}
          >
            <Typography
              text={'Total expenses'}
              type="body"
              color={'white'}
              className="w-9/12"
            />
            <Typography
              text={`R ${String(numberWithSpaces(totalExpenses?.toFixed(2)))}`}
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
              text={`R ${String(numberWithSpaces(String(totalBalance)))}`}
              color={'white'}
              type="h1"
              className="w-8/12 text-right"
            />
          </Card>
          <Button
            shape="normal"
            color="primary"
            type="filled"
            icon="DocumentDownloadIcon"
            onClick={() => {}}
            className="mt-6 rounded-2xl"
          >
            <Typography type="help" color="white" text="Download" />
          </Button>
        </div>
      </BannerWrapper>
      <Dialog
        stretch={true}
        visible={showPreschoolDetails}
        position={DialogPosition.Full}
      >
        <PreschoolsFeesChildList
          setShowPreschoolDetails={setShowPreschoolDetails}
          preschoolFees={preschoolFees}
        />
      </Dialog>
    </>
  );
};
