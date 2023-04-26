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
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { statementsSelectors } from '@/store/statements';
import {
  ExpensesStatementsDto,
  IncomeStatementsDto,
  ReportTableDataDto
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
import GeneratePdfReportButton from '../../../../../../../../src/components/download-pdf-button/download-pdf-button';
import { UserOptions } from 'jspdf-autotable';


export const MonthStatementsDetails: React.FC = () => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const history = useHistory();
  const { isOnline } = useOnlineStatus();
  const location = useLocation<MonthStatementsDetailsState>();
  const statementMonth = Number(location?.state?.month) || 0;
  const statementYear = Number(location?.state?.year) || 0;
  const statementTitle = `${getMonthName(
    Number(statementMonth) - 1
  )} ${statementYear}`;

  const goBack = () => {
    history.push(ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST);
  };

  const [showPreschoolDetails, setShowPreschoolDetails] = useState(false);
  const offlineIncome = useSelector(statementsSelectors.getIncome);
  const lowerCase = (str: any) => str[0].toLowerCase() + str.slice(1);
  const offlineIncomeLowerCase = useMemo(() => {
    return offlineIncome?.map((obj) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [lowerCase(k), v]))
    );
  }, [offlineIncome]);

  const offlineExpenses = useSelector(statementsSelectors.getExpenses);
  const offlineExpensesLowerCase = useMemo(() => {
    return offlineExpenses?.map((obj) =>
      Object.fromEntries(Object.entries(obj).map(([k, v]) => [lowerCase(k), v]))
    );
  }, [offlineExpenses]);
  const balanceSheet = useSelector(statementsSelectors.getBalanceSheet);
  const [income, setIncome] = useState<IncomeStatementsDto[]>([]);
  const [pdfReportData, setPdfReportData] = useState<ReportTableDataDto[]>([]);
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

  const offlineFilteredIncome = useMemo(() => {
    return isOnline ? filteredIncome : offlineIncomeLowerCase;
  }, [filteredIncome, isOnline, offlineIncomeLowerCase]);

  const offlineFilteredExpense = useMemo(() => {
    return isOnline ? filteredExpenses : offlineExpensesLowerCase;
  }, [filteredExpenses, isOnline, offlineExpensesLowerCase]);

  const totalIncome = isSameMonth
    ? income?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0)
    : submittedIncome?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0);

  const offlineTotalIncome = offlineIncomeLowerCase?.reduce(function (
    prev: any,
    current: any
  ) {
    return prev + +current.amount;
  },
  0);

  const totalExpenses = isSameMonth
    ? expenses?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0)
    : submittedExpenses?.reduce(function (prev: any, current: any) {
        return prev + +current.amount;
      }, 0);

  const offlineTotalExpenses = offlineExpensesLowerCase?.reduce(function (
    prev: any,
    current: any
  ) {
    return prev + +current.amount;
  },
  0);

  const totalBalance = (totalIncome - totalExpenses)?.toFixed(2);
  const offLineTotalBalance = (
    offlineTotalIncome - offlineTotalExpenses
  )?.toFixed(2);

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

    offlineFilteredIncome?.map((item: any) => {
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
    offlineFilteredIncome,
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

    offlineFilteredExpense?.map((item: any) => {
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
    offlineFilteredExpense,
    otherExpense?.id,
    otherIncome.id,
    preschoolIncome.id,
    rentExpense?.id,
    salary.id,
    isOnline,
    utilitiesExpense?.id,
    salaryExpense?.id,
  ]);

  useEffect(() => {
    const monthlyDetailsdata = async () => {
      const incomeData = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).allStatementsIncome(userAuth?.id!, statementMonth, statementYear);

      const expensesData = await new ExpensesStatementsService(
        userAuth?.auth_token!
      ).allStatementsExpenses(userAuth?.id!, statementMonth, statementYear);

      const report = await new IncomeStatementsService(
        userAuth?.auth_token!
      ).getMonthsIncomeExpensesReport(
        "5b821f79-a6ec-4cd9-846c-fe0f09ef8cdd",
        1,
        statementYear
      );
      console.log('>>', pdfReportData);
      setPdfReportData(report)
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

  const footer = [
    'Total',
    '', // Placeholder for Day 2 column
  ];

  const multipleTableData = [
    {
      tableName: 'Rent & Utilities',
      type: 'Expenses',
      total: 'R 100',
      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Invoice/Reciept #', dataKey: 'invoice' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        ...Array.from({ length: 18 }, (_, i) => ({
          date: '10/02/2023',
          description: 'Tissue Paper, Test One text',
          amount: 'R 500',
          invoice: 'XXXXX-XX-XXX',
        })),
      ],
    },
    {
      tableName: 'Pre-School Fees: monetary contributions',
      type: 'Income',
      total: 'R 100',
      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Child', dataKey: 'child' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        ...Array.from({ length: 8 }, (_, i) => ({
          child: 'John doe',
          date: '10/02/2023',
          amount: 'R 1, 0000',
          total: 'R 1, 0000',
        })),
      ],
    },
    {
      tableName: 'Salary & Wages',
      type: 'Expenses',
      total: 'R 100',

      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Invoice/Reciept #', dataKey: 'invoice' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        ...Array.from({ length: 10 }, (_, i) => ({
          date: '10/02/2023',
          description: 'Tissue Paper, Test One text',
          amount: 'R 500',
          invoice: 'XXXXX-XX-XXX',
        })),
      ],
    },
    {
      tableName: 'Food',
      type: 'Expenses',
      total: 'R 100',

      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Invoice/Reciept #', dataKey: 'invoice' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        {
          date: '10/02/2023',
          item: 'Tissue Paper, Test One text',
          amount: 'R 500',
          invoice: 'XXXXX-XX-XXX',
        },
      ],
    },
    {
      tableName: 'Learning Materials',
      type: 'Expenses',
      total: 'R 100',

      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Invoice/Reciept #', dataKey: 'invoice' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        {
          date: '10/02/2023',
          description: 'Tissue Paper, Test One text',
          amount: 'R 500',
          invoice: 'XXXXX-XX-XXX',
        },
      ],
    },
    {
      tableName: 'Annual Maintanance & purchases',
      type: 'Expenses',
      total: 'R 100',

      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Invoice/Reciept #', dataKey: 'invoice' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        {
          date: '10/02/2023',
          description: 'Tissue Paper, Test One text',
          amount: 'R 500',
          invoice: 'XXXXX-XX-XXX',
        },
      ],
    },
    {
      tableName: 'Annual Maintanance & purchases',
      type: 'Expenses',
      total: 'R 100',
      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Invoice/Reciept #', dataKey: 'invoice' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        {
          date: '10/02/2023',
          description: 'Tissue Paper, Test One text',
          amount: 'R 500',
          invoice: 'XXXXX-XX-XXX',
        },
      ],
    },
    {
      tableName: 'Pre-School Fees: non-monetary contributions',
      type: 'Income',
      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Child', dataKey: 'child' },
        { header: 'Item', dataKey: 'item' },
      ],
      data: [
        ...Array.from({ length: 5 }, (_, i) => ({
          child: 'Jane bere',
          date: '10/02/2023',
          item: 'Tissue Paper',
        })),
      ],
    },
    {
      tableName: 'Subsidies, Donations, Contributions',
      type: 'Income',
      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Item', dataKey: 'item' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        {
          date: '10/02/2023',
          item: 'Tissue Paper, Test One text',
          amount: 'R 500',
        },
        {
          date: '10/02/2023',
          item: 'Tissue Paper, Test One text',
          amount: 'R 500',
        },
      ],
    },
    {
      tableName: 'Other',
      type: 'Income',
      total: 'R 100',
      headers: [
        { header: 'Date', dataKey: 'date' },
        { header: 'Description', dataKey: 'description' },
        { header: 'Amount', dataKey: 'amount' },
      ],
      data: [
        {
          date: '10/02/2023',
          item: 'Tissue Paper, Test One text',
          amount: 'R 500',
        },
      ],
    },
  ];

  const tableTopContent = {
    pageTitle: `Income Statement`,
    subtitle: 'Text 2',
    //column1 with 3 rows of text
    text_coulumn_one_row_one: '',
    text_coulumn_one_row_two: '',
    text_coulumn_one_row_three: '',
    //column2 with 3 rows of text
    text_column_two_row_one: 'ProgrammeType: 46372test',
    text_column_two_row_two: 'Programmme Days: Monday to Friday',
    text_column_two_row_three: 'Site Address1234 ABC St, City, State, Country',
  };

  const tableHeadStyles: UserOptions['headStyles'] = {
    fillColor: [211, 211, 211], // Light grey
    textColor: [0, 0, 0],
    fontSize: 8,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableStyles: UserOptions['styles'] = {
    lineWidth: 0.1,
    lineColor: 0x000000,
  };
  const tableFootStyles: UserOptions['footStyles'] = {
    textColor: [0, 0, 0],
    fillColor: [211, 211, 211], // Light grey
    fontSize: 10,
    lineWidth: 0.1,
    lineColor: 0x000000,
  };

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
              text={
                isOnline
                  ? `R ${String(numberWithSpaces(totalIncome?.toFixed(2)))}`
                  : `R ${String(
                      numberWithSpaces(offlineTotalIncome?.toFixed(2))
                    )}`
              }
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
              text={
                isOnline
                  ? `R ${String(numberWithSpaces(totalExpenses?.toFixed(2)))}`
                  : `R ${String(
                      numberWithSpaces(offlineTotalExpenses?.toFixed(2))
                    )}`
              }
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
              text={
                isOnline
                  ? `R ${String(numberWithSpaces(String(totalBalance)))}`
                  : `R ${String(numberWithSpaces(String(offLineTotalBalance)))}`
              }
              color={'white'}
              type="h1"
              className="w-8/12 text-right"
            />
          </Card>
          <div className={'flex h-full w-full flex-1 flex-col px-4 py-4'}>
            {submittedExpenses && submittedIncome && (
              <GeneratePdfReportButton
                component="income-statements"
                title="Download Statement"
                outputName={`${getMonthName(
                  Number(statementMonth) - 1
                )}-income-statement-report.pdf`}
                tableFooter={footer}
                tableData={multipleTableData}
                content={tableTopContent}
                tableHeadStyles={tableHeadStyles}
                tableFootStyles={tableFootStyles}
                tableStyles={tableStyles}
                pageOriantations={'portrait'}
              />
            )}
          </div>
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
