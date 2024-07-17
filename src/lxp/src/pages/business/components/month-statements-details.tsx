import {
  Typography,
  Card,
  StackedList,
  Dialog,
  DialogPosition,
  Button,
} from '@ecdlink/ui';
import React, { useMemo, useState } from 'react';
import {
  sumIncomeOrExpenseItems,
  formatCurrency,
} from '@/utils/statements/statements-utils';
import { getMonthName } from '@/utils/classroom/attendance/track-attendance-utils';
import {
  ExpenseTypeIds,
  IncomeStatementDto,
  IncomeTypeIds,
} from '@ecdlink/core';
import { IncomeDetailsList } from './income-details-list.tsx/income-details-list';
import { ExpenseDetailsList } from './expense-details-list.tsx/expense-details-list';
import SecondaryFileEmoticon from '../../../assets/emoji_secondary_file.svg';
import ROUTES from '@/routes/routes';
import { useHistory } from 'react-router';

export type MonthStatementsDetailsProps = {
  statement: IncomeStatementDto;
};

export const MonthStatementsDetails: React.FC<MonthStatementsDetailsProps> = ({
  statement,
}) => {
  const history = useHistory();

  const statementTitle = `${getMonthName(statement.month - 1)} ${
    statement.year
  }`;

  const [showPreschoolDetails, setShowPreschoolDetails] = useState(false);
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

  // Totals
  const totalIncome = sumIncomeOrExpenseItems(statement.incomeItems);
  const totalExpenses = sumIncomeOrExpenseItems(statement.expenseItems);
  const totalBalance = totalIncome - totalExpenses;

  // Income values
  const preschoolFees = useMemo(
    () =>
      statement.incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.PRESCHOOL_FEE_ID
      ) || [],
    [statement]
  );
  const donationsOrVouchers = useMemo(
    () =>
      statement.incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.DONATION_ID
      ) || [],
    [statement]
  );
  const dbeSubsidy = useMemo(
    () =>
      statement.incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.DBE_SUBSIDY_ID
      ) || [],
    [statement]
  );
  const otherIncomeValues = useMemo(
    () =>
      statement.incomeItems.filter(
        (x) => x.incomeTypeId === IncomeTypeIds.OTHER_INCOME_ID
      ) || [],
    [statement]
  );

  // Expense values
  const rent = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.RENT_EXPENSE_ID
      ) || [],
    [statement]
  );
  const food = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.FOOD_EXPENSE_ID
      ) || [],
    [statement]
  );
  const learningMaterials = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.LEARNING_MATERIALS_ID
      ) || [],
    [statement]
  );
  const maintenance = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.MAINTENANCE_ID
      ) || [],
    [statement]
  );
  const otherExpenseValues = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.OTHER_EXPENSE_ID
      ) || [],
    [statement]
  );
  const utilities = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.UTILITIES_EXPENSE_ID
      ) || [],
    [statement]
  );
  const salary = useMemo(
    () =>
      statement.expenseItems.filter(
        (x) => x.expenseTypeId === ExpenseTypeIds.SALARY_EXPENSE_ID
      ) || [],
    [statement]
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(preschoolFees))}`,
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
      subItem: `R ${formatCurrency(
        sumIncomeOrExpenseItems(donationsOrVouchers)
      )}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(dbeSubsidy))}`,
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
      subItem: `R ${formatCurrency(
        sumIncomeOrExpenseItems(otherIncomeValues)
      )}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(rent))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(salary))}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(food))}`,
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
      subItem: `R ${formatCurrency(
        sumIncomeOrExpenseItems(learningMaterials)
      )}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(maintenance))}`,
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
      subItem: `R ${formatCurrency(
        sumIncomeOrExpenseItems(otherExpenseValues)
      )}`,
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
      subItem: `R ${formatCurrency(sumIncomeOrExpenseItems(utilities))}`,
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
        {!statement.incomeItems.length && (
          <Card className="bg-secondaryAccent2 my-4 flex flex-col justify-center rounded-2xl p-4">
            <div className="flex flex-row gap-3">
              <div className="rounded-full">
                <img
                  src={SecondaryFileEmoticon}
                  alt="income"
                  className="h-11 w-11"
                />
              </div>
              <Typography
                className="pt-2"
                color={'textDark'}
                type={'h3'}
                text={`You haven't added any income for ${getMonthName(
                  statement.month - 1
                )}!`}
              />
            </div>
            <Button
              text={`Add income`}
              icon={'PlusIcon'}
              type={'outlined'}
              color={'secondary'}
              background={'transparent'}
              textColor={'secondary'}
              className={'mt-4 max-h-10'}
              iconPosition={'start'}
              onClick={() => {
                history.push(ROUTES.BUSINESS_ADD_INCOME);
              }}
            />
          </Card>
        )}
        {!!statement.incomeItems.length && (
          <>
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
          </>
        )}
        {!statement.expenseItems.length && (
          <Card className="bg-secondaryAccent2 my-4 flex flex-col justify-center rounded-2xl p-4">
            <div className="flex flex-row gap-3">
              <div className="rounded-full">
                <img
                  src={SecondaryFileEmoticon}
                  alt="expense"
                  className="h-11 w-11"
                />
              </div>
              <Typography
                className="pt-2"
                color={'textDark'}
                type={'h3'}
                text={`You haven't added any expenses for ${getMonthName(
                  statement.month - 1
                )}!`}
              />
            </div>
            <Button
              text={`Add Expense`}
              icon={'PlusIcon'}
              type={'outlined'}
              color={'secondary'}
              background={'transparent'}
              textColor={'secondary'}
              className={'mt-4 max-h-10'}
              iconPosition={'start'}
              onClick={() => {
                history.push(ROUTES.BUSINESS_ADD_EXPENSE);
              }}
            />
          </Card>
        )}
        {!!statement.expenseItems.length && (
          <>
            <StackedList
              className="mt-4 flex w-full flex-col gap-1"
              type="MenuList"
              listItems={expenseItemsList}
            />
            <Card
              className="bg-secondary mt-2 flex items-center justify-between p-4"
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
          </>
        )}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
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
          statementMonth={statement.month - 1}
          statementId={statement.id}
        />
      </Dialog>
    </>
  );
};
