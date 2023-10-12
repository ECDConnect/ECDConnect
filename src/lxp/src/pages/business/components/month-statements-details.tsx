import {
  Typography,
  Card,
  StackedList,
  Dialog,
  DialogPosition,
} from '@ecdlink/ui';
import React, { useMemo, useState } from 'react';
import {
  sumIncomeOrExpenseItems,
  formatCurrency,
} from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import {
  ExpenseItemDto,
  ExpenseTypeIds,
  IncomeItemDto,
  IncomeTypeIds,
} from '@ecdlink/core';
import { IncomeDetailsList } from './income-details-list.tsx/income-details-list';
import { ExpenseDetailsList } from './expense-details-list.tsx/expense-details-list';

export type MonthStatementsDetailsProps = {
  incomeItems: IncomeItemDto[];
  expenseItems: ExpenseItemDto[];
  month: number;
  year: number;
};

export const MonthStatementsDetails: React.FC<MonthStatementsDetailsProps> = ({
  incomeItems,
  expenseItems,
  month,
  year,
}) => {
  const statementTitle = `${getMonthName(month)} ${year}`;

  const [showPreschoolDetails, setShowPreschoolDetails] = useState(false);
  const [showStartupSupportDetails, setShowStartupSupportDetails] =
    useState(false);
  const [showDonationsOrVouchersDetails, setShowDonationsOrVouchersDetails] =
    useState(false);
  const [showDbeSubsidyDetails, setShowDbeSubsidyDetails] = useState(false);
  const [showOtherIncomeDetails, setShowOtherIncomeDetails] = useState(false);

  const [showRentDetails, setShowRentDetails] = useState(false);
  const [showFoodDetails, setShowFoodDetails] = useState(false);
  const [showLearningMaterialsDetails, setShowLearningMaterialsDetails] =
    useState(false);
  const [showMaintenanceDetails, setShowMaintenaceDetails] = useState(false);
  const [showOtherExpensesDetails, setShowOtherExpensesDetails] =
    useState(false);
  const [showUtilitiesDetails, setShowUtilitiesDetails] = useState(false);
  const [showSalaryDetails, setShowSalaryDetails] = useState(false);

  const today = new Date();

  // Totals
  const totalIncome = sumIncomeOrExpenseItems(incomeItems);
  const totalExpenses = sumIncomeOrExpenseItems(expenseItems);
  const totalBalance = totalIncome - totalExpenses;

  // Income values
  const preschoolFees = useMemo(
    () =>
      incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID
      ) || [],
    [incomeItems]
  );
  const startupSupport = useMemo(
    () =>
      incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.STARTUP_SUPPORT_ID
      ) || [],
    [incomeItems]
  );
  const donationsOrVouchers = useMemo(
    () =>
      incomeItems.filter((x) => x.incomeTypeId === IncomeTypeIds.DONATION_ID) ||
      [],
    [incomeItems]
  );
  const dbeSubsidy = useMemo(
    () =>
      incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.DBE_SUBSIDY_ID
      ) || [],
    [incomeItems]
  );
  const otherIncomeValues = useMemo(
    () =>
      incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.OTHER_INCOME_ID
      ) || [],
    [incomeItems]
  );

  // Expense values
  const rent = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.RENT_EXPENSE_ID
      ) || [],
    [expenseItems]
  );
  const food = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.FOOD_EXPENSE_ID
      ) || [],
    [expenseItems]
  );
  const learningMaterials = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.LEARNING_MATERIALS_ID
      ) || [],
    [expenseItems]
  );
  const maintenance = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.MAINTENANCE_ID
      ) || [],
    [expenseItems]
  );
  const otherExpenseValues = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.OTHER_EXPENSE_ID
      ) || [],
    [expenseItems]
  );
  const utilities = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.UTILITIES_EXPENSE_ID
      ) || [],
    [expenseItems]
  );
  const salary = useMemo(
    () =>
      expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.SALARY_EXPENSE_ID
      ) || [],
    [expenseItems]
  );

  const incomeItemsList = [
    {
      title: 'Preschool fees',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowPreschoolDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(preschoolFees)}`,
      notRounded: true,
    },
    {
      title: 'Start-up support',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowStartupSupportDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(startupSupport)}`,
      notRounded: true,
    },
    {
      title: 'Donations or v..',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowDonationsOrVouchersDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(donationsOrVouchers)}`,
      notRounded: true,
    },
    {
      title: 'DBE Subsidy',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowDbeSubsidyDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(dbeSubsidy)}`,
      notRounded: true,
    },
    {
      title: 'Other',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowOtherIncomeDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(otherIncomeValues)}`,
      notRounded: true,
    },
  ];

  const expenseItemsList = [
    {
      title: 'Rent',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowRentDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(rent)}`,
      notRounded: true,
    },
    {
      title: 'Salary & wages',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowSalaryDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(salary)}`,
      notRounded: true,
    },
    {
      title: 'Food',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowFoodDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(food)}`,
      notRounded: true,
    },
    {
      title: 'Learning mater...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowLearningMaterialsDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(learningMaterials)}`,
      notRounded: true,
    },
    {
      title: 'Annual Mainten...',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowMaintenaceDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(maintenance)}`,
      notRounded: true,
    },
    {
      title: 'Other',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowOtherExpensesDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(otherExpenseValues)}`,
      notRounded: true,
    },
    {
      title: 'Utilities',
      titleStyle: 'text-textDark font-semibold text-base leading-snug',
      subTitleStyle:
        'text-sm font-h1 font-normal text-textMid w-9/12 overflow-clip',
      text: '1',
      onActionClick: () => setShowUtilitiesDetails(true),
      classNames: 'bg-uiBg',
      subItem: `R ${sumIncomeOrExpenseItems(utilities)}`,
      notRounded: true,
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-center p-4">
        <Typography
          className="truncate"
          type="h2"
          weight="bold"
          color="textDark"
          text={statementTitle}
        />
        <StackedList
          className="mt-4 flex w-full flex-col gap-1"
          type="MenuList"
          listItems={incomeItemsList}
        />
        <Card
          className="bg-successMain mt-2 flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total income'}
            type="body"
            color={'white'}
            className="w-8/12"
          />
          <Typography
            text={`R ${formatCurrency(totalIncome)}`}
            color={'white'}
            type="h4"
            className="mr-12 w-4/12 text-right"
          />
        </Card>
        <StackedList
          className="mt-4 flex w-full flex-col gap-1"
          type="MenuList"
          listItems={expenseItemsList}
        />
        <Card
          className="bg-tertiary mt-2 flex items-center justify-between p-4"
          shadowSize={'md'}
        >
          <Typography
            text={'Total expenses'}
            type="body"
            color={'white'}
            className="w-9/12"
          />
          <Typography
            text={`R ${formatCurrency(totalExpenses)}`}
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
            text={`R ${formatCurrency(totalBalance)}`}
            color={'white'}
            type="h1"
            className="w-8/12 text-right"
          />
        </Card>
      </div>

      <Dialog
        stretch={true}
        visible={showPreschoolDetails}
        position={DialogPosition.Full}
      >
        <IncomeDetailsList
          hideDetails={() => setShowPreschoolDetails(false)}
          incomeItems={preschoolFees}
          statementTitle="Preschool fees"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showStartupSupportDetails}
        position={DialogPosition.Full}
      >
        <IncomeDetailsList
          hideDetails={() => setShowStartupSupportDetails(false)}
          incomeItems={startupSupport}
          statementTitle="Startup support"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showDonationsOrVouchersDetails}
        position={DialogPosition.Full}
      >
        <IncomeDetailsList
          hideDetails={() => setShowDonationsOrVouchersDetails(false)}
          incomeItems={donationsOrVouchers}
          statementTitle="Donations or vouchers"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showDbeSubsidyDetails}
        position={DialogPosition.Full}
      >
        <IncomeDetailsList
          hideDetails={() => setShowDbeSubsidyDetails(false)}
          incomeItems={dbeSubsidy}
          statementTitle="DBE Subsidy"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showOtherIncomeDetails}
        position={DialogPosition.Full}
      >
        <IncomeDetailsList
          hideDetails={() => setShowOtherIncomeDetails(false)}
          incomeItems={otherIncomeValues}
          statementTitle="Other income"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showRentDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowRentDetails(false)}
          expenseItems={rent}
          statementTitle="Rent"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showFoodDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowFoodDetails(false)}
          expenseItems={food}
          statementTitle="Food"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showLearningMaterialsDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowLearningMaterialsDetails(false)}
          expenseItems={learningMaterials}
          statementTitle="Learning materials"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showMaintenanceDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowMaintenaceDetails(false)}
          expenseItems={maintenance}
          statementTitle="Maintenance"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showOtherExpensesDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowOtherExpensesDetails(false)}
          expenseItems={otherExpenseValues}
          statementTitle="Other Expenses"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showUtilitiesDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowUtilitiesDetails(false)}
          expenseItems={utilities}
          statementTitle="Utilities"
          statementMonth={month}
        />
      </Dialog>
      <Dialog
        stretch={true}
        visible={showSalaryDetails}
        position={DialogPosition.Full}
      >
        <ExpenseDetailsList
          hideDetails={() => setShowSalaryDetails(false)}
          expenseItems={salary}
          statementTitle="Salary"
          statementMonth={month}
        />
      </Dialog>
    </>
  );
};
